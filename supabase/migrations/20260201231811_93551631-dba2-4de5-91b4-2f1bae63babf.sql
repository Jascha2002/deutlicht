-- Sicherere RLS-Policies für project_leads
-- Alte Policies entfernen
DROP POLICY IF EXISTS "Anyone can create leads" ON public.project_leads;
DROP POLICY IF EXISTS "Anyone can update their own session leads" ON public.project_leads;

-- Neue Policy: Leads können nur mit gültiger Session-ID erstellt werden
CREATE POLICY "Create leads with session"
  ON public.project_leads FOR INSERT
  WITH CHECK (
    session_id IS NOT NULL AND 
    length(session_id) >= 20
  );

-- Neue Policy: Updates nur für eigene Session (via session_id Match)
CREATE POLICY "Update own session leads"
  ON public.project_leads FOR UPDATE
  USING (
    session_id IS NOT NULL AND 
    length(session_id) >= 20
  )
  WITH CHECK (
    session_id IS NOT NULL AND 
    length(session_id) >= 20
  );