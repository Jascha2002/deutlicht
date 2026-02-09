-- Add line_items to orders (matching invoice structure)
ALTER TABLE public.crm_orders ADD COLUMN IF NOT EXISTS line_items jsonb;

-- Add order_id reference to invoices if not exists (already exists per schema check)
-- Add partial_invoice_items to track which order items were invoiced
-- This tracks per-invoice which order line items were included
