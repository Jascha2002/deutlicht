-- Add company_id to profiles to link users to CRM companies
ALTER TABLE public.profiles 
ADD COLUMN company_id uuid REFERENCES public.crm_companies(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);

-- RLS: Allow customers to read their own company's projects
CREATE POLICY "Kunden can view own company projects"
ON public.crm_projects
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT p.company_id FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.company_id IS NOT NULL
  )
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'mitarbeiter')
);

-- RLS: Allow customers to read their own company's orders
CREATE POLICY "Kunden can view own company orders"
ON public.crm_orders
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT p.company_id FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.company_id IS NOT NULL
  )
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'mitarbeiter')
);

-- RLS: Allow customers to read their own company's invoices
CREATE POLICY "Kunden can view own company invoices"
ON public.crm_invoices
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT p.company_id FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.company_id IS NOT NULL
  )
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'mitarbeiter')
);