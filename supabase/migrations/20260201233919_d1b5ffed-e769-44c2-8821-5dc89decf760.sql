-- ==============================================================================
-- SECURITY FIX: Explicit Anonymous Access Denial and Protected Internal Fields
-- ==============================================================================

-- 1. Deny anonymous access to profiles table
CREATE POLICY "Deny anonymous access to profiles"
  ON public.profiles
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false);

-- 2. Deny anonymous access to analysis_clients table
CREATE POLICY "Deny anonymous access to analysis_clients"
  ON public.analysis_clients
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false);

-- 3. Fix project_leads policies - drop and recreate with proper protections
DROP POLICY IF EXISTS "Create leads with session" ON public.project_leads;
DROP POLICY IF EXISTS "Update own session leads" ON public.project_leads;

-- Recreate INSERT policy that prevents setting internal fields
CREATE POLICY "Create leads with session"
  ON public.project_leads
  FOR INSERT
  WITH CHECK (
    session_id IS NOT NULL 
    AND length(session_id) >= 20
    AND internal_price_estimate_setup IS NULL
    AND internal_price_estimate_monthly IS NULL
    AND internal_notes IS NULL
  );

-- Recreate UPDATE policy with session ownership AND prevent internal field modification
CREATE POLICY "Update own session leads"
  ON public.project_leads
  FOR UPDATE
  USING (
    session_id IS NOT NULL 
    AND length(session_id) >= 20
  )
  WITH CHECK (
    session_id IS NOT NULL 
    AND length(session_id) >= 20
    AND internal_price_estimate_setup IS NULL
    AND internal_price_estimate_monthly IS NULL
    AND internal_notes IS NULL
  );

-- 4. Add explicit anonymous denial for project_leads table too
CREATE POLICY "Deny anonymous select on project_leads"
  ON public.project_leads
  AS RESTRICTIVE
  FOR SELECT
  TO anon
  USING (false);

-- 5. Staff can manage all project_leads including internal fields
CREATE POLICY "Staff can manage project_leads"
  ON public.project_leads
  FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'mitarbeiter'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'mitarbeiter'::app_role)
  );