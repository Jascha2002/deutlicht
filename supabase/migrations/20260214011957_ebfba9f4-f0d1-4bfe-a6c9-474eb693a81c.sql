
-- Fix project number generation trigger: SUBSTRING position was wrong (4 instead of 5)
CREATE OR REPLACE FUNCTION public.generate_project_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.crm_projects
  WHERE project_number LIKE 'P' || year_prefix || '-%';
  
  NEW.project_number := 'P' || year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN NEW;
END;
$function$;
