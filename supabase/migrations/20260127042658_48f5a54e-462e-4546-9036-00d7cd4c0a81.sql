-- Partner-Tabelle erweitern um Bankdaten, Partner-ID, Vertragsstatus
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS partner_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS iban TEXT,
ADD COLUMN IF NOT EXISTS bic TEXT,
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS account_holder TEXT,
ADD COLUMN IF NOT EXISTS contract_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS contract_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS contract_signed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS withdrawal_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMP WITH TIME ZONE;

-- Partner-Abrechnungen/Rechnungen Tabelle erstellen
CREATE TABLE IF NOT EXISTS public.partner_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  net_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  vat_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  gross_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  rejection_reason TEXT,
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS für Partner-Rechnungen aktivieren
ALTER TABLE public.partner_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies für partner_invoices
CREATE POLICY "Partner können eigene Rechnungen sehen"
ON public.partner_invoices
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_invoices.partner_id
    AND partners.user_id = auth.uid()
  )
);

CREATE POLICY "Partner können eigene Rechnungen erstellen"
ON public.partner_invoices
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_invoices.partner_id
    AND partners.user_id = auth.uid()
  )
);

CREATE POLICY "Admins und Mitarbeiter können alle Rechnungen sehen"
ON public.partner_invoices
FOR SELECT
USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'mitarbeiter')
);

CREATE POLICY "Admins können Rechnungen verwalten"
ON public.partner_invoices
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Funktion zum Generieren einer Partner-Nummer
CREATE OR REPLACE FUNCTION public.generate_partner_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(partner_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.partners
  WHERE partner_number LIKE 'P' || year_prefix || '%';
  
  NEW.partner_number := 'P' || year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger für automatische Partner-Nummer
DROP TRIGGER IF EXISTS set_partner_number ON public.partners;
CREATE TRIGGER set_partner_number
  BEFORE INSERT ON public.partners
  FOR EACH ROW
  WHEN (NEW.partner_number IS NULL)
  EXECUTE FUNCTION public.generate_partner_number();

-- Trigger für updated_at auf partner_invoices
CREATE OR REPLACE FUNCTION public.update_partner_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_partner_invoices_updated_at
  BEFORE UPDATE ON public.partner_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_partner_invoices_updated_at();