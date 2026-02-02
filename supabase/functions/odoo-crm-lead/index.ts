import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Odoo API Configuration
const ODOO_URL = "https://deutlicht.odoo.com";
const ODOO_DB = "deutlicht"; // For Odoo SaaS, DB name is typically the subdomain
const ODOO_API_KEY = Deno.env.get("OdooCRMLeads") || "";

interface OdooLeadData {
  name: string;
  contact_name?: string;
  email_from?: string;
  phone?: string;
  company_name?: string;
  street?: string;
  city?: string;
  zip?: string;
  description?: string;
  source?: string;
  // Custom fields for DeutLicht
  industry?: string;
  company_size?: string;
  services?: string[];
  estimated_setup?: number;
  estimated_monthly?: number;
  project_start?: string;
  project_deadline?: string;
}

interface RequestBody {
  type: 'angebotsgenerator' | 'projektanfrage' | 'kontakt' | 'klarheitscheck' | 'inquiry';
  data: OdooLeadData;
}

// Create lead in Odoo CRM using JSON-RPC
async function createOdooLead(leadData: OdooLeadData): Promise<{ success: boolean; lead_id?: number; error?: string }> {
  console.log("Creating Odoo lead with data:", JSON.stringify(leadData, null, 2));
  
  if (!ODOO_API_KEY) {
    console.error("Odoo API key not configured");
    return { success: false, error: "Odoo API key not configured" };
  }

  try {
    // Build description with all relevant info
    const descriptionParts = [
      leadData.description || "",
      "",
      "--- Zusätzliche Informationen ---",
      leadData.industry ? `Branche: ${leadData.industry}` : "",
      leadData.company_size ? `Unternehmensgröße: ${leadData.company_size}` : "",
      leadData.services?.length ? `Leistungen: ${leadData.services.join(", ")}` : "",
      leadData.estimated_setup ? `Geschätzte Einrichtung: ${leadData.estimated_setup.toLocaleString('de-DE')} €` : "",
      leadData.estimated_monthly ? `Geschätzte monatl. Kosten: ${leadData.estimated_monthly.toLocaleString('de-DE')} €` : "",
      leadData.project_start ? `Projektstart: ${leadData.project_start}` : "",
      leadData.project_deadline ? `Deadline: ${leadData.project_deadline}` : "",
    ].filter(Boolean).join("\n");

    // Prepare lead values for Odoo
    const leadValues = {
      name: leadData.name || "Neue Anfrage von deutlicht.de",
      contact_name: leadData.contact_name || "",
      email_from: leadData.email_from || "",
      phone: leadData.phone || "",
      partner_name: leadData.company_name || "",
      street: leadData.street || "",
      city: leadData.city || "",
      zip: leadData.zip || "",
      description: descriptionParts,
      type: "lead",
    };

    console.log("Sending to Odoo:", JSON.stringify(leadValues, null, 2));

    // Use API key directly with Basic Auth (Odoo SaaS method)
    // Format: email:api_key base64 encoded
    const credentials = btoa(`carsten.vds@gmail.com:${ODOO_API_KEY}`);
    
    // Try the REST API endpoint first (Odoo 14+)
    console.log("Trying Odoo REST API...");
    const restResponse = await fetch(`${ODOO_URL}/api/v1/crm.lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
      },
      body: JSON.stringify(leadValues),
    });

    // If REST API works
    if (restResponse.ok) {
      const restResult = await restResponse.json();
      console.log("Odoo REST API response:", JSON.stringify(restResult, null, 2));
      if (restResult.id) {
        return { success: true, lead_id: restResult.id };
      }
    }

    // Fallback: Try JSON-RPC with API key authentication
    console.log("Trying Odoo JSON-RPC with API key...");
    
    // First authenticate
    const authResponse = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "common",
          method: "authenticate",
          args: [ODOO_DB, "carsten.vds@gmail.com", ODOO_API_KEY, {}],
        },
        id: Date.now(),
      }),
    });

    const authResult = await authResponse.json();
    console.log("Odoo auth response:", JSON.stringify(authResult, null, 2));

    if (authResult.error) {
      console.error("Odoo auth error:", authResult.error);
      // Log but continue - the lead data is still sent via email
      return { success: false, error: "Odoo auth failed: " + (authResult.error.message || JSON.stringify(authResult.error)) };
    }

    const userId = authResult.result;
    if (!userId) {
      console.error("No user ID returned from authentication - API key may be invalid or user email incorrect");
      // Return partial success - data will still be sent via email
      return { success: false, error: "Odoo authentication failed. Please verify the API key and user email in Odoo settings." };
    }

    console.log("Authenticated as user ID:", userId);

    // Create lead
    const response = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            ODOO_DB,
            userId,
            ODOO_API_KEY,
            "crm.lead",
            "create",
            [leadValues],
          ],
        },
        id: Date.now(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Odoo API error response:", errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const result = await response.json();
    console.log("Odoo API response:", JSON.stringify(result, null, 2));

    if (result.error) {
      console.error("Odoo RPC error:", result.error);
      return { success: false, error: result.error.message || JSON.stringify(result.error) };
    }

    if (result.result) {
      console.log("Lead created successfully with ID:", result.result);
      return { success: true, lead_id: result.result };
    }

    return { success: false, error: "Unexpected response from Odoo" };
  } catch (error: any) {
    console.error("Error creating Odoo lead:", error);
    return { success: false, error: error.message };
  }
}

// Transform different form data types to OdooLeadData
function transformToLeadData(type: string, data: any): OdooLeadData {
  switch (type) {
    case 'angebotsgenerator':
    case 'projektanfrage':
      return {
        name: `Projektanfrage: ${data.company_name || 'Unbekannt'}`,
        contact_name: data.contact_person || "",
        email_from: data.customer_email || "",
        phone: data.customer_phone || "",
        company_name: data.company_name || "",
        street: data.company_street || "",
        city: data.company_city || "",
        zip: data.company_zip || "",
        description: `Quelle: ${type}\n\nProjektstart: ${data.project_start_timing || '-'}\nDeadline: ${data.project_deadline || '-'}`,
        source: type,
        industry: data.industry === 'Andere' ? data.industry_other : data.industry,
        company_size: data.company_size,
        services: data.services_selected || [],
        estimated_setup: data.estimated_setup || 0,
        estimated_monthly: data.estimated_monthly || 0,
        project_start: data.project_start_timing,
        project_deadline: data.project_deadline,
      };

    case 'kontakt':
    case 'inquiry':
      return {
        name: `Kontaktanfrage: ${data.kontakt?.unternehmen || data.company_name || 'Unbekannt'}`,
        contact_name: data.kontakt?.name || data.contact_name || "",
        email_from: data.kontakt?.email || data.email || "",
        phone: data.kontakt?.telefon || data.phone || "",
        company_name: data.kontakt?.unternehmen || data.company_name || "",
        street: data.kontakt?.adresse || "",
        description: `Quelle: ${type}\n\nAnliegen: ${data.anliegen?.join(", ") || '-'}\n\nBeschreibung: ${data.beschreibung || '-'}`,
        source: type,
        industry: data.unternehmen?.branche || "",
      };

    case 'klarheitscheck':
      return {
        name: `Klarheits-Check: ${data.company_name || 'Unbekannt'}`,
        contact_name: data.contact_person || "",
        email_from: data.email || "",
        phone: data.phone || "",
        company_name: data.company_name || "",
        description: `Quelle: Klarheits-Check\n\nBranche: ${data.industry || '-'}\nGröße: ${data.company_size || '-'}\n\nLeistungen: ${data.services_needed?.join(", ") || '-'}\n\nHauptherausforderung: ${data.main_challenge || '-'}`,
        source: "klarheitscheck",
        industry: data.industry,
        company_size: data.company_size,
        services: data.services_needed || [],
        project_start: data.project_start,
        project_deadline: data.project_end,
      };

    case 'analyse':
      return {
        name: data.name || `Digitalisierungsanalyse: ${data.company_name || 'Unbekannt'}`,
        contact_name: data.contact_name || "",
        email_from: data.email_from || "",
        phone: data.phone || "",
        company_name: data.company_name || "",
        street: data.street || "",
        city: data.city || "",
        zip: data.zip || "",
        description: data.description || `Quelle: Digitalisierungsanalyse\n\nBranche: ${data.industry || '-'}`,
        source: "digitalisierungsanalyse",
        industry: data.industry,
        company_size: data.company_size,
      };

    default:
      return {
        name: `Anfrage: ${data.company_name || data.kontakt?.unternehmen || 'Unbekannt'}`,
        contact_name: data.contact_person || data.kontakt?.name || "",
        email_from: data.customer_email || data.kontakt?.email || data.email || "",
        phone: data.customer_phone || data.kontakt?.telefon || data.phone || "",
        company_name: data.company_name || data.kontakt?.unternehmen || "",
        description: `Quelle: ${type}\n\n${JSON.stringify(data, null, 2)}`,
        source: type,
      };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: RequestBody = await req.json();
    
    console.log(`Processing ${type} submission for Odoo CRM`);
    console.log("Received data:", JSON.stringify(data, null, 2));

    // Transform data to lead format
    const leadData = transformToLeadData(type, data);

    // Create lead in Odoo
    const result = await createOdooLead(leadData);

    if (result.success) {
      console.log(`Successfully created lead in Odoo with ID: ${result.lead_id}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Lead erfolgreich in Odoo erstellt",
          lead_id: result.lead_id 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      console.error(`Failed to create lead in Odoo: ${result.error}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.error 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
