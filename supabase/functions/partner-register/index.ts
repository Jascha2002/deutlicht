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

const partnerTypeLabels: Record<string, string> = {
  steuerberater: "Steuerberater / Kanzlei",
  marketing_agentur: "Marketing-Agentur",
  webdesigner: "Webdesigner / Developer",
  it_dienstleister: "IT-Dienstleister / Systemhaus",
  unternehmensberater: "Unternehmensberater",
  sonstige: "Sonstige",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Partner registration request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: PartnerRegistrationData = await req.json();
    console.log("Partner data:", JSON.stringify(data, null, 2));

    // Generate withdrawal token for unsubscribe link
    const withdrawalToken = crypto.randomUUID();

    // Send confirmation email first via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (RESEND_API_KEY) {
      try {
        const unsubscribeUrl = `https://deutlicht.de/partner/abmelden?token=${withdrawalToken}`;
        
        const confirmationEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">DeutLicht Partner-Programm</h1>
    </div>
    
    <div style="padding: 30px;">
      <h2 style="color: #1a1a2e; margin-top: 0;">Vielen Dank für Ihre Anmeldung!</h2>
      
      <p style="color: #333; line-height: 1.6;">
        Hallo ${data.contactFirstName} ${data.contactLastName},
      </p>
      
      <p style="color: #333; line-height: 1.6;">
        wir haben Ihre Partner-Anfrage für <strong>${data.companyName}</strong> erhalten und werden diese sorgfältig prüfen.
      </p>
      
      <div style="background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1a1a2e; margin-top: 0; font-size: 16px;">Ihre Angaben:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 40%;">Unternehmen:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Partner-Typ:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${partnerTypeLabels[data.partnerType] || data.partnerType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">E-Mail:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.contactEmail}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="color: #856404; margin: 0; font-size: 14px;">
          <strong>Wichtiger Hinweis:</strong> Das DeutLicht Partner-Programm richtet sich ausschließlich an Gewerbetreibende (B2B). 
          Provisionen werden auf Basis der Nettoumsätze berechnet – die Umsatzsteuer wird nicht provisioniert.
        </p>
      </div>
      
      <h3 style="color: #1a1a2e; font-size: 16px;">Wie geht es weiter?</h3>
      <ol style="color: #333; line-height: 1.8; padding-left: 20px;">
        <li>Unser Partner-Team prüft Ihre Angaben (1-2 Werktage)</li>
        <li>Bei positiver Prüfung erhalten Sie einen Partnervertrag zur Unterschrift</li>
        <li>Nach Vertragsunterzeichnung: Freischaltung Ihres Partner-Zugangs</li>
        <li>Willkommens-E-Mail mit Zugang zum Partner-Portal und Marketingmaterial</li>
      </ol>
      
      <p style="color: #333; line-height: 1.6;">
        Bei Fragen erreichen Sie uns unter:<br>
        📧 <a href="mailto:partner@deutlicht.de" style="color: #0066cc;">partner@deutlicht.de</a><br>
        📞 +49 178 55 49 216
      </p>
      
      <p style="color: #333; line-height: 1.6; margin-top: 30px;">
        Mit freundlichen Grüßen,<br>
        <strong>Ihr DeutLicht Partner-Team</strong>
      </p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">
        DeutLicht | Stadtnetz UG (haftungsbeschränkt)<br>
        www.deutlicht.de
      </p>
      <p style="color: #999; font-size: 11px; margin: 0;">
        Falls Sie sich nicht für das Partner-Programm angemeldet haben oder Ihre Anfrage zurückziehen möchten:<br>
        <a href="${unsubscribeUrl}" style="color: #999;">Anmeldung widerrufen</a>
      </p>
    </div>
  </div>
</body>
</html>
        `.trim();

        const confirmationEmailText = `
Vielen Dank für Ihre Anmeldung zum DeutLicht Partner-Programm!

Hallo ${data.contactFirstName} ${data.contactLastName},

wir haben Ihre Partner-Anfrage für ${data.companyName} erhalten und werden diese sorgfältig prüfen.

Ihre Angaben:
- Unternehmen: ${data.companyName}
- Partner-Typ: ${partnerTypeLabels[data.partnerType] || data.partnerType}
- E-Mail: ${data.contactEmail}

WICHTIGER HINWEIS: Das DeutLicht Partner-Programm richtet sich ausschließlich an Gewerbetreibende (B2B). 
Provisionen werden auf Basis der Nettoumsätze berechnet – die Umsatzsteuer wird nicht provisioniert.

Wie geht es weiter?
1. Unser Partner-Team prüft Ihre Angaben (1-2 Werktage)
2. Bei positiver Prüfung erhalten Sie einen Partnervertrag zur Unterschrift
3. Nach Vertragsunterzeichnung: Freischaltung Ihres Partner-Zugangs
4. Willkommens-E-Mail mit Zugang zum Partner-Portal und Marketingmaterial

Bei Fragen erreichen Sie uns unter:
📧 partner@deutlicht.de
📞 +49 178 55 49 216

Mit freundlichen Grüßen,
Ihr DeutLicht Partner-Team

--
DeutLicht | Stadtnetz UG (haftungsbeschränkt)
www.deutlicht.de

Falls Sie sich nicht für das Partner-Programm angemeldet haben oder Ihre Anfrage zurückziehen möchten:
${unsubscribeUrl}
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
            subject: "Partner-Anmeldung erhalten – So geht es weiter",
            html: confirmationEmailHtml,
            text: confirmationEmailText,
          }),
        });

        console.log("Confirmation email sent successfully");
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Continue anyway - don't fail the registration
      }
    }

    // Sync to Odoo CRM
    const ODOO_URL = "https://deutlicht.odoo.com";
    const ODOO_DB = "deutlicht";
    const ODOO_USERNAME = "carstenvds@gmail.com";
    const ODOO_API_KEY = Deno.env.get("OdooCRMLeads");

    let odooPartnerId = null;

    if (ODOO_API_KEY) {
      try {
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
              args: [ODOO_DB, ODOO_USERNAME, ODOO_API_KEY, {}],
            },
            id: Date.now(),
          }),
        });

        const authResult = await authResponse.json();
        const userId = authResult.result;

        if (userId) {
          console.log("Authenticated as user ID:", userId);

          // Build partner description
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
            function: data.contactPosition || false,
          };

          console.log("Creating partner in Odoo...");
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
          if (createResult.result) {
            odooPartnerId = createResult.result;
            console.log("Partner created in Odoo with ID:", odooPartnerId);
          }
        }
      } catch (odooError) {
        console.error("Odoo sync error:", odooError);
        // Continue anyway - Supabase is the source of truth
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Partner erfolgreich registriert",
        withdrawalToken,
        odooPartnerId,
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
