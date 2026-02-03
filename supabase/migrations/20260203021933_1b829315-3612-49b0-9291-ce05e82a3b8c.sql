
-- =====================================================
-- SCHRITT 2: AUFTRAGSPOSITIONEN (crm_order_items)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.crm_orders(id) ON DELETE CASCADE,
  
  -- Position
  position_number INTEGER NOT NULL DEFAULT 1,
  product_id UUID REFERENCES public.crm_products(id) ON DELETE SET NULL,
  
  -- Beschreibung
  title TEXT NOT NULL,
  description TEXT,
  
  -- Preise
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'Stück',
  unit_price_net NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  amount_net NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 19.00,
  
  -- Status
  status TEXT DEFAULT 'offen' CHECK (status IN ('offen', 'in_bearbeitung', 'erledigt', 'abgenommen', 'storniert')),
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.crm_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins und Mitarbeiter können Auftragspositionen verwalten" ON public.crm_order_items;
CREATE POLICY "Admins und Mitarbeiter können Auftragspositionen verwalten"
ON public.crm_order_items FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Index
CREATE INDEX IF NOT EXISTS idx_crm_order_items_order ON public.crm_order_items(order_id);

-- =====================================================
-- SCHRITT 3: ABNAHMEPROTOKOLLE (crm_acceptance_protocols)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_acceptance_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol_number TEXT UNIQUE,
  
  -- Verknüpfungen
  order_id UUID REFERENCES public.crm_orders(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  
  -- Protokolldaten
  title TEXT NOT NULL,
  description TEXT,
  acceptance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'zur_abnahme', 'abgenommen', 'abgelehnt', 'nachbesserung')),
  
  -- Abnahmedetails
  items_accepted JSONB DEFAULT '[]',
  overall_result TEXT CHECK (overall_result IN ('vollstaendig_abgenommen', 'mit_maengeln_abgenommen', 'abgelehnt')),
  defects_noted TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_deadline DATE,
  
  -- Kundenabnahme
  customer_signature TEXT,
  customer_signed_at TIMESTAMPTZ,
  customer_signed_name TEXT,
  customer_signed_position TEXT,
  customer_comments TEXT,
  
  -- Interne Unterschrift
  our_signature TEXT,
  our_signed_at TIMESTAMPTZ,
  our_signed_name TEXT,
  
  -- Dokument
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  
  -- Meta
  internal_notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger für Protokollnummer
CREATE OR REPLACE FUNCTION public.generate_protocol_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(protocol_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_acceptance_protocols
  WHERE protocol_number LIKE 'AP-' || year_prefix || '%';
  
  NEW.protocol_number := 'AP-' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_protocol_number ON public.crm_acceptance_protocols;
CREATE TRIGGER set_protocol_number
  BEFORE INSERT ON public.crm_acceptance_protocols
  FOR EACH ROW
  WHEN (NEW.protocol_number IS NULL)
  EXECUTE FUNCTION public.generate_protocol_number();

-- RLS
ALTER TABLE public.crm_acceptance_protocols ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins und Mitarbeiter können Abnahmeprotokolle verwalten" ON public.crm_acceptance_protocols;
CREATE POLICY "Admins und Mitarbeiter können Abnahmeprotokolle verwalten"
ON public.crm_acceptance_protocols FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Indizes
CREATE INDEX IF NOT EXISTS idx_crm_acceptance_protocols_company ON public.crm_acceptance_protocols(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_acceptance_protocols_order ON public.crm_acceptance_protocols(order_id);

-- Updated at Trigger
DROP TRIGGER IF EXISTS update_crm_acceptance_protocols_updated_at ON public.crm_acceptance_protocols;
CREATE TRIGGER update_crm_acceptance_protocols_updated_at
  BEFORE UPDATE ON public.crm_acceptance_protocols
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
