
-- 1. Add user_id to crm_companies to link a company to a user account
ALTER TABLE public.crm_companies
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Add company_id to customer_templates for company-based assignment
ALTER TABLE public.customer_templates
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE;

-- 3. Update RLS on customer_templates: customers can see templates assigned to their company
DROP POLICY IF EXISTS "Customers can view own templates" ON public.customer_templates;
CREATE POLICY "Customers can view own templates" ON public.customer_templates
  FOR SELECT TO authenticated
  USING (
    customer_id = auth.uid()
    OR company_id IN (SELECT id FROM public.crm_companies WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'mitarbeiter')
  );

-- 4. Ensure admin/mitarbeiter can insert/update/delete customer_templates
DROP POLICY IF EXISTS "Admins can manage customer_templates" ON public.customer_templates;
CREATE POLICY "Admins can manage customer_templates" ON public.customer_templates
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'mitarbeiter')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'mitarbeiter')
  );
