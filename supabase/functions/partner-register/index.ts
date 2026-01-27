import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PartnerRegistrationData {
  companyName: string;
  legalForm: string;
  taxId?: string;
  website?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone?: string;
  contactPosition?: string;
  partnerType: string;
  employeeCount?: string;
  foundedYear?: string;
  currentClients?: string;
  averageProjectValue?: string;
  targetMarkets?: string[];
  specializations?: string[];
  experience?: string;
  motivation?: string;
  portfolioUrl?: string;
  referencesText?: string;
  expectedVolume?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Partner registration request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: PartnerRegistrationData = await req.json();
    console.log("Partner data:", JSON.stringify(data, null, 2));

    // Environment variables
    const ODOO_URL = Deno.env.get("ODOO_URL") || "https://deutlicht.odoo.com";
    const ODOO_DB = Deno.env.get("ODOO_DB") || "deutlicht";
    const ODOO_API_KEY = Deno.env.get("OdooCRMLeads");

    if (!ODOO_API_KEY) {
      console.error("Missing Odoo API key");
      return new Response(
        JSON.stringify({ success: false, error: "Odoo configuration missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate with Odoo
    console.log("Authenticating with Odoo...");
    const authResponse = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "common",
          method: "authenticate",
          args: [ODOO_DB, "carstenvds@gmail.com", ODOO_API_KEY, {}],
        },
        id: Date.now(),
      }),
    });

    const authResult = await authResponse.json();
    console.log("Odoo auth response:", JSON.stringify(authResult, null, 2));

    if (authResult.error) {
      console.error("Odoo auth error:", authResult.error);
      return new Response(
        JSON.stringify({ success: false, error: "Authentication failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = authResult.result;
    if (!userId) {
      console.error("No user ID returned from authentication");
      return new Response(
        JSON.stringify({ success: false, error: "Authentication failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated as user ID:", userId);

    // Partner type mapping for Odoo
    const partnerTypeLabels: Record<string, string> = {
      steuerberater: "Steuerberater / Kanzlei",
      marketing_agentur: "Marketing-Agentur",
      webdesigner: "Webdesigner / Developer",
      it_dienstleister: "IT-Dienstleister / Systemhaus",
      unternehmensberater: "Unternehmensberater",
      sonstige: "Sonstige",
    };

    // Build partner description for Odoo
    const description = `
Partner-Typ: ${partnerTypeLabels[data.partnerType] || data.partnerType}
Mitarbeiter: ${data.employeeCount || "k.A."}
Gründungsjahr: ${data.foundedYear || "k.A."}
Aktuelle Kunden: ${data.currentClients || "k.A."}
Ø Projektwert: ${data.averageProjectValue || "k.A."}
Erfahrung: ${data.experience || "k.A."}

Ziel-Branchen: ${data.targetMarkets?.join(", ") || "k.A."}
Spezialisierungen: ${data.specializations?.join(", ") || "k.A."}

Erwartetes Volumen: ${data.expectedVolume || "k.A."}
Portfolio: ${data.portfolioUrl || "k.A."}

Motivation:
${data.motivation || "k.A."}

Referenzen:
${data.referencesText || "k.A."}
    `.trim();

    // Create partner in Odoo
    const partnerValues = {
      name: data.companyName,
      is_company: true,
      email: data.contactEmail,
      phone: data.contactPhone || false,
      website: data.website || false,
      street: data.street || false,
      zip: data.postalCode || false,
      city: data.city || false,
      country_id: 57, // Germany
      comment: description,
      // Contact person info in function field
      function: data.contactPosition || false,
      // Tags for partner identification
      category_id: [[6, 0, []]], // Will be set if tag exists
    };

    console.log("Creating partner in Odoo:", JSON.stringify(partnerValues, null, 2));

    const createResponse = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
            "res.partner",
            "create",
            [partnerValues],
          ],
        },
        id: Date.now(),
      }),
    });

    const createResult = await createResponse.json();
    console.log("Odoo create response:", JSON.stringify(createResult, null, 2));

    if (createResult.error) {
      console.error("Odoo create error:", createResult.error);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create partner in Odoo" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const partnerId = createResult.result;
    console.log("Partner created successfully with ID:", partnerId);

    // Send welcome email (optional - using Resend if configured)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      try {
        const emailContent = `
Hallo ${data.contactFirstName} ${data.contactLastName},

vielen Dank für Ihre Anmeldung als DeutLicht-Partner!

Wir haben Ihre Unterlagen erhalten und prüfen diese in den nächsten 1-2 Werktagen.

Ihre Daten:
- Unternehmen: ${data.companyName}
- Partner-Typ: ${partnerTypeLabels[data.partnerType] || data.partnerType}
- E-Mail: ${data.contactEmail}

Was passiert jetzt?
1. Unser Partner-Team prüft Ihre Angaben
2. Sie erhalten eine E-Mail mit Ihrem Partner-Portal-Zugang
3. Wir vereinbaren ein kostenloses Onboarding-Gespräch (30 Min.)

Bei Fragen können Sie uns jederzeit kontaktieren:
📧 partner@deutlicht.de
📞 +49 178 55 49 216

Beste Grüße,
Ihr DeutLicht Partner-Team

--
DeutLicht | Stadtnetz UG (haftungsbeschränkt)
www.deutlicht.de
        `.trim();

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "DeutLicht Partner <partner@deutlicht.de>",
            to: [data.contactEmail],
            subject: "Willkommen als DeutLicht-Partner! 🎉",
            text: emailContent,
          }),
        });

        console.log("Welcome email sent successfully");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        partnerId,
        message: "Partner erfolgreich registriert" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Partner registration error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
