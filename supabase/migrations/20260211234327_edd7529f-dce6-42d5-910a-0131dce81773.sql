
-- Kontakt-Typ und Erfassungskanal für crm_companies
ALTER TABLE public.crm_companies 
  ADD COLUMN IF NOT EXISTS contact_type text NOT NULL DEFAULT 'interessent',
  ADD COLUMN IF NOT EXISTS source_channel text NOT NULL DEFAULT 'vertrieb',
  ADD COLUMN IF NOT EXISTS contact_person_name text,
  ADD COLUMN IF NOT EXISTS contact_person_position text,
  ADD COLUMN IF NOT EXISTS contact_person_phone text,
  ADD COLUMN IF NOT EXISTS contact_person_email text;

-- Kommentar für Dokumentation
COMMENT ON COLUMN public.crm_companies.contact_type IS 'lead, interessent, kunde';
COMMENT ON COLUMN public.crm_companies.source_channel IS 'website, vertrieb, partner, telefon';
