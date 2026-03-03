
-- 1. Many-to-many junction table: users <-> companies
CREATE TABLE public.user_company_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, company_id)
);

ALTER TABLE public.user_company_assignments ENABLE ROW LEVEL SECURITY;

-- RLS: Admins/Mitarbeiter full access, users see own assignments
CREATE POLICY "Admins can manage all assignments"
  ON public.user_company_assignments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Users can view own assignments"
  ON public.user_company_assignments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 2. Company invite codes table
CREATE TABLE public.company_invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  max_uses INT,
  use_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.company_invite_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invite codes"
  ON public.company_invite_codes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Allow anon/authenticated to SELECT for validation during registration
CREATE POLICY "Anyone can read active codes for validation"
  ON public.company_invite_codes FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 3. Update get_accessible_company_ids to include user_company_assignments
CREATE OR REPLACE FUNCTION public.get_accessible_company_ids(_user_id uuid DEFAULT auth.uid())
 RETURNS SETOF uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT c.id
  FROM public.crm_companies c
  WHERE c.user_id = _user_id
  UNION
  SELECT p.company_id
  FROM public.profiles p
  WHERE p.user_id = _user_id
    AND p.company_id IS NOT NULL
  UNION
  SELECT uca.company_id
  FROM public.user_company_assignments uca
  WHERE uca.user_id = _user_id;
$$;
