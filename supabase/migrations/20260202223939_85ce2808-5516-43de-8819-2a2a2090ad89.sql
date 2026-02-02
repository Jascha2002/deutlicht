-- Sicherheits-Fix: Ersetze die zu permissive INSERT-Policy
-- Die Funktion create_audit_log() ist SECURITY DEFINER und umgeht RLS ohnehin

DROP POLICY IF EXISTS "System kann Audit-Logs erstellen" ON public.audit_logs;

-- Neue Policy: Nur authentifizierte Benutzer können Logs erstellen
-- (wird in der Praxis über die SECURITY DEFINER Funktion gemacht)
CREATE POLICY "Authentifizierte Benutzer können Audit-Logs erstellen"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Zusätzlich: Niemand kann Audit-Logs löschen oder ändern (unveränderliches Log)
CREATE POLICY "Niemand kann Audit-Logs löschen"
  ON public.audit_logs FOR DELETE
  USING (false);

CREATE POLICY "Niemand kann Audit-Logs ändern"
  ON public.audit_logs FOR UPDATE
  USING (false);