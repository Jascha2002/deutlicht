import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadData {
  source: 'projektanfrage' | 'kontaktformular' | 'partner_referral' | 'website' | 'telefon' | 'messe' | 'empfehlung' | 'social_media' | 'google_ads' | 'sonstige';
  source_detail?: string;
  source_url?: string;
  
  // Contact info
  company_name?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_phone?: string;
  
  // Address
  street?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  
  // Project details
  industry?: string;
  company_size?: string;
  services_interested?: string[];
  project_description?: string;
  budget_range?: string;
  timeline?: string;
  
  // Legacy references
  legacy_project_lead_id?: string;
  partner_referral_id?: string;
  
  // Odoo sync
  odoo_lead_id?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const leadData: LeadData = await req.json();

    console.log('Creating CRM lead:', {
      source: leadData.source,
      email: leadData.contact_email,
      company: leadData.company_name
    });

    // Check for duplicate leads (same email in last 24h)
    const { data: existingLeads } = await supabase
      .from('crm_leads')
      .select('id, lead_number, status')
      .eq('contact_email', leadData.contact_email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existingLeads && existingLeads.length > 0) {
      console.log('Duplicate lead detected:', existingLeads[0].lead_number);
      
      // Update existing lead with new info
      const { data: updatedLead, error: updateError } = await supabase
        .from('crm_leads')
        .update({
          project_description: leadData.project_description 
            ? `${leadData.project_description}\n\n--- Weitere Anfrage ---\n${leadData.project_description}`
            : undefined,
          services_interested: leadData.services_interested,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingLeads[0].id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating existing lead:', updateError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          is_duplicate: true,
          lead_id: existingLeads[0].id,
          lead_number: existingLeads[0].lead_number,
          message: 'Lead wurde mit bestehender Anfrage zusammengeführt'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new lead
    const { data: newLead, error: insertError } = await supabase
      .from('crm_leads')
      .insert({
        source: leadData.source,
        source_detail: leadData.source_detail,
        source_url: leadData.source_url,
        company_name: leadData.company_name,
        contact_first_name: leadData.contact_first_name,
        contact_last_name: leadData.contact_last_name,
        contact_email: leadData.contact_email,
        contact_phone: leadData.contact_phone,
        street: leadData.street,
        postal_code: leadData.postal_code,
        city: leadData.city,
        country: leadData.country || 'Deutschland',
        industry: leadData.industry,
        company_size: leadData.company_size,
        services_interested: leadData.services_interested,
        project_description: leadData.project_description,
        budget_range: leadData.budget_range,
        timeline: leadData.timeline,
        legacy_project_lead_id: leadData.legacy_project_lead_id,
        partner_referral_id: leadData.partner_referral_id,
        odoo_lead_id: leadData.odoo_lead_id,
        odoo_synced_at: leadData.odoo_lead_id ? new Date().toISOString() : null,
        status: 'neu',
        priority: 3
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating lead:', insertError);
      throw insertError;
    }

    console.log('Lead created successfully:', newLead.lead_number);

    // Create initial activity
    await supabase
      .from('crm_lead_activities')
      .insert({
        lead_id: newLead.id,
        activity_type: 'note',
        title: 'Lead erstellt',
        description: `Neuer Lead über ${leadData.source}${leadData.source_detail ? ` (${leadData.source_detail})` : ''} eingegangen.`
      });

    return new Response(
      JSON.stringify({
        success: true,
        is_duplicate: false,
        lead_id: newLead.id,
        lead_number: newLead.lead_number,
        message: 'Lead erfolgreich erstellt'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in create-crm-lead:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
