-- Fix the invoice number generation trigger (uses 4-digit year format)
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
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM POSITION('-' IN REVERSE(invoice_number)) + LENGTH('RE-' || year_prefix || '-') - LENGTH(invoice_number)) AS INTEGER)
  ), 0) + 1
  INTO next_number
  FROM public.crm_invoices
  WHERE invoice_number LIKE 'RE-' || year_prefix || '-%';
  
  IF next_number IS NULL THEN
    next_number := 1;
  END IF;
  
  NEW.invoice_number := 'RE-' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$function$;

-- Fix the offer number generation trigger
CREATE OR REPLACE FUNCTION public.generate_offer_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN offer_number ~ '^A[0-9]{2}-[0-9]+$' 
      THEN CAST(SUBSTRING(offer_number FROM 5) AS INTEGER)
      ELSE 0
    END
  ), 0) + 1
  INTO next_number
  FROM public.crm_offers
  WHERE offer_number LIKE 'A' || year_prefix || '-%';
  
  NEW.offer_number := 'A' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$function$;

-- Fix the order number generation trigger
CREATE OR REPLACE FUNCTION public.generate_order_number()
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
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN order_number ~ '^AU-[0-9]{4}-[0-9]+$' 
      THEN CAST(SUBSTRING(order_number FROM 9) AS INTEGER)
      ELSE 0
    END
  ), 0) + 1
  INTO next_number
  FROM public.crm_orders
  WHERE order_number LIKE 'AU-' || year_prefix || '-%';
  
  NEW.order_number := 'AU-' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$function$;