
-- Create templates table
CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  url text NOT NULL,
  description text,
  category text,
  tags text[],
  thumbnail_url text,
  created_by uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true
);

-- Create customer_templates table
CREATE TABLE public.customer_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id uuid REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  UNIQUE(customer_id, template_id)
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_templates ENABLE ROW LEVEL SECURITY;

-- Templates RLS: authenticated users can read active templates assigned to them
CREATE POLICY "Users can read assigned active templates"
ON public.templates FOR SELECT TO authenticated
USING (
  is_active = true AND (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'mitarbeiter') OR
    id IN (SELECT template_id FROM public.customer_templates WHERE customer_id = auth.uid())
  )
);

-- Templates: admin can insert
CREATE POLICY "Admins can insert templates"
ON public.templates FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Templates: admin can update
CREATE POLICY "Admins can update templates"
ON public.templates FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Templates: admin can delete
CREATE POLICY "Admins can delete templates"
ON public.templates FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Customer templates RLS: users can see own assignments
CREATE POLICY "Users can read own template assignments"
ON public.customer_templates FOR SELECT TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mitarbeiter'));

-- Customer templates: admin can insert
CREATE POLICY "Admins can assign templates"
ON public.customer_templates FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Customer templates: admin can delete
CREATE POLICY "Admins can unassign templates"
ON public.customer_templates FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
