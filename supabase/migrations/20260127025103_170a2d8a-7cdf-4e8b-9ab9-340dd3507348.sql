-- Partner role hinzufügen
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'partner';

-- Partner-Tabelle für detaillierte Partner-Informationen
CREATE TABLE public.partners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    legal_form TEXT,
    tax_id TEXT,
    website TEXT,
    logo_url TEXT,
    
    -- Kontaktperson
    contact_first_name TEXT NOT NULL,
    contact_last_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    contact_position TEXT,
    
    -- Adresse
    street TEXT,
    postal_code TEXT,
    city TEXT,
    country TEXT DEFAULT 'Deutschland',
    
    -- Geschäftsdetails
    partner_type TEXT NOT NULL, -- steuerberater, marketing_agentur, webdesigner, it_dienstleister, unternehmensberater, sonstige
    employee_count TEXT,
    founded_year INTEGER,
    current_clients TEXT,
    average_project_value TEXT,
    target_markets TEXT[], -- Ziel-Branchen
    specializations TEXT[], -- Spezialisierungen
    experience TEXT,
    
    -- Partner-Status und Verwaltung
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, inactive
    commission_rate DECIMAL(5,2) DEFAULT 15.00, -- Standard 15%
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID,
    rejection_reason TEXT,
    
    -- Marketing
    motivation TEXT,
    portfolio_url TEXT,
    references_text TEXT,
    expected_volume TEXT,
    show_on_website BOOLEAN DEFAULT false, -- Für öffentliche Partner-Übersicht
    
    -- Odoo Integration
    odoo_partner_id INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Provisions-Tabelle
CREATE TABLE public.partner_commissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL, -- Referenz zum gewonnenen Kunden
    project_id UUID, -- Optionale Projekt-Referenz
    
    -- Provision Details
    commission_type TEXT NOT NULL, -- initial, recurring, bonus
    amount DECIMAL(10,2) NOT NULL,
    percentage_applied DECIMAL(5,2),
    base_amount DECIMAL(10,2), -- Ursprünglicher Betrag auf dem Provision basiert
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, paid, cancelled
    period_start DATE,
    period_end DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_reference TEXT,
    
    -- Notizen
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kunden-Partner-Zuordnung (welcher Kunde wurde durch welchen Partner gewonnen)
CREATE TABLE public.partner_referrals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    customer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_company TEXT,
    
    -- Tracking
    referral_code TEXT,
    referral_source TEXT, -- website, direct, event, etc.
    first_contact_date DATE,
    conversion_date DATE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'lead', -- lead, qualified, converted, lost
    lifetime_value DECIMAL(10,2) DEFAULT 0,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies für partners
CREATE POLICY "Admins und Mitarbeiter können alle Partner sehen"
ON public.partners FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Partner können eigene Daten sehen"
ON public.partners FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Öffentlich genehmigte Partner für Website"
ON public.partners FOR SELECT
TO anon
USING (status = 'approved' AND show_on_website = true);

CREATE POLICY "Admins können Partner erstellen"
ON public.partners FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Admins können Partner aktualisieren"
ON public.partners FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Partner können eigene Daten aktualisieren"
ON public.partners FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins können Partner löschen"
ON public.partners FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies für partner_commissions
CREATE POLICY "Admins und Mitarbeiter können alle Provisionen sehen"
ON public.partner_commissions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Partner können eigene Provisionen sehen"
ON public.partner_commissions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.partners 
        WHERE id = partner_commissions.partner_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Admins können Provisionen verwalten"
ON public.partner_commissions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies für partner_referrals
CREATE POLICY "Admins und Mitarbeiter können alle Referrals sehen"
ON public.partner_referrals FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "Partner können eigene Referrals sehen"
ON public.partner_referrals FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.partners 
        WHERE id = partner_referrals.partner_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Admins können Referrals verwalten"
ON public.partner_referrals FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Trigger für updated_at
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_commissions_updated_at
BEFORE UPDATE ON public.partner_commissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_referrals_updated_at
BEFORE UPDATE ON public.partner_referrals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index für Performance
CREATE INDEX idx_partners_status ON public.partners(status);
CREATE INDEX idx_partners_user_id ON public.partners(user_id);
CREATE INDEX idx_partner_commissions_partner_id ON public.partner_commissions(partner_id);
CREATE INDEX idx_partner_commissions_status ON public.partner_commissions(status);
CREATE INDEX idx_partner_referrals_partner_id ON public.partner_referrals(partner_id);
CREATE INDEX idx_partner_referrals_status ON public.partner_referrals(status);