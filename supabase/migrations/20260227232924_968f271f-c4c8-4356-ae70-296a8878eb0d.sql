
CREATE TABLE public.template_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  feedback TEXT NOT NULL CHECK (feedback IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, template_id)
);

ALTER TABLE public.template_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own feedback"
  ON public.template_feedback FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can upsert own feedback"
  ON public.template_feedback FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own feedback"
  ON public.template_feedback FOR UPDATE
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins can view all feedback"
  ON public.template_feedback FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
