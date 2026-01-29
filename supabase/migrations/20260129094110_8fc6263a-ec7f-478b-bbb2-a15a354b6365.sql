-- Add explicit policies to deny anonymous access to profiles and partner_invoices tables
-- These tables contain PII and financial data that should never be accessible to anonymous users

-- Profiles table: Add a permissive SELECT policy that requires authentication
-- This ensures only authenticated users can trigger the existing restrictive policies
CREATE POLICY "Authenticated users only"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Partner invoices table: Add a permissive SELECT policy that requires authentication  
-- This ensures only authenticated users can trigger the existing restrictive policies
CREATE POLICY "Authenticated users only"
ON public.partner_invoices
FOR SELECT
TO authenticated
USING (true);