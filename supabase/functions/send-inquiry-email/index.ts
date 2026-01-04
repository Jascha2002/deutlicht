import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryFormRequest {
  type: string;
  anliegen: string[];
  kontakt: {
    name: string;
    funktion: string;
    unternehmen: string;
    email: string;
    telefon: string;
    adresse: string;
  };
  unternehmen: {
    branche?: string;
    website?: string;
    gruendungsdatum?: string;
    mitarbeiter?: string;
    umsatz?: string;
    umsatzFreitext?: string;
    foerderRelevant: boolean;
  };
  beschreibung?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InquiryFormRequest = await req.json();
    const { anliegen, kontakt, unternehmen, beschreibung } = data;

    console.log("Received inquiry form submission:", { 
      anliegen, 
      kontakt: { name: kontakt.name, email: kontakt.email },
      foerderRelevant: unternehmen.foerderRelevant 
    });

    // Build HTML for notification email
    const anliegenList = anliegen.map(a => `<li>${a}</li>`).join("");
    
    const foerderSection = unternehmen.foerderRelevant ? `
      <h3 style="color: #0f172a; margin-top: 20px;">Förderrelevante Daten:</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Gründungsdatum:</strong> ${unternehmen.gruendungsdatum || "Nicht angegeben"}</li>
        <li><strong>Mitarbeitende:</strong> ${unternehmen.mitarbeiter || "Nicht angegeben"}</li>
        <li><strong>Vorjahresumsatz:</strong> ${unternehmen.umsatz === "Andere" ? unternehmen.umsatzFreitext : unternehmen.umsatz || "Nicht angegeben"}</li>
      </ul>
    ` : "";

    // Send notification to business
    const notificationEmail = await resend.emails.send({
      from: "DeutLicht Anfrage <kontakt@deutlicht.de>",
      to: ["info@deutlicht.de"],
      subject: `Qualifizierte Anfrage: ${kontakt.unternehmen} - ${kontakt.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Neue qualifizierte Anfrage</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Über das Anfrageformular auf deutlicht.de</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #0f172a; margin-top: 0;">Anliegen:</h2>
            <ul style="background: white; padding: 15px 15px 15px 35px; border-radius: 8px; border: 1px solid #e2e8f0;">
              ${anliegenList}
            </ul>

            <h2 style="color: #0f172a;">Ansprechpartner:</h2>
            <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 12px;">${kontakt.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">Funktion:</td>
                <td style="padding: 12px;">${kontakt.funktion}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">Unternehmen:</td>
                <td style="padding: 12px;">${kontakt.unternehmen}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">E-Mail:</td>
                <td style="padding: 12px;"><a href="mailto:${kontakt.email}">${kontakt.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">Telefon:</td>
                <td style="padding: 12px;"><a href="tel:${kontakt.telefon}">${kontakt.telefon}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold;">Adresse:</td>
                <td style="padding: 12px;">${kontakt.adresse}</td>
              </tr>
            </table>

            <h2 style="color: #0f172a;">Unternehmensdaten:</h2>
            <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold; width: 40%;">Branche:</td>
                <td style="padding: 12px;">${unternehmen.branche || "Nicht angegeben"}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold;">Website:</td>
                <td style="padding: 12px;">${unternehmen.website ? `<a href="${unternehmen.website}">${unternehmen.website}</a>` : "Nicht angegeben"}</td>
              </tr>
            </table>

            ${foerderSection}

            ${beschreibung ? `
              <h2 style="color: #0f172a;">Beschreibung des Anliegens:</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${beschreibung}</div>
            ` : ""}
          </div>

          <div style="background: #0f172a; color: white; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">Diese Anfrage erfordert eine zeitnahe Rückmeldung (innerhalb 24h)</p>
          </div>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation to customer
    const confirmationEmail = await resend.emails.send({
      from: "DeutLicht <kontakt@deutlicht.de>",
      to: [kontakt.email],
      subject: "Ihre Anfrage bei DeutLicht – Wir melden uns!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0f172a; margin-bottom: 10px;">Vielen Dank für Ihre Anfrage!</h1>
            <p style="color: #64748b; font-size: 16px;">Wir haben Ihre Anfrage erhalten und freuen uns auf das Gespräch mit Ihnen.</p>
          </div>

          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <p style="margin: 0; color: #0f172a;">Sehr geehrte/r ${kontakt.name},</p>
            <p style="color: #334155; line-height: 1.6;">
              herzlichen Dank für Ihr Interesse an unseren Leistungen. Wir haben Ihre qualifizierte Anfrage erhalten und werden diese umgehend prüfen.
            </p>
            <p style="color: #334155; line-height: 1.6;">
              <strong>Ein persönlicher Ansprechpartner wird sich innerhalb von 24 Stunden bei Ihnen melden.</strong>
            </p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
            <h3 style="color: #0f172a; margin-top: 0;">Ihre Anfrage im Überblick:</h3>
            <p><strong>Anliegen:</strong> ${anliegen.join(", ")}</p>
            <p><strong>Unternehmen:</strong> ${kontakt.unternehmen}</p>
            ${beschreibung ? `<p><strong>Beschreibung:</strong> ${beschreibung}</p>` : ""}
          </div>

          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 12px; color: white;">
            <p style="margin: 0 0 15px;">Bei dringenden Fragen erreichen Sie uns unter:</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold;">+49 178 5549216</p>
            <p style="margin: 10px 0 0; font-size: 14px;">Mo-Do: 9-18 Uhr | Fr: 9-16 Uhr</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 5px;">Mit freundlichen Grüßen</p>
            <p style="color: #0f172a; font-weight: bold; margin: 0;">Ihr DeutLicht Team</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
              DeutLicht UG (i.Gr.) | Gemeindeweg 4, 07546 Gera<br />
              info@deutlicht.de | www.deutlicht.de
            </p>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(
      JSON.stringify({ success: true, message: "Anfrage erfolgreich gesendet" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-inquiry-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
