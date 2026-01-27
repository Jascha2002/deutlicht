import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContractEmailData {
  partnerId: string;
  partnerEmail: string;
  partnerName: string;
  companyName: string;
  partnerNumber: string | null;
  contractContent: string;
  commissionRate: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send partner contract request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContractEmailData = await req.json();
    console.log("Contract data for:", data.companyName);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const today = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // HTML Email for partner
    const partnerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">DeutLicht Partnervertrag</h1>
    </div>
    
    <div style="padding: 30px;">
      <h2 style="color: #1a1a2e; margin-top: 0;">Ihr Partnervertrag ist bereit!</h2>
      
      <p style="color: #333; line-height: 1.6;">
        Sehr geehrte(r) ${data.partnerName},
      </p>
      
      <p style="color: #333; line-height: 1.6;">
        vielen Dank für Ihr Interesse an einer Partnerschaft mit DeutLicht. Nach Prüfung Ihrer Unterlagen freuen wir uns, Ihnen hiermit den Partnervertrag zu übersenden.
      </p>
      
      <div style="background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1a1a2e; margin-top: 0; font-size: 16px;">Vertragsdaten:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 40%;">Partner-Nr.:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.partnerNumber || 'Wird zugewiesen'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Unternehmen:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Provisionssatz:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.commissionRate}% (auf Nettoumsatz)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Vertragsdatum:</td>
            <td style="padding: 8px 0; color: #333; font-weight: 500;">${today}</td>
          </tr>
        </table>
      </div>

      <div style="background: #e8f4f8; border: 1px solid #0288d1; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="color: #01579b; margin: 0; font-size: 14px;">
          <strong>Nächste Schritte:</strong><br>
          1. Lesen Sie den beigefügten Vertrag sorgfältig durch<br>
          2. Unterschreiben Sie beide Ausfertigungen<br>
          3. Senden Sie eine unterschriebene Ausfertigung an uns zurück<br>
          4. Nach Eingang erhalten Sie Ihren Partner-Zugang
        </p>
      </div>

      <div style="background: #fff3e0; border: 1px solid #ff9800; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="color: #e65100; margin: 0; font-size: 14px;">
          <strong>B2B-Hinweis:</strong> Das DeutLicht Partner-Programm richtet sich ausschließlich an Gewerbetreibende. 
          Provisionen werden auf Basis der Nettoumsätze berechnet – die Umsatzsteuer wird nicht provisioniert.
        </p>
      </div>

      <h3 style="color: #1a1a2e; font-size: 16px;">Vertragsinhalt:</h3>
      <div style="background: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5; white-space: pre-wrap; max-height: 400px; overflow: auto;">
${data.contractContent}
      </div>
      
      <p style="color: #333; line-height: 1.6; margin-top: 30px;">
        Bei Fragen stehen wir Ihnen gerne zur Verfügung:<br>
        📧 <a href="mailto:partner@deutlicht.de" style="color: #0066cc;">partner@deutlicht.de</a><br>
        📞 +49 178 55 49 216
      </p>
      
      <p style="color: #333; line-height: 1.6; margin-top: 30px;">
        Mit freundlichen Grüßen,<br>
        <strong>Ihr DeutLicht Partner-Team</strong>
      </p>
    </div>
    
    <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #eee; font-size: 11px; color: #666;">
      <p style="margin: 0;">
        Stadtnetz UG (haftungsbeschränkt) | handelnd unter der Marke DeutLicht®<br>
        Gemeindeweg 4 (Mäuseturm) | 07546 Gera (Deutschland)<br>
        Steuernummer: 161/120/05343 | HRB 514530, Amtsgericht Jena<br>
        <a href="mailto:info@deutlicht.de" style="color: #666;">info@deutlicht.de</a> | www.deutlicht.de
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Plain text version
    const partnerEmailText = `
Ihr DeutLicht Partnervertrag

Sehr geehrte(r) ${data.partnerName},

vielen Dank für Ihr Interesse an einer Partnerschaft mit DeutLicht. Nach Prüfung Ihrer Unterlagen freuen wir uns, Ihnen hiermit den Partnervertrag zu übersenden.

Vertragsdaten:
- Partner-Nr.: ${data.partnerNumber || 'Wird zugewiesen'}
- Unternehmen: ${data.companyName}
- Provisionssatz: ${data.commissionRate}% (auf Nettoumsatz)
- Vertragsdatum: ${today}

Nächste Schritte:
1. Lesen Sie den beigefügten Vertrag sorgfältig durch
2. Unterschreiben Sie beide Ausfertigungen
3. Senden Sie eine unterschriebene Ausfertigung an uns zurück
4. Nach Eingang erhalten Sie Ihren Partner-Zugang

B2B-Hinweis: Das DeutLicht Partner-Programm richtet sich ausschließlich an Gewerbetreibende.
Provisionen werden auf Basis der Nettoumsätze berechnet – die Umsatzsteuer wird nicht provisioniert.

──────────────────────────────────────────────────────────
VERTRAGSINHALT:
──────────────────────────────────────────────────────────

${data.contractContent}

──────────────────────────────────────────────────────────

Bei Fragen erreichen Sie uns unter:
📧 partner@deutlicht.de
📞 +49 178 55 49 216

Mit freundlichen Grüßen,
Ihr DeutLicht Partner-Team

--
Stadtnetz UG (haftungsbeschränkt) | handelnd unter der Marke DeutLicht®
Gemeindeweg 4 (Mäuseturm) | 07546 Gera (Deutschland)
St.-Nr.: 161/120/05343 | HRB 514530, Amtsgericht Jena
    `.trim();

    // Send email to partner
    console.log("Sending contract to partner:", data.partnerEmail);
    const partnerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DeutLicht Partner <partner@deutlicht.de>",
        to: [data.partnerEmail],
        subject: `Ihr DeutLicht Partnervertrag – ${data.companyName}`,
        html: partnerEmailHtml,
        text: partnerEmailText,
      }),
    });

    const partnerResult = await partnerResponse.json();
    console.log("Partner email result:", partnerResult);

    if (!partnerResponse.ok) {
      console.error("Failed to send partner email:", partnerResult);
      throw new Error(partnerResult.message || "Failed to send partner email");
    }

    // Send internal notification to DeutLicht
    const internalEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h2 style="color: #1a1a2e;">📄 Partnervertrag versendet</h2>
  
  <p>Ein Partnervertrag wurde soeben versendet:</p>
  
  <table style="border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Partner:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${data.companyName}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Partner-Nr.:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${data.partnerNumber || 'Wird generiert'}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>E-Mail:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.partnerEmail}">${data.partnerEmail}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Ansprechpartner:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${data.partnerName}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Provision:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${data.commissionRate}% (Netto)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Datum:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${today}</td>
    </tr>
  </table>
  
  <p style="color: #666; font-size: 12px;">
    Nächster Schritt: Warten auf unterschriebenen Vertrag vom Partner.
  </p>
</body>
</html>
    `.trim();

    console.log("Sending internal notification...");
    const internalResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DeutLicht System <noreply@deutlicht.de>",
        to: ["info@deutlicht.de", "carstenvds@gmail.com"],
        subject: `[Partner] Vertrag versendet: ${data.companyName}`,
        html: internalEmailHtml,
      }),
    });

    const internalResult = await internalResponse.json();
    console.log("Internal email result:", internalResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Vertrag erfolgreich versendet",
        partnerEmailId: partnerResult.id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Contract send error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
