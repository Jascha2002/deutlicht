-- =============================================
-- SCHRITT 2: TABELLEN UND STRUKTUREN (KORRIGIERT)
-- =============================================

-- Team-Zuordnung: Mehrere Mitarbeiter pro Kunde
CREATE TABLE IF NOT EXISTS public.customer_team_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_in_team TEXT DEFAULT 'vertrieb',
  is_primary BOOLEAN DEFAULT false,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, user_id)
);

CREATE TRIGGER update_customer_team_assignments_updated_at
  BEFORE UPDATE ON public.customer_team_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Partner-Referenz an crm_companies hinzufügen
ALTER TABLE public.crm_companies 
ADD COLUMN IF NOT EXISTS referred_by_partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL;

-- Lead-ID zu partner_referrals hinzufügen für Lead-Tracking
ALTER TABLE public.partner_referrals 
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL;

-- Kunden-Dokumente Tabelle
CREATE TABLE IF NOT EXISTS public.customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'neu',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_customer_documents_updated_at
  BEFORE UPDATE ON public.customer_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Benachrichtigungen Tabelle
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  reference_type TEXT,
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, is_read) WHERE is_read = false;

-- Storage Bucket für Kunden-Uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-uploads',
  'customer-uploads',
  false,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'video/quicktime', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.customer_team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- CUSTOMER_TEAM_ASSIGNMENTS
CREATE POLICY "admin_full_access_team" ON public.customer_team_assignments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mitarbeiter_view_team" ON public.customer_team_assignments
  FOR SELECT USING (public.has_role(auth.uid(), 'mitarbeiter') OR public.has_role(auth.uid(), 'produktion'));

CREATE POLICY "mitarbeiter_insert_team" ON public.customer_team_assignments
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'mitarbeiter'));

-- CUSTOMER_DOCUMENTS
CREATE POLICY "admin_full_access_docs" ON public.customer_documents
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "kunde_own_docs" ON public.customer_documents
  FOR ALL USING (public.has_role(auth.uid(), 'kunde') AND uploaded_by = auth.uid());

CREATE POLICY "team_view_assigned_docs" ON public.customer_documents
  FOR SELECT USING (
    (public.has_role(auth.uid(), 'mitarbeiter') OR public.has_role(auth.uid(), 'produktion'))
    AND EXISTS (
      SELECT 1 FROM public.customer_team_assignments cta
      WHERE cta.company_id = customer_documents.company_id AND cta.user_id = auth.uid()
    )
  );

CREATE POLICY "partner_view_referred_docs" ON public.customer_documents
  FOR SELECT USING (
    public.has_role(auth.uid(), 'partner')
    AND EXISTS (
      SELECT 1 FROM public.crm_companies c
      JOIN public.partners p ON c.referred_by_partner_id = p.id
      WHERE c.id = customer_documents.company_id AND p.user_id = auth.uid()
    )
  );

-- NOTIFICATIONS
CREATE POLICY "own_notifications" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "admin_view_all_notifications" ON public.notifications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- STORAGE POLICIES
CREATE POLICY "kunde_upload_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'customer-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "kunde_view_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'customer-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "team_view_uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'customer-uploads'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter') OR public.has_role(auth.uid(), 'produktion'))
  );

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.notify_team_on_upload()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_team_member RECORD;
  v_company_name TEXT;
  v_uploader_name TEXT;
BEGIN
  SELECT company_name INTO v_company_name FROM public.crm_companies WHERE id = NEW.company_id;
  SELECT full_name INTO v_uploader_name FROM public.profiles WHERE user_id = NEW.uploaded_by;
  
  FOR v_team_member IN SELECT DISTINCT user_id FROM public.customer_team_assignments WHERE company_id = NEW.company_id
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
    VALUES (v_team_member.user_id, 'Neues Dokument hochgeladen',
      COALESCE(v_uploader_name, 'Ein Kunde') || ' hat "' || NEW.file_name || '" hochgeladen.',
      'upload', 'document', NEW.id);
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_on_upload
  AFTER INSERT ON public.customer_documents
  FOR EACH ROW EXECUTE FUNCTION public.notify_team_on_upload();

CREATE OR REPLACE FUNCTION public.notify_partner_on_conversion()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_partner_user_id UUID;
BEGIN
  IF NEW.status = 'kunde' AND (OLD.status IS NULL OR OLD.status != 'kunde') THEN
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
$$;

DROP TRIGGER IF EXISTS trigger_notify_partner_conversion ON public.crm_leads;
CREATE TRIGGER trigger_notify_partner_conversion
  AFTER UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.notify_partner_on_conversion();

-- =============================================
-- RLS FÜR CRM_COMPANIES
-- =============================================

DROP POLICY IF EXISTS "crm_companies_admin" ON public.crm_companies;
DROP POLICY IF EXISTS "crm_companies_mitarbeiter" ON public.crm_companies;
DROP POLICY IF EXISTS "crm_companies_partner_view" ON public.crm_companies;
DROP POLICY IF EXISTS "crm_companies_kunde_own" ON public.crm_companies;

CREATE POLICY "crm_companies_admin" ON public.crm_companies
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "crm_companies_mitarbeiter_select" ON public.crm_companies
  FOR SELECT USING (public.has_role(auth.uid(), 'mitarbeiter') OR public.has_role(auth.uid(), 'produktion'));

CREATE POLICY "crm_companies_mitarbeiter_modify" ON public.crm_companies
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'mitarbeiter')
    AND EXISTS (SELECT 1 FROM public.customer_team_assignments WHERE company_id = crm_companies.id AND user_id = auth.uid())
  );

CREATE POLICY "crm_companies_mitarbeiter_insert" ON public.crm_companies
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "crm_companies_partner_view" ON public.crm_companies
  FOR SELECT USING (
    public.has_role(auth.uid(), 'partner')
    AND EXISTS (
      SELECT 1 FROM public.partners p
      WHERE p.user_id = auth.uid() AND crm_companies.referred_by_partner_id = p.id
    )
  );

CREATE POLICY "crm_companies_partner_insert" ON public.crm_companies
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'partner'));

-- =============================================
-- RLS FÜR CRM_LEADS
-- =============================================

DROP POLICY IF EXISTS "crm_leads_admin" ON public.crm_leads;
DROP POLICY IF EXISTS "crm_leads_mitarbeiter" ON public.crm_leads;
DROP POLICY IF EXISTS "crm_leads_partner" ON public.crm_leads;

CREATE POLICY "crm_leads_admin" ON public.crm_leads
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "crm_leads_mitarbeiter" ON public.crm_leads
  FOR ALL USING (public.has_role(auth.uid(), 'mitarbeiter'));

CREATE POLICY "crm_leads_partner_select" ON public.crm_leads
  FOR SELECT USING (
    public.has_role(auth.uid(), 'partner')
    AND EXISTS (
      SELECT 1 FROM public.partner_referrals pr
      JOIN public.partners p ON pr.partner_id = p.id
      WHERE pr.lead_id = crm_leads.id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "crm_leads_partner_insert" ON public.crm_leads
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'partner'));