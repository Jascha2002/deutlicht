-- Fix the invoice number generation trigger with simpler logic
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Simple count based approach
  SELECT COUNT(*) + 1 INTO next_number
  FROM public.crm_invoices
  WHERE invoice_number LIKE 'RE-' || year_prefix || '-%';
  
  NEW.invoice_number := 'RE-' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$function$;