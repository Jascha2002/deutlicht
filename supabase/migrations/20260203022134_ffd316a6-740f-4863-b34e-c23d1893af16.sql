
-- =====================================================
-- SCHRITT 4: DOKUMENTENDATENBANK (crm_documents)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_number TEXT UNIQUE,
  
  -- Dokumenttyp
  document_type TEXT NOT NULL CHECK (document_type IN (
    'angebot', 'auftragsbestaetigung', 'auftrag', 'vertrag', 
    'rechnung', 'gutschrift', 'mahnung', 'abnahmeprotokoll',
    'bericht', 'protokoll', 'korrespondenz', 'sonstiges'
  )),
  
  -- Verknüpfungen (polymorph)
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES public.crm_offers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.crm_orders(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.crm_invoices(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES public.crm_contracts(id) ON DELETE SET NULL,
  protocol_id UUID REFERENCES public.crm_acceptance_protocols(id) ON DELETE SET NULL,
  
  -- Dokumentdaten
  title TEXT NOT NULL,
  description TEXT,
  version INTEGER DEFAULT 1,
  
  -- Datei
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  
  -- Status
  status TEXT DEFAULT 'aktiv' CHECK (status IN ('entwurf', 'aktiv', 'archiviert', 'geloescht')),
  
  -- Versand
  sent_at TIMESTAMPTZ,
  sent_to TEXT,
  sent_by UUID,
  
  -- Meta
  tags TEXT[],
  internal_notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger für Dokumentnummer
CREATE OR REPLACE FUNCTION public.generate_document_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
  type_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  CASE NEW.document_type
    WHEN 'angebot' THEN type_prefix := 'DOC-A';
    WHEN 'auftragsbestaetigung' THEN type_prefix := 'DOC-AB';
    WHEN 'auftrag' THEN type_prefix := 'DOC-AU';
    WHEN 'vertrag' THEN type_prefix := 'DOC-V';
    WHEN 'rechnung' THEN type_prefix := 'DOC-R';
    WHEN 'abnahmeprotokoll' THEN type_prefix := 'DOC-AP';
    ELSE type_prefix := 'DOC';
  END CASE;
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(document_number FROM LENGTH(type_prefix) + 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_documents
  WHERE document_number LIKE type_prefix || '-' || year_prefix || '%';
  
  NEW.document_number := type_prefix || '-' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_document_number ON public.crm_documents;
CREATE TRIGGER set_document_number
  BEFORE INSERT ON public.crm_documents
  FOR EACH ROW
  WHEN (NEW.document_number IS NULL)
  EXECUTE FUNCTION public.generate_document_number();

-- RLS
ALTER TABLE public.crm_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins und Mitarbeiter können Dokumente verwalten" ON public.crm_documents;
CREATE POLICY "Admins und Mitarbeiter können Dokumente verwalten"
ON public.crm_documents FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Indizes
CREATE INDEX IF NOT EXISTS idx_crm_documents_company ON public.crm_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_documents_type ON public.crm_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_crm_documents_project ON public.crm_documents(project_id);

-- Updated at Trigger
DROP TRIGGER IF EXISTS update_crm_documents_updated_at ON public.crm_documents;
CREATE TRIGGER update_crm_documents_updated_at
  BEFORE UPDATE ON public.crm_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SCHRITT 5: RECHNUNGSPOSITIONEN (crm_invoice_items)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.crm_invoices(id) ON DELETE CASCADE,
  
  -- Herkunft
  order_item_id UUID REFERENCES public.crm_order_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.crm_products(id) ON DELETE SET NULL,
  
  -- Position
  position_number INTEGER NOT NULL DEFAULT 1,
  
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
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_gross NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.crm_invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins und Mitarbeiter können Rechnungspositionen verwalten" ON public.crm_invoice_items;
CREATE POLICY "Admins und Mitarbeiter können Rechnungspositionen verwalten"
ON public.crm_invoice_items FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Index
CREATE INDEX IF NOT EXISTS idx_crm_invoice_items_invoice ON public.crm_invoice_items(invoice_id);

-- =====================================================
-- SCHRITT 6: VERKNÜPFUNGEN ZU BESTEHENDEN TABELLEN
-- =====================================================
-- Verknüpfung: Rechnung zu Auftrag
ALTER TABLE public.crm_invoices 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.crm_orders(id) ON DELETE SET NULL;

-- Verknüpfung: Vertrag zu Auftrag
ALTER TABLE public.crm_contracts 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.crm_orders(id) ON DELETE SET NULL;
