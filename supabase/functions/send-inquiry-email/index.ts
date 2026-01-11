import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: max 5 requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// HTML escape function to prevent XSS/injection attacks
function escapeHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Escape array of strings
function escapeHtmlArray(arr: string[] | undefined | null): string[] {
  if (!arr) return [];
  return arr.map(item => escapeHtml(item));
}

// Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validateStringLength(str: string | undefined, maxLength: number): boolean {
  return !str || str.length <= maxLength;
}

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
  
  // Escape all user-provided data
  const safeCompanyName = escapeHtml(data.company_name);
  const safeContactPerson = escapeHtml(data.contact_person);
  const safeRole = escapeHtml(data.role);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeIndustry = escapeHtml(data.industry);
  const safeCompanySize = escapeHtml(data.company_size);
  const safeProjectStart = escapeHtml(data.project_start);
  const safeProjectEnd = escapeHtml(data.project_end);
  const safeFixedDeadline = escapeHtml(data.fixed_deadline);
  const safeBudgetRange = escapeHtml(data.budget_range);
  const safeMainChallenge = escapeHtml(data.main_challenge);
  const safeProjectGoalOther = escapeHtml(data.project_goal_other);
  const safeExistingWebsite = escapeHtml(data.existing_website);
  const safeWebsiteUrl = escapeHtml(data.website_url);
  const safeContentCreation = escapeHtml(data.content_creation);
  const safePostingFrequency = escapeHtml(data.posting_frequency);
  const safePostingFrequencyOther = escapeHtml(data.posting_frequency_other);
  const safeContentProvider = escapeHtml(data.content_provider);
  const safeGdprStatus = escapeHtml(data.gdpr_status);
  const safeVoicebotLanguages = escapeHtml(data.voicebot_languages);
  const safeAutomationLevel = escapeHtml(data.automation_level);
  const safeDocumentationAvailable = escapeHtml(data.documentation_available);
  const safeDecisionMaker = escapeHtml(data.decision_maker);
  const safeStakeholders = escapeHtml(data.stakeholders);
  const safeCommunicationPreference = escapeHtml(data.communication_preference);
  const safeAdditionalNotes = escapeHtml(data.additional_notes);
  const safeLeadPriority = escapeHtml(meta.lead_priority);
  const safePriorityScore = escapeHtml(String(meta.priority_score || 0));
  const safeSuggestedNextStep = escapeHtml(meta.suggested_next_step);
  
  // Escape arrays
  const safeServicesNeeded = escapeHtmlArray(data.services_needed);
  const safeProjectGoals = escapeHtmlArray(data.project_goals);
  const safeWebsiteGoals = escapeHtmlArray(data.website_goals);
  const safeRequiredFeatures = escapeHtmlArray(data.required_features);
  const safePlatforms = escapeHtmlArray(data.platforms);
  const safeSocialGoals = escapeHtmlArray(data.social_goals);
  const safeAiUseCases = escapeHtmlArray(data.ai_use_cases);
  const safeExistingSystems = escapeHtmlArray(data.existing_systems);
  const safeAiGoals = escapeHtmlArray(data.ai_goals);
  const safeVoicebotUseCases = escapeHtmlArray(data.voicebot_use_cases);
  const safeCurrentIssues = escapeHtmlArray(data.current_issues);
  const safeOptimizationGoals = escapeHtmlArray(data.optimization_goals);
  const safeRecommendedPackages = escapeHtmlArray(meta.recommended_packages);
  
  const servicesHtml = safeServicesNeeded.length 
    ? safeServicesNeeded.map((s: string) => `<li>${s}</li>`).join("") 
    : "<li>Keine ausgewählt</li>";

  const projectGoalsHtml = safeProjectGoals.length 
    ? safeProjectGoals.map((g: string) => `<li>${g}</li>`).join("") 
    : "<li>Keine angegeben</li>";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🎯 Neuer Klarheits-Check</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Lead-Priorität: <strong>${safeLeadPriority || 'Normal'}</strong> (Score: ${safePriorityScore})</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
        
        <!-- AI/CRM Summary -->
        <div style="background: #dbeafe; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px; color: #1e40af;">📊 Analyse für AI-Agent / CRM</h3>
          <p style="margin: 5px 0;"><strong>Empfohlene Pakete:</strong> ${safeRecommendedPackages.join(", ") || "Keine"}</p>
          <p style="margin: 5px 0;"><strong>Nächster Schritt:</strong> ${safeSuggestedNextStep || "Follow-up planen"}</p>
        </div>

        <!-- Unternehmen -->
        <h2 style="color: #0f172a; margin-top: 0;">🏢 Unternehmen</h2>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; width: 40%;">Unternehmen:</td>
            <td style="padding: 12px;">${safeCompanyName || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Ansprechpartner:</td>
            <td style="padding: 12px;">${safeContactPerson || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Position:</td>
            <td style="padding: 12px;">${safeRole || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">E-Mail:</td>
            <td style="padding: 12px;"><a href="mailto:${safeEmail}">${safeEmail || "-"}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Telefon:</td>
            <td style="padding: 12px;">${safePhone || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Branche:</td>
            <td style="padding: 12px;">${safeIndustry || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Größe:</td>
            <td style="padding: 12px;">${safeCompanySize || "-"}</td>
          </tr>
        </table>

        <!-- Projektziele -->
        <h2 style="color: #0f172a;">🎯 Projektziele</h2>
        <ul style="background: white; padding: 15px 15px 15px 35px; border-radius: 8px; border: 1px solid #e2e8f0;">
          ${projectGoalsHtml}
          ${safeProjectGoalOther ? `<li><em>Sonstiges: ${safeProjectGoalOther}</em></li>` : ""}
        </ul>
        ${safeMainChallenge ? `
          <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 10px;">
            <strong>Hauptherausforderung:</strong><br/>${safeMainChallenge}
          </div>
        ` : ""}

        <!-- Zeitrahmen -->
        <h2 style="color: #0f172a;">⏰ Zeit & Rahmen</h2>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; width: 40%;">Projektstart:</td>
            <td style="padding: 12px;">${safeProjectStart || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Abschluss:</td>
            <td style="padding: 12px;">${safeProjectEnd || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Fester Termin:</td>
            <td style="padding: 12px;">${safeFixedDeadline || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Budget:</td>
            <td style="padding: 12px;">${safeBudgetRange || "-"}</td>
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
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Bestehende Website:</td><td style="padding: 10px;">${safeExistingWebsite || "-"}</td></tr>
          ${safeWebsiteUrl ? `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">URL:</td><td style="padding: 10px;"><a href="${safeWebsiteUrl}">${safeWebsiteUrl}</a></td></tr>` : ""}
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Ziele:</td><td style="padding: 10px;">${safeWebsiteGoals.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Content:</td><td style="padding: 10px;">${safeContentCreation || "-"}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Features:</td><td style="padding: 10px;">${safeRequiredFeatures.join(", ") || "-"}</td></tr>
        </table>
        ` : ""}

        ${data.services_needed?.includes('Social Media Marketing') ? `
        <!-- Social Media Details -->
        <h3 style="color: #0f172a;">📱 Social Media Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Plattformen:</td><td style="padding: 10px;">${safePlatforms.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Ziele:</td><td style="padding: 10px;">${safeSocialGoals.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Frequenz:</td><td style="padding: 10px;">${safePostingFrequency || "-"} ${safePostingFrequencyOther || ""}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Content:</td><td style="padding: 10px;">${safeContentProvider || "-"}</td></tr>
        </table>
        ` : ""}

        ${data.services_needed?.includes('KI-Agenten / Automation') ? `
        <!-- KI Details -->
        <h3 style="color: #0f172a;">🤖 KI-Agenten Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Einsatzbereiche:</td><td style="padding: 10px;">${safeAiUseCases.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Vorhandene Systeme:</td><td style="padding: 10px;">${safeExistingSystems.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Ziele:</td><td style="padding: 10px;">${safeAiGoals.join(", ") || "-"}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">DSGVO:</td><td style="padding: 10px;">${safeGdprStatus || "-"}</td></tr>
        </table>
        ` : ""}

        ${data.services_needed?.includes('Voicebots / Sprachassistenz') ? `
        <!-- Voicebot Details -->
        <h3 style="color: #0f172a;">🎙️ Voicebot Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Einsatzbereiche:</td><td style="padding: 10px;">${safeVoicebotUseCases.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Sprachen:</td><td style="padding: 10px;">${safeVoicebotLanguages || "-"}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Automatisierungsgrad:</td><td style="padding: 10px;">${safeAutomationLevel || "-"}</td></tr>
        </table>
        ` : ""}

        ${data.services_needed?.includes('Prozessoptimierung / Digitalstrategie') ? `
        <!-- Prozess Details -->
        <h3 style="color: #0f172a;">⚙️ Prozessoptimierung Details</h3>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Aktuelle Probleme:</td><td style="padding: 10px;">${safeCurrentIssues.join(", ") || "-"}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Dokumentation:</td><td style="padding: 10px;">${safeDocumentationAvailable || "-"}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Ziele:</td><td style="padding: 10px;">${safeOptimizationGoals.join(", ") || "-"}</td></tr>
        </table>
        ` : ""}

        <!-- Zusammenarbeit -->
        <h2 style="color: #0f172a;">🤝 Zusammenarbeit</h2>
        <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold; width: 40%;">Entscheider:</td>
            <td style="padding: 12px;">${safeDecisionMaker || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Stakeholder:</td>
            <td style="padding: 12px;">${safeStakeholders || "-"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; font-weight: bold;">Kommunikation:</td>
            <td style="padding: 12px;">${safeCommunicationPreference || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Anmerkungen:</td>
            <td style="padding: 12px;">${safeAdditionalNotes || "-"}</td>
          </tr>
        </table>

        <!-- JSON für CRM/AI - sanitized -->
        <details style="margin-top: 25px;">
          <summary style="cursor: pointer; font-weight: bold; color: #64748b;">📋 Rohdaten (JSON für CRM/AI)</summary>
          <pre style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 12px; margin-top: 10px;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
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
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestData: InquiryFormRequest = await req.json();
    
    // Handle Klarheitscheck submissions
    if (requestData.type === 'klarheitscheck' && requestData.data) {
      const data = requestData.data;
      
      // Validate email
      if (!data.email || !validateEmail(data.email)) {
        return new Response(
          JSON.stringify({ error: "Ungültige E-Mail-Adresse" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      console.log("Processing Klarheitscheck submission");

      // Send notification to business
      const notificationEmail = await resend.emails.send({
        from: "DeutLicht Projektanfrage <kontakt@deutlicht.de>",
        to: ["info@deutlicht.de"],
        subject: `🎯 Projektanfrage: ${escapeHtml(data.company_name)} | ${escapeHtml(data._meta?.lead_priority) || 'Normal'} Priorität`,
        html: formatKlarheitsCheckEmail(data),
      });

      console.log("Projektanfrage notification sent:", notificationEmail);

      // Send confirmation to customer with escaped content
      const safeContactPerson = escapeHtml(data.contact_person);
      const safeServicesNeeded = escapeHtmlArray(data.services_needed);
      const safeProjectStart = escapeHtml(data.project_start);

      const confirmationEmail = await resend.emails.send({
        from: "DeutLicht <kontakt@deutlicht.de>",
        to: [data.email],
        subject: "Ihre DeutLicht-Projektanfrage – Wir analysieren Ihren Bedarf!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0f172a; margin-bottom: 10px;">Vielen Dank für Ihre Projektanfrage!</h1>
              <p style="color: #64748b; font-size: 16px;">Wir haben Ihre Angaben erhalten und analysieren nun Ihren individuellen Bedarf.</p>
            </div>

            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
              <p style="margin: 0; color: #0f172a;">Sehr geehrte/r ${safeContactPerson},</p>
              <p style="color: #334155; line-height: 1.6;">
                herzlichen Dank, dass Sie sich Zeit für unsere Projektanfrage genommen haben. Basierend auf Ihren Angaben erstellen wir nun eine erste Analyse und Empfehlung.
              </p>
              <p style="color: #334155; line-height: 1.6;">
                <strong>Ein persönlicher Berater wird sich innerhalb von 24 Stunden bei Ihnen melden.</strong>
              </p>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #0f172a; margin-top: 0;">Ihre Interessen im Überblick:</h3>
              <p><strong>Leistungsbereiche:</strong> ${safeServicesNeeded.join(", ") || "Nicht angegeben"}</p>
              <p><strong>Gewünschter Start:</strong> ${safeProjectStart || "Nicht angegeben"}</p>
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

    // Validate email
    if (!validateEmail(kontakt.email)) {
      return new Response(
        JSON.stringify({ error: "Ungültige E-Mail-Adresse" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Processing inquiry form submission");

    // Escape all user inputs
    const safeAnliegen = escapeHtmlArray(anliegen);
    const safeKontaktName = escapeHtml(kontakt.name);
    const safeKontaktFunktion = escapeHtml(kontakt.funktion);
    const safeKontaktUnternehmen = escapeHtml(kontakt.unternehmen);
    const safeKontaktEmail = escapeHtml(kontakt.email);
    const safeKontaktTelefon = escapeHtml(kontakt.telefon);
    const safeKontaktAdresse = escapeHtml(kontakt.adresse);
    const safeBranche = escapeHtml(unternehmen?.branche);
    const safeWebsite = escapeHtml(unternehmen?.website);
    const safeGruendungsdatum = escapeHtml(unternehmen?.gruendungsdatum);
    const safeMitarbeiter = escapeHtml(unternehmen?.mitarbeiter);
    const safeUmsatz = escapeHtml(unternehmen?.umsatz);
    const safeUmsatzFreitext = escapeHtml(unternehmen?.umsatzFreitext);
    const safeBeschreibung = escapeHtml(beschreibung);

    // Build HTML for notification email
    const anliegenList = safeAnliegen.map(a => `<li>${a}</li>`).join("");
    
    const foerderSection = unternehmen?.foerderRelevant ? `
      <h3 style="color: #0f172a; margin-top: 20px;">Förderrelevante Daten:</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Gründungsdatum:</strong> ${safeGruendungsdatum || "Nicht angegeben"}</li>
        <li><strong>Mitarbeitende:</strong> ${safeMitarbeiter || "Nicht angegeben"}</li>
        <li><strong>Vorjahresumsatz:</strong> ${safeUmsatz === "Andere" ? safeUmsatzFreitext : safeUmsatz || "Nicht angegeben"}</li>
      </ul>
    ` : "";

    // Send notification to business
    const notificationEmail = await resend.emails.send({
      from: "DeutLicht Anfrage <kontakt@deutlicht.de>",
      to: ["info@deutlicht.de"],
      subject: `Qualifizierte Anfrage: ${safeKontaktUnternehmen} - ${safeKontaktName}`,
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
                <td style="padding: 12px;">${safeKontaktName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">Funktion:</td>
                <td style="padding: 12px;">${safeKontaktFunktion}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">Unternehmen:</td>
                <td style="padding: 12px;">${safeKontaktUnternehmen}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">E-Mail:</td>
                <td style="padding: 12px;"><a href="mailto:${safeKontaktEmail}">${safeKontaktEmail}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">Telefon:</td>
                <td style="padding: 12px;"><a href="tel:${safeKontaktTelefon}">${safeKontaktTelefon}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold;">Adresse:</td>
                <td style="padding: 12px;">${safeKontaktAdresse}</td>
              </tr>
            </table>

            <h2 style="color: #0f172a;">Unternehmensdaten:</h2>
            <table style="width: 100%; background: white; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold; width: 40%;">Branche:</td>
                <td style="padding: 12px;">${safeBranche || "Nicht angegeben"}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold;">Website:</td>
                <td style="padding: 12px;">${safeWebsite ? `<a href="${safeWebsite}">${safeWebsite}</a>` : "Nicht angegeben"}</td>
              </tr>
            </table>

            ${foerderSection}

            ${safeBeschreibung ? `
              <h2 style="color: #0f172a;">Beschreibung des Anliegens:</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${safeBeschreibung}</div>
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
            <p style="margin: 0; color: #0f172a;">Sehr geehrte/r ${safeKontaktName},</p>
            <p style="color: #334155; line-height: 1.6;">
              herzlichen Dank für Ihr Interesse an unseren Leistungen. Wir haben Ihre qualifizierte Anfrage erhalten und werden diese umgehend prüfen.
            </p>
            <p style="color: #334155; line-height: 1.6;">
              <strong>Ein persönlicher Ansprechpartner wird sich innerhalb von 24 Stunden bei Ihnen melden.</strong>
            </p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
            <h3 style="color: #0f172a; margin-top: 0;">Ihre Anfrage im Überblick:</h3>
            <p><strong>Anliegen:</strong> ${safeAnliegen.join(", ")}</p>
            <p><strong>Unternehmen:</strong> ${safeKontaktUnternehmen}</p>
            ${safeBeschreibung ? `<p><strong>Beschreibung:</strong> ${safeBeschreibung}</p>` : ""}
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
      JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
