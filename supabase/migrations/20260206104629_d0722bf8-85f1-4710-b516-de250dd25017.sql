-- Add reference customer field and assigned team member to crm_companies
ALTER TABLE public.crm_companies 
ADD COLUMN IF NOT EXISTS is_reference_customer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reference_customer_notes TEXT;

-- Add team assignment table for project staff access
CREATE TABLE IF NOT EXISTS public.project_team_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_in_project TEXT DEFAULT 'mitarbeiter', -- mitarbeiter, freiberufler, dienstleister, produktion
  access_level TEXT DEFAULT 'read', -- read, write, admin
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_team_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_team_assignments
CREATE POLICY "Admins can manage all project assignments" 
ON public.project_team_assignments 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team members can view their own assignments" 
ON public.project_team_assignments 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Mitarbeiter can manage assignments for their projects" 
ON public.project_team_assignments 
FOR ALL 
TO authenticated 
USING (
  public.has_role(auth.uid(), 'mitarbeiter') AND 
  EXISTS (
    SELECT 1 FROM public.project_team_assignments pta 
    WHERE pta.project_id = project_team_assignments.project_id 
    AND pta.user_id = auth.uid() 
    AND pta.access_level = 'admin'
  )
);

-- Create project files/assets table for shared resources
CREATE TABLE IF NOT EXISTS public.project_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.crm_projects(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT, -- image, video, document, text, other
  file_size BIGINT,
  description TEXT,
  category TEXT, -- logo, bilder, texte, videos, dokumente, sonstiges
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB
);

-- Enable RLS
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_assets
CREATE POLICY "Admins can manage all project assets" 
ON public.project_assets 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team members can view project assets" 
ON public.project_assets 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.project_team_assignments pta 
    WHERE pta.project_id = project_assets.project_id 
    AND pta.user_id = auth.uid()
  )
);

CREATE POLICY "Team members with write access can add assets" 
ON public.project_assets 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_team_assignments pta 
    WHERE pta.project_id = project_assets.project_id 
    AND pta.user_id = auth.uid() 
    AND pta.access_level IN ('write', 'admin')
  ) OR public.has_role(auth.uid(), 'mitarbeiter')
);

CREATE POLICY "Team members with write access can update assets" 
ON public.project_assets 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.project_team_assignments pta 
    WHERE pta.project_id = project_assets.project_id 
    AND pta.user_id = auth.uid() 
    AND pta.access_level IN ('write', 'admin')
  ) OR uploaded_by = auth.uid()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_project_team_project_id ON public.project_team_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_user_id ON public.project_team_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id ON public.project_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_category ON public.project_assets(category);