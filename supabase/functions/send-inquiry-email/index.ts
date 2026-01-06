import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryFormRequest {
  type: string;
  anliegen?: string[];
  kontakt?: {
    name: string;
    funktion: string;
    unternehmen: string;
    email: string;
    telefon: string;
    adresse: string;
  };
  unternehmen?: {
    branche?: string;
    website?: string;
    gruendungsdatum?: string;
    mitarbeiter?: string;
    umsatz?: string;
    umsatzFreitext?: string;
    foerderRelevant: boolean;
  };
  beschreibung?: string;
  data?: any; // For Klarheitscheck
}

const formatKlarheitsCheckEmail = (data: any) => {
  const meta = data._meta || {};
  
  const servicesHtml = data.services_needed?.length 
    ? data.services_needed.map((s: string) => `<li>${s}</li>`).join("") 
    : "<li>Keine ausgewählt</li>";

  const projectGoalsHtml = data.project_goals?.length 
    ? data.project_goals.map((g: string) => `<li>${g}</li>`).join("") 
    : "<li>Keine angegeben</li>";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🎯 Neuer Klarheitscheck</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Lead-Priorität: <strong>${meta.lead_priority || 'Normal'}</strong> (Score: ${meta.priority_score || 0})</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
        
        <!-- AI/CRM Summary -->
        <div style="background: #dbeafe; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px; color: #1e40af;">📊 Analyse für AI-Agent / CRM</h3>
          <p style="margin: 5px 0;"><strong>Empfohlene Pakete:</strong> ${meta.recommended_packages?.join(", ") || "Keine"}</p>
          <p style="margin: 5px 0;"><strong>Nächster Schritt:</strong> ${meta.suggested_next_step || "Follow-up planen"}</p>
        </div>

        <!-- Unternehmen -->
        <h2 style="color: #0f172a; margin-top: 0;">🏢 Unternehmen</h2>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; width: 40%;">Unternehmen:</td>
            <td style="padding: 12px;">${data.company_name || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Ansprechpartner:</td>
            <td style="padding: 12px;">${data.contact_person || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Position:</td>
            <td style="padding: 12px;">${data.role || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">E-Mail:</td>
            <td style="padding: 12px;"><a href="mailto:${data.email}">${data.email || "-"}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Telefon:</td>
            <td style="padding: 12px;">${data.phone || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Branche:</td>
            <td style="padding: 12px;">${data.industry || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Größe:</td>
            <td style="padding: 12px;">${data.company_size || "-"}</td>
          </tr>
        </table>

        <!-- Projektziele -->
        <h2 style="color: #0f172a;">🎯 Projektziele</h2>
        <ul style="background: white; padding: 15px 15px 15px 35px; border-radius: 8px; border: 1px solid #e2e8f0;">
          ${projectGoalsHtml}
          ${data.project_goal_other ? `<li><em>Sonstiges: ${data.project_goal_other}</em></li>` : ""}
        </ul>
        ${data.main_challenge ? `
          <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 10px;">
            <strong>Hauptherausforderung:</strong><br/>${data.main_challenge}
          </div>
        ` : ""}

        <!-- Zeitrahmen -->
        <h2 style="color: #0f172a;">⏰ Zeit & Rahmen</h2>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; width: 40%;">Projektstart:</td>
            <td style="padding: 12px;">${data.project_start || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Abschluss:</td>
            <td style="padding: 12px;">${data.project_end || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Fester Termin:</td>
            <td style="padding: 12px;">${data.fixed_deadline || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Budget:</td>
            <td style="padding: 12px;">${data.budget_range || "-"}</td>
          </tr>
        </table>

        <!-- Leistungen -->
        <h2 style="color: #0f172a;">🛠️ Gewünschte Leistungen</h2>
        <ul style="background: white; padding: 15px 15px 15px 35px; border-radius: 8px; border: 1px solid #e2e8f0;">
          ${servicesHtml}
        </ul>

        ${data.services_needed?.includes('Website') || data.services_needed?.includes('Webshop') ? `
        <!-- Website Details -->
        <h3 style="color: #0f172a;">🌐 Website Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Bestehende Website:</td><td style="padding: 10px;">${data.existing_website || "-"}</td></tr>
          ${data.website_url ? `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">URL:</td><td style="padding: 10px;"><a href="${data.website_url}">${data.website_url}</a></td></tr>` : ""}
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Ziele:</td><td style="padding: 10px;">${data.website_goals?.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Content:</td><td style="padding: 10px;">${data.content_creation || "-"}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Features:</td><td style="padding: 10px;">${data.required_features?.join(", ") || "-"}</td></tr>
        </table>
        ` : ""}

        ${data.services_needed?.includes('Social Media Marketing') ? `
        <!-- Social Media Details -->
        <h3 style="color: #0f172a;">📱 Social Media Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Plattformen:</td><td style="padding: 10px;">${data.platforms?.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Ziele:</td><td style="padding: 10px;">${data.social_goals?.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Frequenz:</td><td style="padding: 10px;">${data.posting_frequency || "-"} ${data.posting_frequency_other || ""}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Content:</td><td style="padding: 10px;">${data.content_provider || "-"}</td></tr>
        </table>
        ` : ""}

        ${data.services_needed?.includes('KI-Agenten / Automation') ? `
        <!-- KI Details -->
        <h3 style="color: #0f172a;">🤖 KI-Agenten Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Einsatzbereiche:</td><td style="padding: 10px;">${data.ai_use_cases?.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Vorhandene Systeme:</td><td style="padding: 10px;">${data.existing_systems?.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Ziele:</td><td style="padding: 10px;">${data.ai_goals?.join(", ") || "-"}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">DSGVO:</td><td style="padding: 10px;">${data.gdpr_status || "-"}</td></tr>
        </table>
        ` : ""}

        ${data.services_needed?.includes('Voicebots / Sprachassistenz') ? `
        <!-- Voicebot Details -->
        <h3 style="color: #0f172a;">🎙️ Voicebot Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Einsatzbereiche:</td><td style="padding: 10px;">${data.voicebot_use_cases?.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Sprachen:</td><td style="padding: 10px;">${data.voicebot_languages || "-"}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Automatisierungsgrad:</td><td style="padding: 10px;">${data.automation_level || "-"}</td></tr>
        </table>
        ` : ""}

        ${data.services_needed?.includes('Prozessoptimierung / Digitalstrategie') ? `
        <!-- Prozess Details -->
        <h3 style="color: #0f172a;">⚙️ Prozessoptimierung Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Aktuelle Probleme:</td><td style="padding: 10px;">${data.current_issues?.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Dokumentation:</td><td style="padding: 10px;">${data.documentation_available || "-"}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Ziele:</td><td style="padding: 10px;">${data.optimization_goals?.join(", ") || "-"}</td></tr>
        </table>
        ` : ""}

        <!-- Zusammenarbeit -->
        <h2 style="color: #0f172a;">🤝 Zusammenarbeit</h2>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; width: 40%;">Entscheider:</td>
            <td style="padding: 12px;">${data.decision_maker || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Stakeholder:</td>
            <td style="padding: 12px;">${data.stakeholders || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Kommunikation:</td>
            <td style="padding: 12px;">${data.communication_preference || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Anmerkungen:</td>
            <td style="padding: 12px;">${data.additional_notes || "-"}</td>
          </tr>
        </table>

        <!-- JSON für CRM/AI -->
        <details style="margin-top: 25px;">
          <summary style="cursor: pointer; font-weight: bold; color: #64748b;">📋 Rohdaten (JSON für CRM/AI)</summary>
          <pre style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 12px; margin-top: 10px;">${JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>

      <div style="background: #0f172a; color: white; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">Eingegangen am: ${new Date().toLocaleString('de-DE')}</p>
      </div>
    </div>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: InquiryFormRequest = await req.json();
    
    // Handle Klarheitscheck submissions
    if (requestData.type === 'klarheitscheck' && requestData.data) {
      const data = requestData.data;
      console.log("Received Klarheitscheck submission:", { 
        company: data.company_name,
        email: data.email,
        services: data.services_needed,
        priority: data._meta?.lead_priority
      });

      // Send notification to business
      const notificationEmail = await resend.emails.send({
        from: "DeutLicht Klarheitscheck <kontakt@deutlicht.de>",
        to: ["info@deutlicht.de"],
        subject: `🎯 Klarheitscheck: ${data.company_name} | ${data._meta?.lead_priority || 'Normal'} Priorität`,
        html: formatKlarheitsCheckEmail(data),
      });

      console.log("Klarheitscheck notification sent:", notificationEmail);

      // Send confirmation to customer
      const confirmationEmail = await resend.emails.send({
        from: "DeutLicht <kontakt@deutlicht.de>",
        to: [data.email],
        subject: "Ihr DeutLicht-Klarheitscheck – Wir analysieren Ihren Bedarf!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0f172a; margin-bottom: 10px;">Vielen Dank für Ihren Klarheitscheck!</h1>
              <p style="color: #64748b; font-size: 16px;">Wir haben Ihre Angaben erhalten und analysieren nun Ihren individuellen Bedarf.</p>
            </div>

            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
              <p style="margin: 0; color: #0f172a;">Sehr geehrte/r ${data.contact_person},</p>
              <p style="color: #334155; line-height: 1.6;">
                herzlichen Dank, dass Sie sich Zeit für unseren Klarheitscheck genommen haben. Basierend auf Ihren Angaben erstellen wir nun eine erste Analyse und Empfehlung.
              </p>
              <p style="color: #334155; line-height: 1.6;">
                <strong>Ein persönlicher Berater wird sich innerhalb von 24 Stunden bei Ihnen melden.</strong>
              </p>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #0f172a; margin-top: 0;">Ihre Interessen im Überblick:</h3>
              <p><strong>Leistungsbereiche:</strong> ${data.services_needed?.join(", ") || "Nicht angegeben"}</p>
              <p><strong>Gewünschter Start:</strong> ${data.project_start || "Nicht angegeben"}</p>
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
                Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht®<br/>
                Gemeindeweg 4, 07546 Gera | info@deutlicht.de | www.deutlicht.de
              </p>
            </div>
          </div>
        `,
      });

      console.log("Klarheitscheck confirmation sent:", confirmationEmail);

      return new Response(
        JSON.stringify({ success: true, message: "Klarheitscheck erfolgreich gesendet" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Handle legacy InquiryForm submissions
    const { anliegen, kontakt, unternehmen, beschreibung } = requestData;

    if (!anliegen || !kontakt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Received inquiry form submission:", { 
      anliegen, 
      kontakt: { name: kontakt.name, email: kontakt.email },
      foerderRelevant: unternehmen?.foerderRelevant 
    });

    // Build HTML for notification email
    const anliegenList = anliegen.map(a => `<li>${a}</li>`).join("");
    
    const foerderSection = unternehmen?.foerderRelevant ? `
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
                <td style="padding: 12px;">${unternehmen?.branche || "Nicht angegeben"}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold;">Website:</td>
                <td style="padding: 12px;">${unternehmen?.website ? `<a href="${unternehmen.website}">${unternehmen.website}</a>` : "Nicht angegeben"}</td>
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
              Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht®<br/>
              Gemeindeweg 4, 07546 Gera | info@deutlicht.de | www.deutlicht.de
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
