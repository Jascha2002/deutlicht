
-- Fix templates RLS: also allow access via company_id linkage
DROP POLICY IF EXISTS "Users can read assigned active templates" ON public.templates;

CREATE POLICY "Users can read assigned active templates"
ON public.templates FOR SELECT
USING (
  is_active = true AND (
    has_role(auth.uid(), 'admin') OR
    has_role(auth.uid(), 'mitarbeiter') OR
    id IN (
      SELECT ct.template_id FROM customer_templates ct
      WHERE ct.customer_id = auth.uid()
         OR ct.company_id IN (
           SELECT c.id FROM crm_companies c WHERE c.user_id = auth.uid()
         )
    )
  )
);
