-- =====================================================
-- MODUL 1: RBAC-Erweiterung & Audit-Logs
-- =====================================================

-- 1. Erweitere app_role Enum um neue Rollen
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'freelancer_eu';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'freelancer_drittland';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'lieferant';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'ki_agent';

-- 2. Audit-Log Tabelle für vollständige Nachverfolgung
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Wer hat die Aktion ausgeführt?
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  user_role text,
  
  -- Was wurde geändert?
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT', 'LOGIN', 'LOGOUT', 'EXPORT')),
  
  -- Detaillierte Änderungsinformationen
  old_values jsonb,
  new_values jsonb,
  changed_fields text[],
  
  -- Kontext
  ip_address inet,
  user_agent text,
  session_id text,
  
  -- Zeitstempel
  created_at timestamptz NOT NULL DEFAULT now(),
  
  -- DSGVO/Steuer-relevante Flags
  is_gdpr_relevant boolean DEFAULT false,
  is_tax_relevant boolean DEFAULT false,
  retention_until date -- Aufbewahrungsfrist
);

-- Index für schnelle Abfragen
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_record_id ON public.audit_logs(record_id);

-- RLS für Audit-Logs (nur Admins dürfen lesen, niemand darf löschen)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nur Admins können Audit-Logs lesen"
  ON public.audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System kann Audit-Logs erstellen"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true); -- Wird über SECURITY DEFINER Funktion gesteuert

-- 3. Funktion zum Erstellen von Audit-Einträgen
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_table_name text,
  p_record_id uuid,
  p_action text,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_changed_fields text[] DEFAULT NULL,
  p_is_gdpr_relevant boolean DEFAULT false,
  p_is_tax_relevant boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_user_email text;
  v_user_role text;
  v_log_id uuid;
BEGIN
  -- Aktuelle Benutzerinfo holen
  v_user_id := auth.uid();
  
  SELECT email INTO v_user_email
  FROM auth.users WHERE id = v_user_id;
  
  SELECT role::text INTO v_user_role
  FROM public.user_roles WHERE user_id = v_user_id LIMIT 1;
  
  -- Audit-Eintrag erstellen
  INSERT INTO public.audit_logs (
    user_id, user_email, user_role,
    table_name, record_id, action,
    old_values, new_values, changed_fields,
    is_gdpr_relevant, is_tax_relevant,
    retention_until
  ) VALUES (
    v_user_id, v_user_email, v_user_role,
    p_table_name, p_record_id, p_action,
    p_old_values, p_new_values, p_changed_fields,
    p_is_gdpr_relevant, p_is_tax_relevant,
    CASE 
      WHEN p_is_tax_relevant THEN CURRENT_DATE + INTERVAL '10 years' -- §147 AO
      WHEN p_is_gdpr_relevant THEN CURRENT_DATE + INTERVAL '3 years' -- DSGVO
      ELSE CURRENT_DATE + INTERVAL '1 year'
    END
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 4. Dokument-Zugriffsberechtigungen
CREATE TABLE public.document_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Welches Dokument/welche Ressource
  resource_type text NOT NULL, -- 'project', 'invoice', 'contract', 'report'
  resource_id uuid NOT NULL,
  
  -- Wer hat Zugriff
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role, -- Alternativ: Rollenbezogener Zugriff
  
  -- Welche Berechtigungen
  can_view boolean DEFAULT false,
  can_edit boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  can_download boolean DEFAULT false,
  can_share boolean DEFAULT false,
  
  -- Gültigkeit
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  
  -- Meta
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  revoked_at timestamptz,
  revoked_by uuid REFERENCES auth.users(id),
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Entweder user_id ODER role muss gesetzt sein
  CONSTRAINT check_user_or_role CHECK (
    (user_id IS NOT NULL AND role IS NULL) OR
    (user_id IS NULL AND role IS NOT NULL)
  )
);

CREATE INDEX idx_document_permissions_resource ON public.document_permissions(resource_type, resource_id);
CREATE INDEX idx_document_permissions_user ON public.document_permissions(user_id);

ALTER TABLE public.document_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins verwalten Dokumentberechtigungen"
  ON public.document_permissions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Benutzer sehen eigene Berechtigungen"
  ON public.document_permissions FOR SELECT
  USING (user_id = auth.uid());

-- 5. Hilfsfunktion: Prüft ob User Zugriff auf Ressource hat
CREATE OR REPLACE FUNCTION public.can_access_resource(
  p_resource_type text,
  p_resource_id uuid,
  p_permission text DEFAULT 'view' -- 'view', 'edit', 'delete', 'download', 'share'
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_has_permission boolean := false;
BEGIN
  v_user_id := auth.uid();
  
  -- Admins haben immer Zugriff
  IF public.has_role(v_user_id, 'admin') THEN
    RETURN true;
  END IF;
  
  -- Prüfe direkte Benutzerberechtigungen
  SELECT 
    CASE p_permission
      WHEN 'view' THEN can_view
      WHEN 'edit' THEN can_edit
      WHEN 'delete' THEN can_delete
      WHEN 'download' THEN can_download
      WHEN 'share' THEN can_share
      ELSE false
    END INTO v_has_permission
  FROM public.document_permissions
  WHERE resource_type = p_resource_type
    AND resource_id = p_resource_id
    AND user_id = v_user_id
    AND revoked_at IS NULL
    AND (valid_until IS NULL OR valid_until > now())
  LIMIT 1;
  
  IF v_has_permission THEN
    RETURN true;
  END IF;
  
  -- Prüfe rollenbasierte Berechtigungen
  SELECT 
    CASE p_permission
      WHEN 'view' THEN dp.can_view
      WHEN 'edit' THEN dp.can_edit
      WHEN 'delete' THEN dp.can_delete
      WHEN 'download' THEN dp.can_download
      WHEN 'share' THEN dp.can_share
      ELSE false
    END INTO v_has_permission
  FROM public.document_permissions dp
  JOIN public.user_roles ur ON dp.role = ur.role
  WHERE dp.resource_type = p_resource_type
    AND dp.resource_id = p_resource_id
    AND ur.user_id = v_user_id
    AND dp.revoked_at IS NULL
    AND (dp.valid_until IS NULL OR dp.valid_until > now())
  LIMIT 1;
  
  RETURN COALESCE(v_has_permission, false);
END;
$$;

-- 6. Trigger für automatische updated_at
CREATE TRIGGER update_document_permissions_updated_at
  BEFORE UPDATE ON public.document_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();