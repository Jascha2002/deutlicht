-- Robust template access via company linkage (owner user_id OR profile.company_id)
CREATE OR REPLACE FUNCTION public.get_accessible_company_ids(_user_id uuid DEFAULT auth.uid())
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT c.id
  FROM public.crm_companies c
  WHERE c.user_id = _user_id
  UNION
  SELECT p.company_id
  FROM public.profiles p
  WHERE p.user_id = _user_id
    AND p.company_id IS NOT NULL;
$$;

-- Customer can read own company record in portal
DROP POLICY IF EXISTS "Kunden können eigene Firma sehen" ON public.crm_companies;
CREATE POLICY "Kunden können eigene Firma sehen"
ON public.crm_companies
FOR SELECT
USING (
  has_role(auth.uid(), 'kunde')
  AND id IN (SELECT public.get_accessible_company_ids(auth.uid()))
);

-- Consolidate customer_templates SELECT policy
DROP POLICY IF EXISTS "Customers can view own templates" ON public.customer_templates;
DROP POLICY IF EXISTS "Users can read own template assignments" ON public.customer_templates;
CREATE POLICY "Users can read own template assignments"
ON public.customer_templates
FOR SELECT
USING (
  has_role(auth.uid(), 'admin')
  OR has_role(auth.uid(), 'mitarbeiter')
  OR customer_id = auth.uid()
  OR company_id IN (SELECT public.get_accessible_company_ids(auth.uid()))
);

-- Update templates SELECT policy to use secure definer helper
DROP POLICY IF EXISTS "Users can read assigned active templates" ON public.templates;
CREATE POLICY "Users can read assigned active templates"
ON public.templates
FOR SELECT
USING (
  is_active = true
  AND (
    has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'mitarbeiter')
    OR id IN (
      SELECT ct.template_id
      FROM public.customer_templates ct
      WHERE ct.customer_id = auth.uid()
         OR ct.company_id IN (SELECT public.get_accessible_company_ids(auth.uid()))
    )
  )
);