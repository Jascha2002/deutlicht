-- Temporäre Funktion zum Erstellen des Admin-Benutzers nach Registrierung
-- Sobald sich der Benutzer registriert hat, wird er automatisch zur Admin-Rolle befördert
-- Diese Query aktualisiert die Rolle für den ersten Benutzer mit "carsten" im Namen

-- Note: Der Benutzer muss sich erst registrieren, dann kann die Rolle zugewiesen werden
-- Für jetzt: Vorbereitung der Admin-Struktur

-- Sicherstellen, dass die user_roles Tabelle korrekte Policies hat
DO $$
BEGIN
  -- Prüfen ob Policy existiert
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' AND policyname = 'Admins can manage all user roles'
  ) THEN
    CREATE POLICY "Admins can manage all user roles"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;