-- Create SECURITY DEFINER function for admin role management (bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_manage_user_role(
  p_target_user_id UUID,
  p_role TEXT,
  p_action TEXT  -- 'add' or 'remove'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
BEGIN
  -- Check if caller is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Keine Admin-Berechtigung'
    );
  END IF;

  -- Perform operation (bypasses RLS due to SECURITY DEFINER)
  IF p_action = 'add' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_target_user_id, p_role::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSIF p_action = 'remove' THEN
    DELETE FROM public.user_roles
    WHERE user_id = p_target_user_id AND role = p_role::app_role;
  ELSIF p_action = 'replace' THEN
    -- Delete all roles for user first, then add new one
    DELETE FROM public.user_roles WHERE user_id = p_target_user_id;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_target_user_id, p_role::app_role);
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Create SECURITY DEFINER function for admin to delete users (profiles + roles)
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  p_target_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
BEGIN
  -- Check if caller is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Keine Admin-Berechtigung'
    );
  END IF;

  -- Delete roles first
  DELETE FROM public.user_roles WHERE user_id = p_target_user_id;
  
  -- Delete profile
  DELETE FROM public.profiles WHERE user_id = p_target_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.admin_manage_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user TO authenticated;