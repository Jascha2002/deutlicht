-- =====================================================
-- MODUL 2: CRM-Kern mit Lead-Integration
-- =====================================================

-- 1. Enum für Firmenrollen
CREATE TYPE public.company_role_type AS ENUM (
  'kunde',
  'partner', 
  'freelancer_eu',
  'freelancer_drittland',
  'lieferant',
  'interessent',
  'lead'
);

-- 2. Enum für Steuerstatus
CREATE TYPE public.tax_region AS ENUM (
  'deutschland',
  'eu',
  'drittland'
);

-- 3. Enum für Vertragstypen
CREATE TYPE public.contract_type AS ENUM (
  'rahmenvertrag',
  'einzelvertrag',
  'nda',
  'avv',
  'retainer',
  'projektvertrag'
);

-- 4. Lead-Status für Verkaufsprozess
CREATE TYPE public.lead_status AS ENUM (
  'neu',
  'kontaktiert',
  'qualifiziert',
  'angebot_erstellt',
  'verhandlung',
  'gewonnen',
  'verloren',
  'inaktiv'
);

-- 5. Lead-Quellen
CREATE TYPE public.lead_source AS ENUM (
  'projektanfrage',
  'kontaktformular',
  'partner_referral',
  'website',
  'telefon',
  'messe',
  'empfehlung',
  'social_media',
  'google_ads',
  'sonstige'
);

-- =====================================================
-- HAUPTTABELLEN
-- =====================================================

-- 6. Firmen/Unternehmen (zentrale Entität)
CREATE TABLE public.crm_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basisdaten
  company_name text NOT NULL,
  legal_form text, -- GmbH, UG, AG, Einzelunternehmen, etc.
  trade_name text, -- Handelsname falls abweichend
  
  -- Internationale Adressfelder
  street text,
  street_number text,
  address_line_2 text, -- Zusatz (c/o, Gebäude, etc.)
  postal_code text,
  city text,
  state_province text, -- Bundesland/Provinz
  country text DEFAULT 'Deutschland',
  country_code char(2) DEFAULT 'DE', -- ISO 3166-1 alpha-2
  
  -- Kontaktdaten Firma
  phone text,
  phone_secondary text,
  email text,
  website text,
  
  -- Steuerliche Klassifizierung
  tax_region tax_region DEFAULT 'deutschland',
  vat_id text, -- USt-ID (DE...)
  tax_number text, -- Steuernummer
  foreign_tax_id text, -- Ausländische Steuernummer
  is_reverse_charge boolean DEFAULT false,
  is_small_business boolean DEFAULT false, -- Kleinunternehmerregelung
  
  -- Zahlungsinformationen
  payment_currency char(3) DEFAULT 'EUR', -- ISO 4217
  payment_terms_days integer DEFAULT 14,
  iban text,
  bic text,
  bank_name text,
  account_holder text,
  
  -- Unternehmensdaten
  industry text,
  employee_count text,
  annual_revenue text,
  founded_year integer,
  
  -- DSGVO-Felder
  gdpr_consent_given boolean DEFAULT false,
  gdpr_consent_date timestamptz,
  gdpr_consent_purpose text,
  gdpr_data_source text,
  gdpr_deletion_deadline date,
  gdpr_last_activity timestamptz,
  
  -- Interne Felder
  internal_notes text,
  tags text[],
  is_active boolean DEFAULT true,
  
  -- Audit
  created_by uuid REFERENCES auth.users(id),
  modified_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indizes
CREATE INDEX idx_crm_companies_name ON public.crm_companies(company_name);
CREATE INDEX idx_crm_companies_country ON public.crm_companies(country_code);
CREATE INDEX idx_crm_companies_tax_region ON public.crm_companies(tax_region);
CREATE INDEX idx_crm_companies_vat_id ON public.crm_companies(vat_id);

-- 7. Kontakte/Ansprechpartner
CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personendaten
  salutation text, -- Herr, Frau, Divers
  title text, -- Dr., Prof., etc.
  first_name text NOT NULL,
  last_name text NOT NULL,
  
  -- Kontaktdaten
  email text,
  phone text,
  phone_mobile text,
  
  -- Position
  position text,
  department text,
  
  -- Kommunikationspräferenzen
  preferred_language char(2) DEFAULT 'de',
  preferred_contact_method text, -- email, phone, video
  
  -- Eigene Adresse (falls abweichend von Firma)
  has_own_address boolean DEFAULT false,
  street text,
  postal_code text,
  city text,
  country text,
  country_code char(2),
  
  -- DSGVO
  gdpr_consent_given boolean DEFAULT false,
  gdpr_consent_date timestamptz,
  gdpr_newsletter_consent boolean DEFAULT false,
  
  -- Verknüpfung zu auth.users (falls registriert)
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Meta
  internal_notes text,
  tags text[],
  is_active boolean DEFAULT true,
  
  -- Audit
  created_by uuid REFERENCES auth.users(id),
  modified_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_crm_contacts_email ON public.crm_contacts(email);
CREATE INDEX idx_crm_contacts_name ON public.crm_contacts(last_name, first_name);
CREATE INDEX idx_crm_contacts_user_id ON public.crm_contacts(user_id);

-- 8. Zuordnung Firma <-> Kontakt (M:N)
CREATE TABLE public.crm_company_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  
  -- Rolle in der Firma
  is_primary boolean DEFAULT false, -- Hauptansprechpartner
  is_billing_contact boolean DEFAULT false,
  is_technical_contact boolean DEFAULT false,
  role_description text,
  
  -- Gültigkeit
  valid_from date DEFAULT CURRENT_DATE,
  valid_until date,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(company_id, contact_id)
);

CREATE INDEX idx_company_contacts_company ON public.crm_company_contacts(company_id);
CREATE INDEX idx_company_contacts_contact ON public.crm_company_contacts(contact_id);

-- 9. Firmenrollen (eine Firma kann mehrere Rollen haben)
CREATE TABLE public.crm_company_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  
  role_type company_role_type NOT NULL,
  
  -- Rollenspezifische Daten
  commission_rate numeric(5,2), -- Für Partner
  credit_limit numeric(12,2), -- Für Kunden
  payment_rating integer CHECK (payment_rating BETWEEN 1 AND 5),
  
  -- Gültigkeit
  valid_from date DEFAULT CURRENT_DATE,
  valid_until date,
  is_active boolean DEFAULT true,
  
  -- Verknüpfung zu Legacy-Tabellen
  legacy_partner_id uuid REFERENCES public.partners(id),
  
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(company_id, role_type)
);

CREATE INDEX idx_company_roles_company ON public.crm_company_roles(company_id);
CREATE INDEX idx_company_roles_type ON public.crm_company_roles(role_type);

-- 10. Verträge
CREATE TABLE public.crm_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Vertragsparteien
  company_id uuid NOT NULL REFERENCES public.crm_companies(id),
  contact_id uuid REFERENCES public.crm_contacts(id), -- Unterzeichner
  
  -- Vertragsdaten
  contract_type contract_type NOT NULL,
  contract_number text UNIQUE,
  title text NOT NULL,
  description text,
  
  -- Laufzeit
  start_date date NOT NULL,
  end_date date,
  is_indefinite boolean DEFAULT false,
  notice_period_days integer,
  auto_renewal boolean DEFAULT false,
  renewal_period_months integer,
  
  -- Konditionen
  value numeric(12,2),
  currency char(3) DEFAULT 'EUR',
  payment_terms text,
  
  -- Status
  status text DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'versendet', 'unterzeichnet', 'aktiv', 'gekuendigt', 'beendet', 'storniert')),
  signed_at timestamptz,
  terminated_at timestamptz,
  termination_reason text,
  
  -- Dokumente
  document_url text,
  signed_document_url text,
  
  -- Audit
  created_by uuid REFERENCES auth.users(id),
  modified_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contracts_company ON public.crm_contracts(company_id);
CREATE INDEX idx_contracts_type ON public.crm_contracts(contract_type);
CREATE INDEX idx_contracts_status ON public.crm_contracts(status);

-- 11. CRM Leads (zentrale Lead-Tabelle für Kompass)
CREATE TABLE public.crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Lead-Nummer (formatiert)
  lead_number text UNIQUE,
  
  -- Quelle
  source lead_source NOT NULL,
  source_detail text, -- z.B. welches Formular, welcher Partner
  source_url text, -- Referrer URL
  
  -- Verknüpfung zu bestehenden Leads
  legacy_project_lead_id uuid REFERENCES public.project_leads(id),
  partner_referral_id uuid REFERENCES public.partner_referrals(id),
  
  -- Kontaktdaten (vor Konvertierung zu Company/Contact)
  company_name text,
  contact_first_name text,
  contact_last_name text,
  contact_email text,
  contact_phone text,
  
  -- Adresse
  street text,
  postal_code text,
  city text,
  country text DEFAULT 'Deutschland',
  
  -- Anfrage-Details
  industry text,
  company_size text,
  services_interested text[], -- Welche Leistungen
  project_description text,
  budget_range text,
  timeline text,
  
  -- Qualifizierung
  status lead_status NOT NULL DEFAULT 'neu',
  priority integer DEFAULT 3 CHECK (priority BETWEEN 1 AND 5), -- 1=höchste
  score integer DEFAULT 0, -- Lead-Score
  
  -- Zuordnung
  assigned_to uuid REFERENCES auth.users(id),
  assigned_at timestamptz,
  
  -- Konvertierung
  converted_at timestamptz,
  converted_company_id uuid REFERENCES public.crm_companies(id),
  converted_contact_id uuid REFERENCES public.crm_contacts(id),
  converted_by uuid REFERENCES auth.users(id),
  
  -- Aktivität
  last_contact_at timestamptz,
  next_followup_at timestamptz,
  followup_notes text,
  
  -- Verloren-Gründe
  lost_reason text,
  lost_to_competitor text,
  
  -- Odoo-Sync
  odoo_lead_id integer,
  odoo_synced_at timestamptz,
  
  -- Interne Schätzung
  estimated_value numeric(12,2),
  
  -- Meta
  internal_notes text,
  tags text[],
  
  -- Audit
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX idx_crm_leads_source ON public.crm_leads(source);
CREATE INDEX idx_crm_leads_assigned ON public.crm_leads(assigned_to);
CREATE INDEX idx_crm_leads_email ON public.crm_leads(contact_email);
CREATE INDEX idx_crm_leads_created ON public.crm_leads(created_at DESC);

-- 12. Lead-Aktivitäten (Timeline)
CREATE TABLE public.crm_lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  
  activity_type text NOT NULL, -- 'note', 'call', 'email', 'meeting', 'status_change', 'assignment'
  title text,
  description text,
  
  -- Bei Statusänderungen
  old_status lead_status,
  new_status lead_status,
  
  -- Planung
  scheduled_at timestamptz,
  completed_at timestamptz,
  
  -- Audit
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_activities_lead ON public.crm_lead_activities(lead_id);

-- =====================================================
-- FUNKTIONEN
-- =====================================================

-- Lead-Nummer generieren
CREATE OR REPLACE FUNCTION public.generate_lead_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(lead_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_leads
  WHERE lead_number LIKE 'L' || year_prefix || '%';
  
  NEW.lead_number := 'L' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_lead_number
  BEFORE INSERT ON public.crm_leads
  FOR EACH ROW
  WHEN (NEW.lead_number IS NULL)
  EXECUTE FUNCTION public.generate_lead_number();

-- Updated_at Trigger für alle neuen Tabellen
CREATE TRIGGER update_crm_companies_updated_at
  BEFORE UPDATE ON public.crm_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_company_roles_updated_at
  BEFORE UPDATE ON public.crm_company_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_contracts_updated_at
  BEFORE UPDATE ON public.crm_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_leads_updated_at
  BEFORE UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_company_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_activities ENABLE ROW LEVEL SECURITY;

-- CRM Companies
CREATE POLICY "Staff kann Firmen sehen" ON public.crm_companies FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Firmen erstellen" ON public.crm_companies FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Firmen bearbeiten" ON public.crm_companies FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Firmen löschen" ON public.crm_companies FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- CRM Contacts
CREATE POLICY "Staff kann Kontakte sehen" ON public.crm_contacts FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Kontakte erstellen" ON public.crm_contacts FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Kontakte bearbeiten" ON public.crm_contacts FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Kontakte löschen" ON public.crm_contacts FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Company Contacts Zuordnung
CREATE POLICY "Staff kann Zuordnungen sehen" ON public.crm_company_contacts FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Zuordnungen verwalten" ON public.crm_company_contacts FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

-- Company Roles
CREATE POLICY "Staff kann Rollen sehen" ON public.crm_company_roles FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Rollen verwalten" ON public.crm_company_roles FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

-- Contracts (sensibel - nur Admin full access)
CREATE POLICY "Staff kann Verträge sehen" ON public.crm_contracts FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Verträge erstellen" ON public.crm_contracts FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Verträge bearbeiten" ON public.crm_contracts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Nur Admins können Verträge löschen" ON public.crm_contracts FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Leads
CREATE POLICY "Staff kann Leads sehen" ON public.crm_leads FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Leads erstellen" ON public.crm_leads FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Leads bearbeiten" ON public.crm_leads FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Leads löschen" ON public.crm_leads FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Lead Activities
CREATE POLICY "Staff kann Aktivitäten sehen" ON public.crm_lead_activities FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff kann Aktivitäten erstellen" ON public.crm_lead_activities FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Nur Admins können Aktivitäten löschen" ON public.crm_lead_activities FOR DELETE
  USING (has_role(auth.uid(), 'admin'));