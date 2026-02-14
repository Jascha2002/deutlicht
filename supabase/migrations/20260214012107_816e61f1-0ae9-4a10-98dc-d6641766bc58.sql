
-- Fix SUBSTRING positions in all number generation triggers
-- Lead: L26-XXXXX format, need FROM 5 (skip 'L26-')
CREATE OR REPLACE FUNCTION public.generate_lead_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(lead_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_leads
  WHERE lead_number LIKE 'L' || year_prefix || '-%';
  
  NEW.lead_number := 'L' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$function$;

-- Partner: P26-XXXX format, need FROM 5 (skip 'P26-')
CREATE OR REPLACE FUNCTION public.generate_partner_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(partner_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.partners
  WHERE partner_number LIKE 'P' || year_prefix || '-%';
  
  NEW.partner_number := 'P' || year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN NEW;
END;
$function$;

-- Protocol: AP-YYYY-XXXXX format, FROM 9 (skip 'AP-YYYY-')  
-- Currently FROM 6 which gives 'YYYY-XXXXX' -> not castable. Let's check format.
-- AP-2026-00001: length of 'AP-2026-' = 8, so FROM 9
CREATE OR REPLACE FUNCTION public.generate_protocol_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(protocol_number FROM 9) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_acceptance_protocols
  WHERE protocol_number LIKE 'AP-' || year_prefix || '-%';
  
  NEW.protocol_number := 'AP-' || year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN NEW;
END;
$function$;

-- Report: e.g. DA26-XXXX format, FROM 5 gives 'XXXX' -> correct for 2-char prefix
-- But BB26-XXXX also FROM 5 gives 'XXXX' -> correct
-- Actually check: 'DA26-0001' substring from 5 = '-0001' -> wrong! Need FROM 6
CREATE OR REPLACE FUNCTION public.generate_report_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
  type_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  
  CASE NEW.report_type
    WHEN 'digitalisierungsanalyse' THEN type_prefix := 'DA';
    WHEN 'beratungsbericht' THEN type_prefix := 'BB';
    WHEN 'statusbericht' THEN type_prefix := 'SB';
    WHEN 'abschlussbericht' THEN type_prefix := 'AB';
    ELSE type_prefix := 'BE';
  END CASE;
  
  -- Format: DA26-XXXX (prefix=2, year=2, dash=1 = 5 chars before number, so FROM 6)
  SELECT COALESCE(MAX(CAST(SUBSTRING(report_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_reports
  WHERE report_number LIKE type_prefix || year_prefix || '-%';
  
  NEW.report_number := type_prefix || year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN NEW;
END;
$function$;
