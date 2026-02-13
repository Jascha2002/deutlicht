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

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
}

interface AcceptOfferRequest {
  offerId: string;
  offerNumber: string;
  totalAmount: string;
  fullName: string;
  company: string;
  email: string;
  signature: string;
  acceptedAt: string;
  agbAccepted: boolean;
  datenschutzAccepted: boolean;
}

const generateOrderConfirmationHtml = (data: AcceptOfferRequest): string => {
  const today = new Date();
  const orderNumber = `AB-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
  
  const safeCompany = escapeHtml(data.company) || "Ihr Unternehmen";
  const safeFullName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const safeOfferNumber = escapeHtml(data.offerNumber);
  const amount = parseFloat(data.totalAmount) || 0;
  const amountWithVat = amount * 1.19;
  
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auftragsbestätigung ${orderNumber}</title>
  <style>
    @page { size: A4; margin: 0; }
    @media print { .page { page-break-after: always; } .page:last-child { page-break-after: auto; } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.6; background: #f8fafc; font-size: 14px; }
    .email-wrapper { max-width: 650px; margin: 0 auto; background: white; }
    
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 40px; text-align: center; }
    .header-badge { background: #FFD700; color: #0f172a; padding: 8px 20px; border-radius: 50px; font-weight: 600; font-size: 12px; display: inline-block; margin-bottom: 20px; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header p { opacity: 0.9; font-size: 16px; }
    
    .content { padding: 40px; }
    
    .greeting { font-size: 18px; margin-bottom: 20px; }
    .greeting strong { color: #0066FF; }
    
    .intro { color: #64748b; margin-bottom: 30px; }
    
    .order-box { background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; }
    .order-box h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin-bottom: 8px; }
    .order-box .number { font-size: 24px; font-weight: 700; }
    .order-box .ref { margin-top: 15px; font-size: 13px; opacity: 0.9; }
    
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
    .detail-card { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 3px solid #0066FF; }
    .detail-card label { font-size: 11px; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 3px; }
    .detail-card .value { font-size: 16px; font-weight: 600; color: #0f172a; }
    
    .price-section { background: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 30px; }
    .price-section h3 { font-size: 16px; margin-bottom: 15px; color: #0f172a; }
    .price-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .price-row:last-child { border-bottom: none; }
    .price-row.total { background: #0f172a; color: white; margin: 15px -25px -25px; padding: 15px 25px; border-radius: 0 0 12px 12px; font-weight: 700; }
    .price-row.total .amount { color: #FFD700; }
    
    .next-steps { margin-bottom: 30px; }
    .next-steps h3 { font-size: 18px; margin-bottom: 20px; color: #0f172a; }
    .step { display: flex; gap: 15px; margin-bottom: 20px; }
    .step-number { width: 32px; height: 32px; background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .step-content h4 { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
    .step-content p { font-size: 13px; color: #64748b; }
    
    .signature-section { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
    .signature-section p { font-size: 12px; color: #64748b; margin-bottom: 10px; }
    .signature-section img { max-width: 200px; max-height: 80px; }
    
    .cta-box { background: #FFD700; color: #0f172a; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .cta-box h3 { font-size: 16px; margin-bottom: 10px; }
    .cta-box .phone { font-size: 22px; font-weight: 700; }
    .cta-box .email { font-size: 14px; margin-top: 5px; }
    
    .legal { font-size: 11px; color: #64748b; padding: 20px; border-top: 1px solid #e2e8f0; }
    .legal p { margin-bottom: 10px; }
    
    .footer { background: #0f172a; color: white; padding: 30px; text-align: center; }
    .footer p { font-size: 12px; opacity: 0.7; margin-bottom: 5px; }
    .footer .brand { font-size: 16px; font-weight: 700; opacity: 1; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="header-badge">✓ AUFTRAGSBESTÄTIGUNG</div>
      <h1>Vielen Dank für Ihr Vertrauen!</h1>
      <p>Wir freuen uns auf die Zusammenarbeit mit Ihnen.</p>
    </div>
    
    <div class="content">
      <p class="greeting">
        Guten Tag <strong>${safeFullName}</strong>,
      </p>
      
      <p class="intro">
        hiermit bestätigen wir den Eingang Ihrer Auftragserteilung und die verbindliche Annahme 
        des Angebots ${safeOfferNumber}. Nachfolgend finden Sie alle wichtigen Details zu Ihrem Auftrag.
      </p>
      
      <div class="order-box">
        <h2>Auftragsnummer</h2>
        <div class="number">${orderNumber}</div>
        <div class="ref">Bezug: Angebot ${safeOfferNumber}</div>
      </div>
      
      <div class="details-grid">
        <div class="detail-card">
          <label>Auftraggeber</label>
          <div class="value">${safeCompany}</div>
        </div>
        <div class="detail-card">
          <label>Ansprechpartner</label>
          <div class="value">${safeFullName}</div>
        </div>
        <div class="detail-card">
          <label>Angenommen am</label>
          <div class="value">${formatDate(new Date(data.acceptedAt))}</div>
        </div>
        <div class="detail-card">
          <label>E-Mail</label>
          <div class="value">${safeEmail}</div>
        </div>
      </div>
      
      <div class="price-section">
        <h3>Auftragsübersicht</h3>
        <div class="price-row">
          <span>Leistungen gemäß Angebot ${safeOfferNumber}</span>
          <span class="amount">${formatCurrency(amount)}</span>
        </div>
        <div class="price-row">
          <span>Nettobetrag</span>
          <span class="amount">${formatCurrency(amount)}</span>
        </div>
        <div class="price-row">
          <span>zzgl. 19% MwSt.</span>
          <span class="amount">${formatCurrency(amount * 0.19)}</span>
        </div>
        <div class="price-row total">
          <span>Gesamtbetrag (brutto)</span>
          <span class="amount">${formatCurrency(amountWithVat)}</span>
        </div>
      </div>
      
      <div class="next-steps">
        <h3>Ihre nächsten Schritte</h3>
        
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Kick-off Termin</h4>
            <p>Wir melden uns innerhalb von 24-48 Stunden bei Ihnen, um einen Kick-off Termin zu vereinbaren.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Anzahlung</h4>
            <p>Sie erhalten in Kürze eine Rechnung über 50% des Auftragswertes (${formatCurrency(amount * 0.5)} netto).</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Projektstart</h4>
            <p>Nach Zahlungseingang und Kick-off starten wir mit der Umsetzung Ihres Projekts.</p>
          </div>
        </div>
      </div>
      
      ${data.signature ? `
      <div class="signature-section">
        <p>Ihre digitale Unterschrift vom ${formatDate(new Date(data.acceptedAt))}:</p>
        <img src="${data.signature}" alt="Digitale Unterschrift" />
      </div>
      ` : ''}
      
      <div class="cta-box">
        <h3>Fragen zu Ihrem Auftrag?</h3>
        <div class="phone">+49 178 5549216</div>
        <div class="email">info@deutlicht.de</div>
      </div>
      
      <div class="legal">
        <p>
          <strong>Rechtliche Hinweise:</strong> Mit der digitalen Annahme des Angebots haben Sie die 
          Allgemeinen Geschäftsbedingungen (AGB) der Stadtnetz UG (haftungsbeschränkt) akzeptiert. 
          Die AGB finden Sie unter: www.deutlicht.de/agb
        </p>
        <p>
          Diese Auftragsbestätigung wurde automatisch generiert und ist auch ohne Unterschrift gültig.
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p class="brand">DeutLicht®</p>
      <p>Stadtnetz UG (haftungsbeschränkt)</p>
      <p>Gemeindeweg 4 (Mäuseturm) | 07546 Gera</p>
      <p>HRB 514530 Amtsgericht Jena | GF: Carsten van de Sand</p>
    </div>
  </div>
</body>
</html>
  `;
};

const generateInternalNotificationHtml = (data: AcceptOfferRequest): string => {
  const safeCompany = escapeHtml(data.company) || "Unbekannt";
  const safeFullName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const safeOfferNumber = escapeHtml(data.offerNumber);
  const amount = parseFloat(data.totalAmount) || 0;
  
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>🎉 Neuer Auftrag eingegangen!</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">🎉 Neuer Auftrag!</h1>
    <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Ein Angebot wurde angenommen</p>
  </div>
  
  <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
      <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 18px;">Auftragsdetails</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 0; color: #64748b;">Angebotsnummer:</td>
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${safeOfferNumber}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 0; color: #64748b;">Unternehmen:</td>
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${safeCompany}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 0; color: #64748b;">Ansprechpartner:</td>
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${safeFullName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 0; color: #64748b;">E-Mail:</td>
          <td style="padding: 10px 0;"><a href="mailto:${safeEmail}" style="color: #0066FF;">${safeEmail}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 0; color: #64748b;">Auftragswert (netto):</td>
          <td style="padding: 10px 0; font-weight: bold; color: #10b981; font-size: 18px;">${amount.toLocaleString('de-DE')} €</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b;">Angenommen am:</td>
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${formatDate(new Date(data.acceptedAt))}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px; color: #1e40af; font-size: 14px;">📋 To-Do</h3>
      <ul style="margin: 0; padding-left: 20px; color: #1e3a5f;">
        <li>Kick-off Termin vereinbaren</li>
        <li>Anzahlungsrechnung (50%) erstellen</li>
        <li>Projekt in Projektmanagement anlegen</li>
      </ul>
    </div>
    
    ${data.signature ? `
    <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
      <p style="margin: 0 0 10px; color: #64748b; font-size: 12px;">Kundenunterschrift:</p>
      <img src="${data.signature}" alt="Unterschrift" style="max-width: 200px; max-height: 80px;" />
    </div>
    ` : ''}
  </div>
  
  <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
    <p>Diese Benachrichtigung wurde automatisch vom DeutLicht Angebotssystem gesendet.</p>
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
    const data: AcceptOfferRequest = await req.json();
    
    // Validate required fields
    if (!data.email || !data.fullName) {
      return new Response(
        JSON.stringify({ error: "Pflichtfelder fehlen (Name und E-Mail erforderlich)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Fallback for missing offerNumber
    if (!data.offerNumber) {
      data.offerNumber = `DIREKT-${new Date().toISOString().slice(0,10)}`;
    }
    
    // Generate order confirmation HTML
    const orderConfirmationHtml = generateOrderConfirmationHtml(data);
    const internalNotificationHtml = generateInternalNotificationHtml(data);
    
    // Send order confirmation to customer
    const customerEmailResult = await resend.emails.send({
      from: "DeutLicht <auftraege@deutlicht.de>",
      to: [data.email],
      subject: `Auftragsbestätigung – Angebot ${data.offerNumber} angenommen`,
      html: orderConfirmationHtml,
    });
    
    console.log("Customer order confirmation sent:", customerEmailResult);
    
    // Send internal notification
    const internalEmailResult = await resend.emails.send({
      from: "DeutLicht System <system@deutlicht.de>",
      to: ["info@deutlicht.de", "carstenvds@gmail.com"],
      subject: `🎉 Neuer Auftrag: ${data.company || data.fullName} – ${data.offerNumber}`,
      html: internalNotificationHtml,
    });
    
    console.log("Internal notification sent:", internalEmailResult);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Auftragsbestätigung gesendet",
        customerEmail: customerEmailResult,
        internalEmail: internalEmailResult
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
    
  } catch (error: any) {
    console.error("Error in accept-offer function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);