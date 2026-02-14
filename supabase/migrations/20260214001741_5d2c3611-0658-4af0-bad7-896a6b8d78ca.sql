
-- 1. Global user permissions table for granular access control
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Document type access
  can_view_angebote BOOLEAN NOT NULL DEFAULT false,
  can_view_auftraege BOOLEAN NOT NULL DEFAULT false,
  can_view_rechnungen BOOLEAN NOT NULL DEFAULT false,
  can_view_abnahmen BOOLEAN NOT NULL DEFAULT false,
  can_view_berichte BOOLEAN NOT NULL DEFAULT false,
  can_view_vertraege BOOLEAN NOT NULL DEFAULT false,
  
  -- Project access
  can_view_all_projects BOOLEAN NOT NULL DEFAULT false,
  
  -- Financial data
  can_view_financials BOOLEAN NOT NULL DEFAULT false,
  can_view_commissions BOOLEAN NOT NULL DEFAULT false,
  
  -- Export/Download
  can_export_data BOOLEAN NOT NULL DEFAULT false,
  can_download_pdfs BOOLEAN NOT NULL DEFAULT false,
  
  -- Edit/Create
  can_create_offers BOOLEAN NOT NULL DEFAULT false,
  can_create_invoices BOOLEAN NOT NULL DEFAULT false,
  can_edit_products BOOLEAN NOT NULL DEFAULT false,
  
  granted_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Admins can manage all permissions
CREATE POLICY "Admins can manage permissions"
  ON public.user_permissions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can view their own permissions
CREATE POLICY "Users can view own permissions"
  ON public.user_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Auto-update timestamp
CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Add pdf_url to crm_orders (missing)
ALTER TABLE public.crm_orders ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- 3. Function to check user permission
CREATE OR REPLACE FUNCTION public.check_user_permission(_user_id UUID, _permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN public.has_role(_user_id, 'admin') THEN true
    ELSE COALESCE(
      (SELECT CASE _permission
        WHEN 'view_angebote' THEN can_view_angebote
        WHEN 'view_auftraege' THEN can_view_auftraege
        WHEN 'view_rechnungen' THEN can_view_rechnungen
        WHEN 'view_abnahmen' THEN can_view_abnahmen
        WHEN 'view_berichte' THEN can_view_berichte
        WHEN 'view_vertraege' THEN can_view_vertraege
        WHEN 'view_all_projects' THEN can_view_all_projects
        WHEN 'view_financials' THEN can_view_financials
        WHEN 'view_commissions' THEN can_view_commissions
        WHEN 'export_data' THEN can_export_data
        WHEN 'download_pdfs' THEN can_download_pdfs
        WHEN 'create_offers' THEN can_create_offers
        WHEN 'create_invoices' THEN can_create_invoices
        WHEN 'edit_products' THEN can_edit_products
        ELSE false
      END
      FROM public.user_permissions WHERE user_id = _user_id),
      false
    )
  END
$$;

-- 4. Auto-create permissions for new users with role-based defaults
CREATE OR REPLACE FUNCTION public.create_default_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_permissions (user_id, 
    can_view_angebote, can_view_auftraege, can_view_rechnungen,
    can_view_abnahmen, can_view_berichte, can_view_vertraege,
    can_view_all_projects, can_view_financials, can_view_commissions,
    can_export_data, can_download_pdfs, can_create_offers, can_create_invoices, can_edit_products)
  VALUES (NEW.user_id,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role = 'admin' THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','partner') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter','kunde') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role IN ('admin','mitarbeiter') THEN true ELSE false END,
    CASE WHEN NEW.role = 'admin' THEN true ELSE false END
  ) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_permissions_on_role_insert
  AFTER INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_permissions();
