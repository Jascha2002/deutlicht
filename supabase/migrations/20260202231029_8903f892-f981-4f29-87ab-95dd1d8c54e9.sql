-- =====================================================
-- CRM-Erweiterung: Projekte, Angebote, Rechnungen, Berichte
-- DeutLicht-Kompass Komplettintegration
-- =====================================================

-- Enum für Projektstatus
CREATE TYPE public.project_status AS ENUM (
  'planung',
  'aktiv',
  'pausiert',
  'abgeschlossen',
  'abgebrochen'
);

-- Enum für Angebotsstatus
CREATE TYPE public.offer_status AS ENUM (
  'entwurf',
  'gesendet',
  'angesehen',
  'angenommen',
  'abgelehnt',
  'abgelaufen'
);

-- Enum für Rechnungsstatus  
CREATE TYPE public.invoice_status AS ENUM (
  'entwurf',
  'gesendet',
  'ueberfaellig',
  'bezahlt',
  'storniert',
  'mahnung'
);

-- =====================================================
-- CRM Projekte (Kundenvorgänge)
-- =====================================================
CREATE TABLE public.crm_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_number TEXT UNIQUE,
  
  -- Verknüpfungen
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  analysis_client_id UUID REFERENCES public.analysis_clients(id) ON DELETE SET NULL,
  legacy_project_id UUID REFERENCES public.customer_projects(id) ON DELETE SET NULL,
  
  -- Projektinfos
  title TEXT NOT NULL,
  description TEXT,
  status public.project_status DEFAULT 'planung',
  
  -- Zeitrahmen
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  
  -- Finanzen (Zusammenfassung)
  budget_setup NUMERIC(12,2) DEFAULT 0,
  budget_monthly NUMERIC(12,2) DEFAULT 0,
  total_invoiced NUMERIC(12,2) DEFAULT 0,
  total_paid NUMERIC(12,2) DEFAULT 0,
  
  -- Leistungen
  services_included TEXT[],
  
  -- Zuständigkeiten
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadaten
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Projektnummer-Generator
CREATE OR REPLACE FUNCTION public.generate_project_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_projects
  WHERE project_number LIKE 'P' || year_prefix || '%';
  
  NEW.project_number := 'P' || year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER generate_crm_project_number
  BEFORE INSERT ON public.crm_projects
  FOR EACH ROW
  WHEN (NEW.project_number IS NULL)
  EXECUTE FUNCTION public.generate_project_number();

-- =====================================================
-- CRM Angebote
-- =====================================================
CREATE TABLE public.crm_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_number TEXT UNIQUE,
  
  -- Verknüpfungen
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
  legacy_project_lead_id UUID REFERENCES public.project_leads(id) ON DELETE SET NULL,
  
  -- Angebotsdetails
  title TEXT NOT NULL,
  description TEXT,
  status public.offer_status DEFAULT 'entwurf',
  
  -- Preise
  amount_setup NUMERIC(12,2) DEFAULT 0,
  amount_monthly NUMERIC(12,2) DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 19.00,
  amount_total NUMERIC(12,2) GENERATED ALWAYS AS (
    (amount_setup + amount_monthly * 12) * (1 - discount_percent / 100) - discount_amount
  ) STORED,
  currency TEXT DEFAULT 'EUR',
  
  -- Leistungspositionen (JSON Array)
  line_items JSONB DEFAULT '[]'::jsonb,
  
  -- Gültigkeit
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_until DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  
  -- Dokumente
  pdf_url TEXT,
  signed_pdf_url TEXT,
  
  -- Annahme
  accepted_at TIMESTAMPTZ,
  accepted_by TEXT,
  rejection_reason TEXT,
  
  -- Vom Angebotsgenerator
  form_data JSONB,
  
  -- Metadaten
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ
);

-- Angebotsnummer-Generator
CREATE OR REPLACE FUNCTION public.generate_offer_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(offer_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_offers
  WHERE offer_number LIKE 'A' || year_prefix || '%';
  
  NEW.offer_number := 'A' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER generate_crm_offer_number
  BEFORE INSERT ON public.crm_offers
  FOR EACH ROW
  WHEN (NEW.offer_number IS NULL)
  EXECUTE FUNCTION public.generate_offer_number();

-- =====================================================
-- CRM Rechnungen
-- =====================================================
CREATE TABLE public.crm_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE,
  
  -- Verknüpfungen
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES public.crm_offers(id) ON DELETE SET NULL,
  legacy_invoice_id UUID REFERENCES public.customer_invoices(id) ON DELETE SET NULL,
  
  -- Rechnungsdetails
  title TEXT NOT NULL,
  description TEXT,
  status public.invoice_status DEFAULT 'entwurf',
  invoice_type TEXT DEFAULT 'rechnung', -- 'rechnung', 'anzahlung', 'schlussrechnung', 'abonnement'
  
  -- Beträge
  amount_net NUMERIC(12,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 19.00,
  tax_amount NUMERIC(12,2) GENERATED ALWAYS AS (amount_net * tax_rate / 100) STORED,
  amount_gross NUMERIC(12,2) GENERATED ALWAYS AS (amount_net * (1 + tax_rate / 100)) STORED,
  amount_paid NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  
  -- Positionen
  line_items JSONB DEFAULT '[]'::jsonb,
  
  -- Termine
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  paid_date DATE,
  
  -- Mahnwesen
  reminder_count INTEGER DEFAULT 0,
  last_reminder_date DATE,
  
  -- Dokumente
  pdf_url TEXT,
  
  -- Zahlungsinfo
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Abonnement (für wiederkehrende Rechnungen)
  is_recurring BOOLEAN DEFAULT false,
  recurring_interval TEXT, -- 'monatlich', 'quartalsweise', 'jaehrlich'
  next_invoice_date DATE,
  
  -- Metadaten
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ
);

-- Rechnungsnummer-Generator
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_invoices
  WHERE invoice_number LIKE 'RE-' || year_prefix || '%';
  
  NEW.invoice_number := 'RE-' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER generate_crm_invoice_number
  BEFORE INSERT ON public.crm_invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL)
  EXECUTE FUNCTION public.generate_invoice_number();

-- =====================================================
-- CRM Berichte (Beratungsberichte & Analysen)
-- =====================================================
CREATE TABLE public.crm_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_number TEXT UNIQUE,
  
  -- Verknüpfungen
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  analysis_client_id UUID REFERENCES public.analysis_clients(id) ON DELETE SET NULL,
  
  -- Berichtsdetails
  report_type TEXT NOT NULL, -- 'digitalisierungsanalyse', 'beratungsbericht', 'statusbericht', 'abschlussbericht'
  title TEXT NOT NULL,
  
  -- Inhalt
  content_markdown TEXT,
  content_html TEXT,
  summary TEXT,
  
  -- Scores und Ergebnisse (für Analysen)
  analysis_score INTEGER,
  analysis_results JSONB,
  recommendations JSONB,
  
  -- Dokumente
  pdf_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'entwurf', -- 'entwurf', 'review', 'freigegeben', 'versendet'
  
  -- Freigabe
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  
  -- Versand
  sent_to_client_at TIMESTAMPTZ,
  sent_to_email TEXT,
  
  -- Metadaten
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Berichtsnummer-Generator
CREATE OR REPLACE FUNCTION public.generate_report_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
  type_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  -- Prefix basierend auf Berichtstyp
  CASE NEW.report_type
    WHEN 'digitalisierungsanalyse' THEN type_prefix := 'DA';
    WHEN 'beratungsbericht' THEN type_prefix := 'BB';
    WHEN 'statusbericht' THEN type_prefix := 'SB';
    WHEN 'abschlussbericht' THEN type_prefix := 'AB';
    ELSE type_prefix := 'BE';
  END CASE;
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(report_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_reports
  WHERE report_number LIKE type_prefix || year_prefix || '%';
  
  NEW.report_number := type_prefix || year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER generate_crm_report_number
  BEFORE INSERT ON public.crm_reports
  FOR EACH ROW
  WHEN (NEW.report_number IS NULL)
  EXECUTE FUNCTION public.generate_report_number();

-- =====================================================
-- CRM Projektaktivitäten (für Projekt-Timeline)
-- =====================================================
CREATE TABLE public.crm_project_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE CASCADE NOT NULL,
  
  activity_type TEXT NOT NULL, -- 'note', 'status_change', 'meeting', 'call', 'email', 'offer_sent', 'invoice_sent', 'payment'
  title TEXT NOT NULL,
  description TEXT,
  
  -- Verknüpfungen zu Dokumenten
  offer_id UUID REFERENCES public.crm_offers(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.crm_invoices(id) ON DELETE SET NULL,
  report_id UUID REFERENCES public.crm_reports(id) ON DELETE SET NULL,
  
  -- Metadaten
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- Indizes für Performance
-- =====================================================
CREATE INDEX idx_crm_projects_company ON public.crm_projects(company_id);
CREATE INDEX idx_crm_projects_lead ON public.crm_projects(lead_id);
CREATE INDEX idx_crm_projects_status ON public.crm_projects(status);
CREATE INDEX idx_crm_offers_company ON public.crm_offers(company_id);
CREATE INDEX idx_crm_offers_project ON public.crm_offers(project_id);
CREATE INDEX idx_crm_offers_status ON public.crm_offers(status);
CREATE INDEX idx_crm_invoices_company ON public.crm_invoices(company_id);
CREATE INDEX idx_crm_invoices_project ON public.crm_invoices(project_id);
CREATE INDEX idx_crm_invoices_status ON public.crm_invoices(status);
CREATE INDEX idx_crm_invoices_due_date ON public.crm_invoices(due_date);
CREATE INDEX idx_crm_reports_project ON public.crm_reports(project_id);
CREATE INDEX idx_crm_reports_analysis ON public.crm_reports(analysis_client_id);
CREATE INDEX idx_crm_project_activities_project ON public.crm_project_activities(project_id);

-- =====================================================
-- RLS Policies
-- =====================================================

-- Projekte
ALTER TABLE public.crm_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins und Mitarbeiter können Projekte lesen"
  ON public.crm_projects FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Projekte erstellen"
  ON public.crm_projects FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Projekte bearbeiten"
  ON public.crm_projects FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Projekte löschen"
  ON public.crm_projects FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Angebote
ALTER TABLE public.crm_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins und Mitarbeiter können Angebote lesen"
  ON public.crm_offers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Angebote erstellen"
  ON public.crm_offers FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Angebote bearbeiten"
  ON public.crm_offers FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Angebote löschen"
  ON public.crm_offers FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Rechnungen
ALTER TABLE public.crm_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins und Mitarbeiter können Rechnungen lesen"
  ON public.crm_invoices FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Rechnungen erstellen"
  ON public.crm_invoices FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Rechnungen bearbeiten"
  ON public.crm_invoices FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Rechnungen löschen"
  ON public.crm_invoices FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Berichte
ALTER TABLE public.crm_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins und Mitarbeiter können Berichte lesen"
  ON public.crm_reports FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Berichte erstellen"
  ON public.crm_reports FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Berichte bearbeiten"
  ON public.crm_reports FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Berichte löschen"
  ON public.crm_reports FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Projektaktivitäten
ALTER TABLE public.crm_project_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins und Mitarbeiter können Projektaktivitäten lesen"
  ON public.crm_project_activities FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins und Mitarbeiter können Projektaktivitäten erstellen"
  ON public.crm_project_activities FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Updated_at Trigger für alle neuen Tabellen
CREATE TRIGGER update_crm_projects_updated_at
  BEFORE UPDATE ON public.crm_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_offers_updated_at
  BEFORE UPDATE ON public.crm_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_invoices_updated_at
  BEFORE UPDATE ON public.crm_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_reports_updated_at
  BEFORE UPDATE ON public.crm_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();