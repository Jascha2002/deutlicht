-- Fix 1: Update notify_partner_on_conversion trigger to use valid enum value 'gewonnen' instead of 'kunde'
CREATE OR REPLACE FUNCTION public.notify_partner_on_conversion()
RETURNS TRIGGER AS $$
DECLARE v_partner_user_id UUID;
BEGIN
  IF NEW.status = 'gewonnen' AND (OLD.status IS NULL OR OLD.status != 'gewonnen') THEN
    SELECT p.user_id INTO v_partner_user_id
    FROM public.partner_referrals pr
    JOIN public.partners p ON pr.partner_id = p.id
    WHERE pr.lead_id = NEW.id LIMIT 1;
    
    IF v_partner_user_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
      VALUES (v_partner_user_id, 'Lead wurde zum Kunden!',
        'Ihr vermittelter Lead "' || COALESCE(NEW.company_name, NEW.contact_name) || '" ist jetzt Kunde.',
        'lead', 'lead', NEW.id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix 2: Fix infinite recursion in project_team_assignments RLS
-- Drop the recursive policy and replace with a safe one
DROP POLICY IF EXISTS "Mitarbeiter can manage assignments for their projects" ON public.project_team_assignments;

CREATE POLICY "Mitarbeiter can manage assignments for their projects"
ON public.project_team_assignments
FOR ALL
USING (
  has_role(auth.uid(), 'mitarbeiter'::app_role) AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM crm_projects cp
      WHERE cp.id = project_team_assignments.project_id
      AND cp.created_by = auth.uid()
    )
  )
)
WITH CHECK (
  has_role(auth.uid(), 'mitarbeiter'::app_role) AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM crm_projects cp
      WHERE cp.id = project_team_assignments.project_id
      AND cp.created_by = auth.uid()
    )
  )
);