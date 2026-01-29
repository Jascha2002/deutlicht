-- Remove overly permissive policies that expose data to all authenticated users
-- The existing role-based policies are sufficient for proper access control

DROP POLICY IF EXISTS "Authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users only" ON public.partner_invoices;