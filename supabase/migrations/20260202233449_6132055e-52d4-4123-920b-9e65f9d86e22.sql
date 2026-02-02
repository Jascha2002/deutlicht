-- =====================================================
-- PRODUKTDATENBANK & WIEDERVORLAGE-SYSTEM
-- =====================================================

-- Produkt-Kategorien Enum
CREATE TYPE public.product_category AS ENUM (
  'website',
  'hosting',
  'seo',
  'ki_agent',
  'voicebot',
  'social_media',
  'beratung',
  'prozess',
  'branchenloesung',
  'service'
);

-- Preis-Typ Enum (einmalig oder wiederkehrend)
CREATE TYPE public.price_type AS ENUM (
  'einmalig',
  'monatlich',
  'jaehrlich'
);

-- =====================================================
-- PRODUKTE TABELLE
-- =====================================================
CREATE TABLE public.crm_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_code VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  
  -- Preisgestaltung
  price_setup DECIMAL(10,2) DEFAULT 0,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  
  -- Eigenschaften
  features JSONB DEFAULT '[]',
  target_group TEXT,
  implementation_weeks INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  -- Metadaten
  source VARCHAR(50), -- 'branchenPakete', 'websitePakete', etc.
  source_id VARCHAR(50), -- Original-ID aus der Quelle
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  modified_by UUID REFERENCES auth.users(id)
);

-- Index für schnelle Suche
CREATE INDEX idx_crm_products_category ON public.crm_products(category);
CREATE INDEX idx_crm_products_active ON public.crm_products(is_active);
CREATE INDEX idx_crm_products_code ON public.crm_products(product_code);

-- =====================================================
-- WIEDERVORLAGEN TABELLE
-- =====================================================
CREATE TABLE public.crm_followups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Referenzen (einer davon sollte gesetzt sein)
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES public.crm_offers(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.crm_invoices(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  
  -- Wiedervorlage Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  followup_type VARCHAR(50) DEFAULT 'anruf', -- anruf, email, termin, sonstiges
  priority VARCHAR(20) DEFAULT 'normal', -- niedrig, normal, hoch, dringend
  
  -- Zeitplanung
  due_date DATE NOT NULL,
  due_time TIME,
  reminder_date DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'offen', -- offen, erledigt, verschoben, storniert
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES auth.users(id),
  
  -- Zuständigkeit
  assigned_to UUID REFERENCES auth.users(id),
  
  -- Ergebnis
  result TEXT,
  
  -- Metadaten
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indizes für Wiedervorlagen
CREATE INDEX idx_crm_followups_due_date ON public.crm_followups(due_date);
CREATE INDEX idx_crm_followups_status ON public.crm_followups(status);
CREATE INDEX idx_crm_followups_assigned ON public.crm_followups(assigned_to);
CREATE INDEX idx_crm_followups_offer ON public.crm_followups(offer_id);

-- =====================================================
-- KALENDER-TERMINE TABELLE
-- =====================================================
CREATE TABLE public.crm_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Event Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  event_type VARCHAR(50) DEFAULT 'termin', -- termin, meeting, wiedervorlage, deadline
  
  -- Zeitplanung
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT false,
  
  -- Referenzen (optional)
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  followup_id UUID REFERENCES public.crm_followups(id) ON DELETE SET NULL,
  
  -- Google Calendar Sync
  google_event_id VARCHAR(255),
  google_calendar_id VARCHAR(255),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  
  -- Teilnehmer (als Array von User-IDs oder Emails)
  attendees JSONB DEFAULT '[]',
  
  -- Status
  status VARCHAR(20) DEFAULT 'geplant', -- geplant, bestaetigt, abgesagt, verschoben
  
  -- Zuständigkeit
  owner_id UUID REFERENCES auth.users(id),
  
  -- Metadaten
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indizes für Kalender
CREATE INDEX idx_crm_calendar_start ON public.crm_calendar_events(start_time);
CREATE INDEX idx_crm_calendar_owner ON public.crm_calendar_events(owner_id);
CREATE INDEX idx_crm_calendar_google ON public.crm_calendar_events(google_event_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Produkte: Jeder kann lesen, nur Admins können schreiben
ALTER TABLE public.crm_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produkte sind lesbar für authentifizierte Nutzer"
  ON public.crm_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins und Mitarbeiter können Produkte verwalten"
  ON public.crm_products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Wiedervorlagen: Nur Admins und Mitarbeiter
ALTER TABLE public.crm_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wiedervorlagen für Admins und Mitarbeiter sichtbar"
  ON public.crm_followups FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Wiedervorlagen Verwaltung für Admins und Mitarbeiter"
  ON public.crm_followups FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Kalender-Events: Nur Admins und Mitarbeiter
ALTER TABLE public.crm_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kalender für Admins und Mitarbeiter sichtbar"
  ON public.crm_calendar_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Kalender Verwaltung für Admins und Mitarbeiter"
  ON public.crm_calendar_events FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- =====================================================
-- TRIGGER für updated_at
-- =====================================================
CREATE TRIGGER update_crm_products_updated_at
  BEFORE UPDATE ON public.crm_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_followups_updated_at
  BEFORE UPDATE ON public.crm_followups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_calendar_events_updated_at
  BEFORE UPDATE ON public.crm_calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();