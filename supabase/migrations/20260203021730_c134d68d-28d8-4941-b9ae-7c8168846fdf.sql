
-- =====================================================
-- SCHRITT 1: AUFTRÄGE (crm_orders)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE,
  
  -- Verknüpfungen
  offer_id UUID REFERENCES public.crm_offers(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  
  -- Auftragsdaten
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'bestaetigt' CHECK (status IN ('entwurf', 'bestaetigt', 'in_bearbeitung', 'abgeschlossen', 'storniert')),
  
  -- Beträge
  amount_net NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 19.00,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_gross NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  -- Termine
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  
  -- Kundenunterschrift
  customer_signature TEXT,
  customer_signed_at TIMESTAMPTZ,
  customer_signed_name TEXT,
  customer_signed_ip INET,
  
  -- Auftragsbestätigung
  confirmation_sent_at TIMESTAMPTZ,
  confirmation_pdf_url TEXT,
  
  -- Meta
  internal_notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger für Auftragsnummer
CREATE OR REPLACE FUNCTION public.generate_order_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_orders
  WHERE order_number LIKE 'AU-' || year_prefix || '%';
  
  NEW.order_number := 'AU-' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_order_number ON public.crm_orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.crm_orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION public.generate_order_number();

-- RLS
ALTER TABLE public.crm_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins und Mitarbeiter können Aufträge verwalten" ON public.crm_orders;
CREATE POLICY "Admins und Mitarbeiter können Aufträge verwalten"
ON public.crm_orders FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Indizes
CREATE INDEX IF NOT EXISTS idx_crm_orders_company ON public.crm_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_orders_project ON public.crm_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_crm_orders_offer ON public.crm_orders(offer_id);
CREATE INDEX IF NOT EXISTS idx_crm_orders_status ON public.crm_orders(status);

-- Updated at Trigger
DROP TRIGGER IF EXISTS update_crm_orders_updated_at ON public.crm_orders;
CREATE TRIGGER update_crm_orders_updated_at
  BEFORE UPDATE ON public.crm_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
