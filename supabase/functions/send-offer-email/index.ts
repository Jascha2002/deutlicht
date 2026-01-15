import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { 
    style: 'currency', 
    currency: 'EUR', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(amount);
}

interface OfferEmailRequest {
  to: string;
  offerNumber: string;
  companyName: string;
  contactPerson: string;
  totalSetup: number;
  totalMonthly: number;
  services: string[];
  validUntil: string;
  acceptUrl: string;
}

const generateOfferEmailHtml = (data: OfferEmailRequest): string => {
  const safeCompany = escapeHtml(data.companyName) || "Ihr Unternehmen";
  const safeContact = escapeHtml(data.contactPerson);
  const safeOfferNumber = escapeHtml(data.offerNumber);
  
  const servicesHtml = data.services.map(s => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
        <span style="color: #10b981; margin-right: 8px;">✓</span>
        ${escapeHtml(s)}
      </td>
    </tr>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ihr personalisiertes Angebot – DeutLicht</title>
</head>
<body style="font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background: #f8fafc; color: #0f172a;">
  <div style="max-width: 650px; margin: 0 auto; background: white;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 40px; text-align: center;">
      <div style="background: #FFD700; color: #0f172a; padding: 8px 20px; border-radius: 50px; font-weight: 600; font-size: 12px; display: inline-block; margin-bottom: 20px;">
        PERSONALISIERTES ANGEBOT
      </div>
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Ihr maßgeschneidertes Angebot</h1>
      <p style="margin: 15px 0 0; opacity: 0.9; font-size: 16px;">Angebot ${safeOfferNumber}</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px;">
      
      <p style="font-size: 18px; margin-bottom: 25px;">
        Guten Tag <strong style="color: #0066FF;">${safeContact}</strong>,
      </p>
      
      <p style="color: #64748b; margin-bottom: 30px; line-height: 1.6;">
        vielen Dank für Ihre Projektanfrage! Basierend auf Ihren Angaben haben wir ein 
        individuelles Angebot für <strong style="color: #0f172a;">${safeCompany}</strong> erstellt.
      </p>
      
      <!-- Price Box -->
      <div style="background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
        <p style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">Ihr Investment</p>
        <div style="font-size: 36px; font-weight: 700;">${formatCurrency(data.totalSetup)}</div>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">einmalig, zzgl. MwSt.</p>
        ${data.totalMonthly > 0 ? `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
          <span style="font-size: 20px; font-weight: 600;">+ ${formatCurrency(data.totalMonthly)}/Monat</span>
          <span style="font-size: 12px; opacity: 0.8; display: block;">für laufende Leistungen</span>
        </div>
        ` : ''}
      </div>
      
      <!-- Services -->
      <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px; font-size: 16px; color: #0f172a;">
          📋 Enthaltene Leistungen
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${servicesHtml}
        </table>
      </div>
      
      <!-- Validity -->
      <div style="background: #fef3c7; padding: 15px 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>⏰ Gültigkeit:</strong> Dieses Angebot ist gültig bis zum <strong>${escapeHtml(data.validUntil)}</strong>
        </p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${data.acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          ✓ Angebot jetzt annehmen
        </a>
        <p style="margin: 15px 0 0; font-size: 13px; color: #64748b;">
          Mit einem Klick digital unterschreiben
        </p>
      </div>
      
      <!-- Next Steps -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 15px;">🚀 Nächste Schritte</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 10px 0; vertical-align: top;">
              <div style="width: 28px; height: 28px; background: #0066FF; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">1</div>
            </td>
            <td style="padding: 10px 0 10px 15px;">
              <strong style="color: #0f172a;">Angebot prüfen & annehmen</strong><br>
              <span style="color: #64748b; font-size: 13px;">Klicken Sie auf den Button und unterschreiben Sie digital</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; vertical-align: top;">
              <div style="width: 28px; height: 28px; background: #0066FF; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">2</div>
            </td>
            <td style="padding: 10px 0 10px 15px;">
              <strong style="color: #0f172a;">Kick-off Termin</strong><br>
              <span style="color: #64748b; font-size: 13px;">Wir melden uns für ein Abstimmungsgespräch</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; vertical-align: top;">
              <div style="width: 28px; height: 28px; background: #0066FF; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">3</div>
            </td>
            <td style="padding: 10px 0 10px 15px;">
              <strong style="color: #0f172a;">Projektstart</strong><br>
              <span style="color: #64748b; font-size: 13px;">Nach Freigabe beginnen wir mit der Umsetzung</span>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Contact Box -->
      <div style="background: #FFD700; color: #0f172a; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px; font-size: 16px;">Fragen zum Angebot?</h3>
        <div style="font-size: 22px; font-weight: 700;">+49 178 5549216</div>
        <div style="font-size: 14px; margin-top: 5px;">info@deutlicht.de</div>
      </div>
      
      <p style="color: #64748b; font-size: 13px; text-align: center;">
        Sie können das Angebot auch als PDF herunterladen, indem Sie es über den Link öffnen.
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="background: #0f172a; color: white; padding: 30px; text-align: center;">
      <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700;">DeutLicht®</p>
      <p style="margin: 0 0 5px; font-size: 12px; opacity: 0.7;">Stadtnetz UG (haftungsbeschränkt)</p>
      <p style="margin: 0 0 5px; font-size: 12px; opacity: 0.7;">Gemeindeweg 4 (Mäuseturm) | 07546 Gera</p>
      <p style="margin: 0; font-size: 12px; opacity: 0.7;">HRB 514530 Amtsgericht Jena</p>
    </div>
    
    <!-- Legal -->
    <div style="padding: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
      <p style="margin: 0 0 10px;">
        Es gelten unsere <a href="https://deutlicht.de/agb" style="color: #0066FF;">Allgemeinen Geschäftsbedingungen</a> 
        und <a href="https://deutlicht.de/datenschutz" style="color: #0066FF;">Datenschutzerklärung</a>.
      </p>
      <p style="margin: 0;">
        Diese E-Mail wurde automatisch generiert. Bei Fragen wenden Sie sich bitte an info@deutlicht.de
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OfferEmailRequest = await req.json();
    
    // Validate required fields
    if (!data.to || !data.offerNumber || !data.contactPerson) {
      return new Response(
        JSON.stringify({ error: "Pflichtfelder fehlen" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Generate email HTML
    const emailHtml = generateOfferEmailHtml(data);
    
    // Send offer email to customer
    const emailResult = await resend.emails.send({
      from: "DeutLicht <angebote@deutlicht.de>",
      to: [data.to],
      subject: `Ihr personalisiertes Angebot – ${data.offerNumber}`,
      html: emailHtml,
    });
    
    console.log("Offer email sent:", emailResult);
    
    // Send copy to internal
    await resend.emails.send({
      from: "DeutLicht System <system@deutlicht.de>",
      to: ["info@deutlicht.de"],
      subject: `📤 Angebot versendet: ${data.companyName || data.contactPerson} – ${data.offerNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Angebot wurde versendet</h2>
          <p><strong>An:</strong> ${escapeHtml(data.to)}</p>
          <p><strong>Unternehmen:</strong> ${escapeHtml(data.companyName)}</p>
          <p><strong>Ansprechpartner:</strong> ${escapeHtml(data.contactPerson)}</p>
          <p><strong>Angebotsnummer:</strong> ${escapeHtml(data.offerNumber)}</p>
          <p><strong>Einmalig:</strong> ${formatCurrency(data.totalSetup)}</p>
          <p><strong>Monatlich:</strong> ${formatCurrency(data.totalMonthly)}</p>
          <p><strong>Gültig bis:</strong> ${escapeHtml(data.validUntil)}</p>
          <hr>
          <p><strong>Leistungen:</strong></p>
          <ul>
            ${data.services.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
          </ul>
        </div>
      `,
    });
    
    return new Response(
      JSON.stringify({ success: true, message: "Angebot per E-Mail versendet", result: emailResult }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
    
  } catch (error: any) {
    console.error("Error in send-offer-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);