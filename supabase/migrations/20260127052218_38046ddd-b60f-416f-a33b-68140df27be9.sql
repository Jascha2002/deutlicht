-- Add document tracking fields to partners table
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS contract_draft_content TEXT,
ADD COLUMN IF NOT EXISTS contract_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS website_check_status TEXT,
ADD COLUMN IF NOT EXISTS website_check_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS website_check_result JSONB;

-- Create partner_documents table for supporting documents
CREATE TABLE IF NOT EXISTS public.partner_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on partner_documents
ALTER TABLE public.partner_documents ENABLE ROW LEVEL SECURITY;

-- Admins and employees can manage partner documents
CREATE POLICY "Admins and employees can manage partner documents"
ON public.partner_documents
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'mitarbeiter')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'mitarbeiter')
);

-- Partners can view their own documents
CREATE POLICY "Partners can view own documents"
ON public.partner_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partners p 
    WHERE p.id = partner_id AND p.user_id = auth.uid()
  )
);

-- Create storage bucket for partner documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-documents', 'partner-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for partner documents bucket
CREATE POLICY "Admins and employees can manage partner document files"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'partner-documents' AND (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mitarbeiter')
  )
)
WITH CHECK (
  bucket_id = 'partner-documents' AND (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mitarbeiter')
  )
);

-- Partners can download their own documents (simplified policy)
CREATE POLICY "Partners can download own document files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'partner-documents' AND
  EXISTS (
    SELECT 1 FROM public.partners p 
    WHERE p.user_id = auth.uid() 
    AND name LIKE p.id::text || '/%'
  )
);

-- Add trigger for updated_at on partner_documents
CREATE TRIGGER update_partner_documents_updated_at
BEFORE UPDATE ON public.partner_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();