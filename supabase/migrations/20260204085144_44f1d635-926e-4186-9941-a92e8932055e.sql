-- SCHRITT 1: Neue Rolle 'produktion' zum Enum hinzufügen
-- (muss in separater Transaktion erfolgen)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'produktion';