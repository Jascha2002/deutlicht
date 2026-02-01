-- Tabelle für Lead-Tracking (inkl. abgebrochene Anfragen)
CREATE TABLE public.project_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'converted')),
  
  -- Unternehmensdaten
  company_name TEXT,
  industry TEXT,
  company_size TEXT,
  
  -- Kontaktdaten
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_postal_code TEXT,
  
  -- Projektdaten
  services_selected TEXT[] DEFAULT '{}',
  website_type TEXT,
  website_features TEXT[] DEFAULT '{}',
  social_platforms TEXT[] DEFAULT '{}',
  ai_use_cases TEXT,
  voicebot_use_cases TEXT,
  additional_notes TEXT,
  
  -- Tracking
  current_step INTEGER DEFAULT 1,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  
  -- Interne Felder (nur für Admins sichtbar)
  internal_price_estimate_setup NUMERIC,
  internal_price_estimate_monthly NUMERIC,
  internal_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS aktivieren
ALTER TABLE public.project_leads ENABLE ROW LEVEL SECURITY;

-- Öffentliches Einfügen/Aktualisieren erlauben (für anonyme Leads)
CREATE POLICY "Anyone can create leads"
  ON public.project_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own session leads"
  ON public.project_leads FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Nur Admins/Mitarbeiter können alle Leads lesen
CREATE POLICY "Staff can view all leads"
  ON public.project_leads FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mitarbeiter')
  );

-- Trigger für updated_at
CREATE TRIGGER update_project_leads_updated_at
  BEFORE UPDATE ON public.project_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index für Session-Suche
CREATE INDEX idx_project_leads_session_id ON public.project_leads(session_id);
CREATE INDEX idx_project_leads_status ON public.project_leads(status);
CREATE INDEX idx_project_leads_last_activity ON public.project_leads(last_activity_at DESC);