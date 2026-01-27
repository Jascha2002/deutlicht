
-- =============================================
-- TEIL 1: NUTZERVERWALTUNG MIT ROLLEN
-- =============================================

-- 1. Rollen-Enum erstellen
CREATE TYPE public.app_role AS ENUM ('admin', 'mitarbeiter', 'kunde');

-- 2. User Roles Tabelle (getrennt für Sicherheit)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'kunde',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Profile-Tabelle für Nutzerdaten
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    company TEXT,
    position TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS für user_roles aktivieren
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Security Definer Funktion für Rollenprüfung (verhindert infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Funktion um alle Rollen eines Users zu bekommen
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- 6. RLS Policies für user_roles
-- Admins können alle Rollen sehen
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Nutzer können ihre eigenen Rollen sehen
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Nur Admins können Rollen zuweisen
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Nur Admins können Rollen ändern
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Nur Admins können Rollen löschen
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. RLS Policies für profiles
-- Admins können alle Profile sehen
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Nutzer können ihr eigenes Profil sehen
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Nutzer können ihr eigenes Profil erstellen
CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Nutzer können ihr eigenes Profil aktualisieren
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Admins können alle Profile aktualisieren
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TEIL 2: ANALYSE-CLIENTS DATENMODELL
-- =============================================

-- 8. Status-Enum für Analysen
CREATE TYPE public.analysis_status AS ENUM ('entwurf', 'aktiv', 'abgeschlossen');

-- 9. Haupt-Tabelle für Analyse-Clients
CREATE TABLE public.analysis_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    modified_by UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    status analysis_status NOT NULL DEFAULT 'entwurf',
    
    -- STAMMDATEN
    unternehmensname TEXT NOT NULL,
    rechtsform TEXT,
    rechtsform_sonstiges TEXT,
    branche TEXT,
    branche_sonstiges TEXT,
    gruendungsjahr INTEGER,
    standorte TEXT,
    hauptsitz_plz TEXT,
    hauptsitz_ort TEXT,
    mitarbeiterzahl INTEGER,
    mitarbeiterzahl_kategorie TEXT,
    jahresumsatz TEXT,
    jahresumsatz_kategorie TEXT,
    zielgruppen_b2b BOOLEAN DEFAULT FALSE,
    zielgruppen_b2c BOOLEAN DEFAULT FALSE,
    zielgruppen_beschreibung TEXT,
    geschaeftsmodell TEXT,
    ansprechpartner_name TEXT,
    ansprechpartner_position TEXT,
    ansprechpartner_email TEXT,
    ansprechpartner_telefon TEXT
);

-- 10. Online-Auftritt Tabelle
CREATE TABLE public.analysis_online (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Website
    website_vorhanden TEXT,
    website_url TEXT,
    website_cms TEXT,
    website_cms_sonstiges TEXT,
    website_hosting TEXT,
    website_hosting_anbieter TEXT,
    website_responsive TEXT,
    website_https TEXT,
    website_ladezeit TEXT,
    website_aktualisierung TEXT,
    website_aktualisierung_wer TEXT,
    website_sprachen INTEGER,
    website_mehrsprachig BOOLEAN DEFAULT FALSE,
    website_barrierefreiheit TEXT,
    
    -- SEO
    seo_aktiv_betrieben TEXT,
    seo_keywords_definiert BOOLEAN DEFAULT FALSE,
    seo_google_my_business BOOLEAN DEFAULT FALSE,
    seo_backlinks_strategie BOOLEAN DEFAULT FALSE,
    seo_ranking_zufriedenheit INTEGER,
    
    -- Online-Shop
    shop_vorhanden TEXT,
    shop_system TEXT,
    shop_system_sonstiges TEXT,
    shop_produkte_anzahl INTEGER,
    shop_zahlungsarten JSONB DEFAULT '[]',
    shop_versand_anbindung BOOLEAN DEFAULT FALSE,
    shop_erp_anbindung BOOLEAN DEFAULT FALSE,
    shop_umsatz_anteil TEXT,
    
    -- Buchungssysteme
    buchungssystem_vorhanden BOOLEAN DEFAULT FALSE,
    buchungssystem_typ TEXT,
    buchungssystem_integration TEXT,
    
    online_zusatz TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Social Media & Marketing Tabelle
CREATE TABLE public.analysis_social (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Kanäle
    kanaele_aktiv JSONB DEFAULT '[]',
    linkedin_follower INTEGER,
    linkedin_frequenz TEXT,
    facebook_follower INTEGER,
    facebook_frequenz TEXT,
    instagram_follower INTEGER,
    instagram_frequenz TEXT,
    
    -- Content
    content_ersteller TEXT,
    content_redaktionsplan BOOLEAN DEFAULT FALSE,
    content_budget_monatlich TEXT,
    
    -- Newsletter
    newsletter_vorhanden BOOLEAN DEFAULT FALSE,
    newsletter_tool TEXT,
    newsletter_abonnenten INTEGER,
    newsletter_frequenz TEXT,
    newsletter_oeffnungsrate TEXT,
    
    -- Werbung
    online_werbung_aktiv BOOLEAN DEFAULT FALSE,
    werbung_google_ads BOOLEAN DEFAULT FALSE,
    werbung_facebook_ads BOOLEAN DEFAULT FALSE,
    werbung_linkedin_ads BOOLEAN DEFAULT FALSE,
    werbung_budget_monatlich TEXT,
    
    social_zusatz TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Systeme & Software Tabelle
CREATE TABLE public.analysis_systeme (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- CRM
    crm_vorhanden TEXT,
    crm_system TEXT,
    crm_system_sonstiges TEXT,
    crm_nutzer_anzahl INTEGER,
    crm_zufriedenheit INTEGER,
    crm_integration_email BOOLEAN DEFAULT FALSE,
    crm_integration_telefonie BOOLEAN DEFAULT FALSE,
    crm_datenpflege TEXT,
    
    -- ERP
    erp_vorhanden TEXT,
    erp_system TEXT,
    erp_system_sonstiges TEXT,
    erp_module JSONB DEFAULT '[]',
    erp_integration_crm BOOLEAN DEFAULT FALSE,
    erp_integration_shop BOOLEAN DEFAULT FALSE,
    erp_zufriedenheit INTEGER,
    
    -- Buchhaltung
    buchhaltung_system TEXT,
    buchhaltung_system_sonstiges TEXT,
    buchhaltung_fibu_online BOOLEAN DEFAULT FALSE,
    buchhaltung_steuerberater_zugriff BOOLEAN DEFAULT FALSE,
    buchhaltung_belege_digital TEXT,
    
    -- DMS
    dms_vorhanden TEXT,
    dms_system TEXT,
    dms_system_sonstiges TEXT,
    dms_versionierung BOOLEAN DEFAULT FALSE,
    dms_volltextsuche BOOLEAN DEFAULT FALSE,
    dms_berechtigungskonzept TEXT,
    
    -- Projektmanagement
    pm_tool_vorhanden BOOLEAN DEFAULT FALSE,
    pm_tool TEXT,
    pm_tool_sonstiges TEXT,
    
    -- Zeiterfassung
    zeiterfassung_vorhanden BOOLEAN DEFAULT FALSE,
    zeiterfassung_system TEXT,
    
    -- Kommunikation
    email_system TEXT,
    chat_tool TEXT,
    videokonferenz TEXT,
    
    -- Branchenspezifisch
    branchensoftware JSONB DEFAULT '[]',
    branchensoftware_details TEXT,
    
    systeme_zusatz TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 13. Prozesse & Workflows Tabelle
CREATE TABLE public.analysis_prozesse (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Vertrieb
    vertrieb_leadgewinnung JSONB DEFAULT '[]',
    vertrieb_angebotserstellung TEXT,
    vertrieb_angebotserstellung_tool TEXT,
    vertrieb_angebotserstellung_dauer TEXT,
    vertrieb_nachverfolgung TEXT,
    vertrieb_erfolgsquote TEXT,
    vertrieb_crm_nutzung TEXT,
    
    -- Auftragsabwicklung
    auftragseingang_kanal JSONB DEFAULT '[]',
    auftragserfassung TEXT,
    auftragsbearbeitung_system TEXT,
    auftragsbearbeitung_medienbruch BOOLEAN DEFAULT FALSE,
    auftragsstatus_tracking TEXT,
    kundenkommunikation TEXT,
    
    -- Rechnungsstellung
    rechnungsstellung TEXT,
    rechnungsstellung_tool TEXT,
    rechnungsversand TEXT,
    rechnungsstellung_dauer TEXT,
    
    -- Dokumentenworkflow
    dokumente_vorlagen TEXT,
    dokumente_freigabe TEXT,
    dokumente_ablage TEXT,
    dokumente_suche TEXT,
    
    -- Service
    service_kanal JSONB DEFAULT '[]',
    service_ticket_system BOOLEAN DEFAULT FALSE,
    service_ticket_tool TEXT,
    service_reaktionszeit TEXT,
    service_wissensdatenbank BOOLEAN DEFAULT FALSE,
    
    -- Interne Kommunikation
    meetings_frequenz TEXT,
    meetings_protokolle TEXT,
    entscheidungsprozesse TEXT,
    
    prozesse_zusatz TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 14. Daten & Sicherheit Tabelle
CREATE TABLE public.analysis_daten (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Datenablage
    daten_ablage_ort JSONB DEFAULT '[]',
    daten_cloud_anbieter TEXT,
    daten_server_standort TEXT,
    daten_ordnerstruktur TEXT,
    daten_namenskonvention TEXT,
    daten_dubletten TEXT,
    
    -- Backup
    backup_vorhanden TEXT,
    backup_frequenz TEXT,
    backup_speicherort TEXT,
    backup_getestet TEXT,
    backup_automatisiert BOOLEAN DEFAULT FALSE,
    
    -- Sicherheit
    firewall_vorhanden BOOLEAN DEFAULT FALSE,
    antivirus_vorhanden BOOLEAN DEFAULT FALSE,
    vpn_vorhanden BOOLEAN DEFAULT FALSE,
    zwei_faktor_auth TEXT,
    passwort_manager TEXT,
    passwort_richtlinie TEXT,
    
    -- DSGVO
    dsgvo_verzeichnis_vorhanden BOOLEAN DEFAULT FALSE,
    dsgvo_auftragsverarbeiter_vertraege BOOLEAN DEFAULT FALSE,
    dsgvo_loeschkonzept TEXT,
    dsgvo_datenschutzbeauftragter TEXT,
    
    -- Zugriffe
    zugriffskontrolle TEXT,
    externe_zugriffe TEXT,
    mitarbeiter_schulung_it_security TEXT,
    
    daten_zusatz TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 15. Reporting & KPIs Tabelle
CREATE TABLE public.analysis_reporting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    kennzahlen_erfasst BOOLEAN DEFAULT FALSE,
    kennzahlen_liste JSONB DEFAULT '[]',
    dashboard_vorhanden BOOLEAN DEFAULT FALSE,
    dashboard_tool TEXT,
    reporting_frequenz TEXT,
    reporting_automatisiert TEXT,
    datenqualitaet TEXT,
    auswertungen_basis TEXT,
    
    reporting_zusatz TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 16. Schulung & Wissen Tabelle
CREATE TABLE public.analysis_schulung (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    onboarding_prozess TEXT,
    onboarding_dauer TEXT,
    onboarding_dokumentiert BOOLEAN DEFAULT FALSE,
    arbeitsanweisungen_vorhanden BOOLEAN DEFAULT FALSE,
    arbeitsanweisungen_aktuell BOOLEAN DEFAULT FALSE,
    arbeitsanweisungen_format TEXT,
    wissensdatenbank_vorhanden BOOLEAN DEFAULT FALSE,
    wissensdatenbank_tool TEXT,
    schulungen_regelmaessig BOOLEAN DEFAULT FALSE,
    schulungen_intern_extern TEXT,
    
    schulung_zusatz TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 17. Ziele & Strategie Tabelle
CREATE TABLE public.analysis_ziele (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    digitalisierung_prioritaet INTEGER,
    budget_verfuegbar TEXT,
    budget_hoehe TEXT,
    zeitrahmen TEXT,
    
    schmerzpunkte JSONB DEFAULT '[]',
    schmerzpunkte_details TEXT,
    
    ziele_konkret JSONB DEFAULT '[]',
    ziele_details TEXT,
    
    foerderung_interesse BOOLEAN DEFAULT FALSE,
    foerderung_beratung_benoetigt BOOLEAN DEFAULT FALSE,
    foerderung_bereits_beantragt BOOLEAN DEFAULT FALSE,
    foerderung_programme TEXT,
    
    wettbewerb_digitalisierung TEXT,
    
    ziele_zusatz TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 18. Interne Bewertungen (nur Admin/Berater)
CREATE TABLE public.analysis_intern (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.analysis_clients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    gesamteindruck TEXT,
    digitalisierungsgrad INTEGER,
    handlungsbedarf TEXT,
    potenzial TEXT,
    bereitschaft_investition INTEGER,
    bereitschaft_veraenderung INTEGER,
    kritische_punkte TEXT,
    erfolgsfaktoren TEXT,
    risiken TEXT,
    naechste_schritte_intern TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- RLS für alle Analyse-Tabellen
-- =============================================

ALTER TABLE public.analysis_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_online ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_systeme ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_prozesse ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_daten ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reporting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_schulung ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_ziele ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_intern ENABLE ROW LEVEL SECURITY;

-- RLS Policies für analysis_clients
-- Admins und Mitarbeiter können alle sehen
CREATE POLICY "Staff can view all clients"
ON public.analysis_clients
FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mitarbeiter')
);

-- Admins und Mitarbeiter können erstellen
CREATE POLICY "Staff can create clients"
ON public.analysis_clients
FOR INSERT
TO authenticated
WITH CHECK (
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
    AND created_by = auth.uid()
);

-- Admins können alle aktualisieren, Mitarbeiter nur eigene
CREATE POLICY "Staff can update clients"
ON public.analysis_clients
FOR UPDATE
TO authenticated
USING (
    public.has_role(auth.uid(), 'admin') OR 
    (public.has_role(auth.uid(), 'mitarbeiter') AND created_by = auth.uid())
);

-- Nur Admins können löschen
CREATE POLICY "Admins can delete clients"
ON public.analysis_clients
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Funktion um Client-ID Berechtigung zu prüfen
CREATE OR REPLACE FUNCTION public.can_access_client(_client_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mitarbeiter')
$$;

-- RLS für Sub-Tabellen (Online, Social, etc.) - alle gleiche Logik
CREATE POLICY "Staff can view online data"
ON public.analysis_online FOR SELECT TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Staff can insert online data"
ON public.analysis_online FOR INSERT TO authenticated
WITH CHECK (public.can_access_client(client_id));

CREATE POLICY "Staff can update online data"
ON public.analysis_online FOR UPDATE TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Admins can delete online data"
ON public.analysis_online FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Social
CREATE POLICY "Staff can view social data"
ON public.analysis_social FOR SELECT TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Staff can insert social data"
ON public.analysis_social FOR INSERT TO authenticated
WITH CHECK (public.can_access_client(client_id));

CREATE POLICY "Staff can update social data"
ON public.analysis_social FOR UPDATE TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Admins can delete social data"
ON public.analysis_social FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Systeme
CREATE POLICY "Staff can view systeme data"
ON public.analysis_systeme FOR SELECT TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Staff can insert systeme data"
ON public.analysis_systeme FOR INSERT TO authenticated
WITH CHECK (public.can_access_client(client_id));

CREATE POLICY "Staff can update systeme data"
ON public.analysis_systeme FOR UPDATE TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Admins can delete systeme data"
ON public.analysis_systeme FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Prozesse
CREATE POLICY "Staff can view prozesse data"
ON public.analysis_prozesse FOR SELECT TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Staff can insert prozesse data"
ON public.analysis_prozesse FOR INSERT TO authenticated
WITH CHECK (public.can_access_client(client_id));

CREATE POLICY "Staff can update prozesse data"
ON public.analysis_prozesse FOR UPDATE TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Admins can delete prozesse data"
ON public.analysis_prozesse FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Daten
CREATE POLICY "Staff can view daten data"
ON public.analysis_daten FOR SELECT TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Staff can insert daten data"
ON public.analysis_daten FOR INSERT TO authenticated
WITH CHECK (public.can_access_client(client_id));

CREATE POLICY "Staff can update daten data"
ON public.analysis_daten FOR UPDATE TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Admins can delete daten data"
ON public.analysis_daten FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Reporting
CREATE POLICY "Staff can view reporting data"
ON public.analysis_reporting FOR SELECT TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Staff can insert reporting data"
ON public.analysis_reporting FOR INSERT TO authenticated
WITH CHECK (public.can_access_client(client_id));

CREATE POLICY "Staff can update reporting data"
ON public.analysis_reporting FOR UPDATE TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Admins can delete reporting data"
ON public.analysis_reporting FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Schulung
CREATE POLICY "Staff can view schulung data"
ON public.analysis_schulung FOR SELECT TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Staff can insert schulung data"
ON public.analysis_schulung FOR INSERT TO authenticated
WITH CHECK (public.can_access_client(client_id));

CREATE POLICY "Staff can update schulung data"
ON public.analysis_schulung FOR UPDATE TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Admins can delete schulung data"
ON public.analysis_schulung FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Ziele
CREATE POLICY "Staff can view ziele data"
ON public.analysis_ziele FOR SELECT TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Staff can insert ziele data"
ON public.analysis_ziele FOR INSERT TO authenticated
WITH CHECK (public.can_access_client(client_id));

CREATE POLICY "Staff can update ziele data"
ON public.analysis_ziele FOR UPDATE TO authenticated
USING (public.can_access_client(client_id));

CREATE POLICY "Admins can delete ziele data"
ON public.analysis_ziele FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Intern (NUR Admin)
CREATE POLICY "Only admins can view intern data"
ON public.analysis_intern FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert intern data"
ON public.analysis_intern FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update intern data"
ON public.analysis_intern FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete intern data"
ON public.analysis_intern FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- KUNDEN-BEREICH: Projekte, Rechnungen, Support
-- =============================================

-- 19. Kundenprojekte
CREATE TABLE public.customer_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assigned_staff UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'aktiv',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 20. Rechnungen
CREATE TABLE public.customer_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.customer_projects(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'offen',
    due_date DATE,
    paid_date DATE,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 21. Support-Tickets
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.customer_projects(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'offen',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 22. Ticket-Nachrichten
CREATE TABLE public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 23. Änderungswünsche
CREATE TABLE public.change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.customer_projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'eingereicht',
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 24. Datei-Uploads von Kunden
CREATE TABLE public.customer_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.customer_projects(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    storage_path TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS für Kunden-Tabellen aktivieren
ALTER TABLE public.customer_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_files ENABLE ROW LEVEL SECURITY;

-- RLS für customer_projects
CREATE POLICY "Customers can view own projects"
ON public.customer_projects FOR SELECT TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff can create projects"
ON public.customer_projects FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff can update projects"
ON public.customer_projects FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins can delete projects"
ON public.customer_projects FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS für customer_invoices
CREATE POLICY "Customers can view own invoices"
ON public.customer_invoices FOR SELECT TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Staff can manage invoices"
ON public.customer_invoices FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- RLS für support_tickets
CREATE POLICY "Customers can view own tickets"
ON public.support_tickets FOR SELECT TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Customers can create tickets"
ON public.support_tickets FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Authorized users can update tickets"
ON public.support_tickets FOR UPDATE TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- RLS für ticket_messages
CREATE POLICY "Users can view messages of accessible tickets"
ON public.ticket_messages FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.support_tickets t 
        WHERE t.id = ticket_id 
        AND (t.customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
    )
);

CREATE POLICY "Users can send messages to accessible tickets"
ON public.ticket_messages FOR INSERT TO authenticated
WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.support_tickets t 
        WHERE t.id = ticket_id 
        AND (t.customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'))
    )
);

-- RLS für change_requests
CREATE POLICY "Customers can view own change requests"
ON public.change_requests FOR SELECT TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Customers can create change requests"
ON public.change_requests FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Staff can update change requests"
ON public.change_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- RLS für customer_files
CREATE POLICY "Customers can view own files"
ON public.customer_files FOR SELECT TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Customers can upload files"
ON public.customer_files FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can delete own files"
ON public.customer_files FOR DELETE TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- =============================================
-- Trigger für updated_at
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für alle Tabellen mit updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_clients_updated_at BEFORE UPDATE ON public.analysis_clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_online_updated_at BEFORE UPDATE ON public.analysis_online FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_social_updated_at BEFORE UPDATE ON public.analysis_social FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_systeme_updated_at BEFORE UPDATE ON public.analysis_systeme FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_prozesse_updated_at BEFORE UPDATE ON public.analysis_prozesse FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_daten_updated_at BEFORE UPDATE ON public.analysis_daten FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_reporting_updated_at BEFORE UPDATE ON public.analysis_reporting FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_schulung_updated_at BEFORE UPDATE ON public.analysis_schulung FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_ziele_updated_at BEFORE UPDATE ON public.analysis_ziele FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_intern_updated_at BEFORE UPDATE ON public.analysis_intern FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_projects_updated_at BEFORE UPDATE ON public.customer_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_invoices_updated_at BEFORE UPDATE ON public.customer_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_change_requests_updated_at BEFORE UPDATE ON public.change_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger für automatische Profil-Erstellung bei neuem User
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    
    -- Standardmäßig Kunde-Rolle zuweisen
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'kunde');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
