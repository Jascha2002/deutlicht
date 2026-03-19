
-- Drop the old unique constraint on (customer_id, template_id)
ALTER TABLE public.customer_templates DROP CONSTRAINT customer_templates_customer_id_template_id_key;

-- Add new unique constraint on (company_id, template_id) so each company can get each template once
ALTER TABLE public.customer_templates ADD CONSTRAINT customer_templates_company_id_template_id_key UNIQUE (company_id, template_id);
