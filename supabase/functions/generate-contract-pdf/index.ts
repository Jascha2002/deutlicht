import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// HTML escape function
function escapeHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Company Information - Zentrale CI
const COMPANY_INFO = {
  name: 'Stadtnetz UG / DeutLicht',
  shortName: 'DeutLicht',
  address: {
    street: 'Gemeindeweg 4',
    postalCode: '07546',
    city: 'Gera',
    country: 'Deutschland',
  },
  legal: {
    fullName: 'Stadtnetz UG (haftungsbeschränkt)',
    tradingAs: 'handelnd unter der Marke DeutLicht®',
    addressLine1: 'Gemeindeweg 4 (Mäuseturm)',
    addressLine2: '07546 Gera (Deutschland)',
    taxNumber: '161/120/05343',
    commercialRegister: 'HRB 514530',
    court: 'Amtsgericht Jena',
  },
  contact: {
    email: 'info@deutlicht.de',
    phone: '+49 178-5549216',
    website: 'www.deutlicht.de',
  },
};

// Logo als Base64 (DeutLicht Logo - wird dynamisch geladen falls vorhanden)
const LOGO_PLACEHOLDER = `
<svg width="180" height="50" viewBox="0 0 180 50" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="50" fill="#2d3e50" rx="5"/>
  <text x="90" y="30" text-anchor="middle" fill="#d4a84b" font-family="Arial, sans-serif" font-size="18" font-weight="bold">DeutLicht®</text>
</svg>`;

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function generateContractHtml(data: {
  partnerNumber: string;
  companyName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  legalForm: string;
  taxId: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  commissionRate: number;
  contractContent?: string;
  logoBase64?: string;
}): string {
  const today = new Date();
  const contractDate = formatDate(today);
  
  // Escape all user inputs
  const companyName = escapeHtml(data.companyName);
  const street = escapeHtml(data.street);
  const postalCode = escapeHtml(data.postalCode);
  const city = escapeHtml(data.city);
  const country = escapeHtml(data.country) || 'Deutschland';
  const legalForm = escapeHtml(data.legalForm);
  const taxId = escapeHtml(data.taxId) || 'Nicht angegeben';
  const contactFirstName = escapeHtml(data.contactFirstName);
  const contactLastName = escapeHtml(data.contactLastName);
  const contactEmail = escapeHtml(data.contactEmail);
  const partnerNumber = escapeHtml(data.partnerNumber) || 'Wird generiert';
  const commissionRate = data.commissionRate || 15;

  // Use provided logo or placeholder
  const logoHtml = data.logoBase64 
    ? `<img src="${data.logoBase64}" alt="DeutLicht Logo" style="max-height: 60px; width: auto;" />`
    : LOGO_PLACEHOLDER;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Partnervertrag - ${companyName}</title>
  <style>
    @page { 
      size: A4; 
      margin: 20mm 20mm 30mm 20mm;
    }
    @media print { 
      .page { page-break-after: always; } 
      .page:last-child { page-break-after: auto; }
      .footer { position: fixed; bottom: 0; left: 0; right: 0; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      color: #0f172a; 
      line-height: 1.6; 
      background: white; 
      font-size: 11pt;
    }
    .page { 
      width: 210mm; 
      min-height: 297mm; 
      padding: 20mm; 
      position: relative; 
      background: white;
    }
    
    /* Header with Logo */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #2d3e50;
    }
    .header-logo {
      flex-shrink: 0;
    }
    .header-info {
      text-align: right;
      font-size: 9pt;
      color: #64748b;
    }
    .header-info strong {
      color: #2d3e50;
      display: block;
      font-size: 10pt;
    }
    
    /* Title */
    .contract-title {
      text-align: center;
      font-size: 24pt;
      font-weight: 700;
      color: #2d3e50;
      margin: 40px 0 30px;
      letter-spacing: 2px;
    }
    
    /* Parties */
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin: 30px 0;
    }
    .party {
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #d4a84b;
    }
    .party-label {
      font-size: 9pt;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    .party-name {
      font-size: 14pt;
      font-weight: 600;
      color: #2d3e50;
      margin-bottom: 8px;
    }
    .party-details {
      font-size: 10pt;
      color: #334155;
      line-height: 1.5;
    }
    
    /* Sections */
    .section {
      margin: 25px 0;
    }
    .section-title {
      font-size: 12pt;
      font-weight: 700;
      color: #2d3e50;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .section-content {
      font-size: 10.5pt;
      color: #334155;
    }
    .section-content p {
      margin-bottom: 10px;
    }
    
    /* Highlight Box */
    .commission-box {
      background: linear-gradient(135deg, #2d3e50 0%, #1e293b 100%);
      color: white;
      padding: 20px 25px;
      border-radius: 10px;
      margin: 25px 0;
      text-align: center;
    }
    .commission-box .label {
      font-size: 10pt;
      opacity: 0.8;
      margin-bottom: 5px;
    }
    .commission-box .rate {
      font-size: 32pt;
      font-weight: 700;
      color: #d4a84b;
    }
    .commission-box .suffix {
      font-size: 14pt;
      opacity: 0.9;
    }
    
    /* Signatures */
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      margin-top: 60px;
      padding-top: 30px;
    }
    .signature {
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #334155;
      padding-top: 10px;
      margin-top: 60px;
      font-size: 10pt;
      color: #64748b;
    }
    
    /* Footer */
    .footer {
      position: absolute;
      bottom: 15mm;
      left: 20mm;
      right: 20mm;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #64748b;
      text-align: center;
      line-height: 1.4;
    }
    .footer-line {
      display: block;
    }
    
    /* Meta Info */
    .meta-info {
      margin-top: 40px;
      padding: 15px;
      background: #f8fafc;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      color: #64748b;
    }
    .meta-info strong {
      color: #2d3e50;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header with Logo -->
    <div class="header">
      <div class="header-logo">
        ${logoHtml}
      </div>
      <div class="header-info">
        <strong>${COMPANY_INFO.name}</strong>
        ${COMPANY_INFO.address.street}<br>
        ${COMPANY_INFO.address.postalCode} ${COMPANY_INFO.address.city}<br>
        ${COMPANY_INFO.address.country}
      </div>
    </div>
    
    <!-- Title -->
    <h1 class="contract-title">PARTNERVERTRAG</h1>
    
    <!-- Parties -->
    <div class="parties">
      <div class="party">
        <div class="party-label">Auftraggeber</div>
        <div class="party-name">${COMPANY_INFO.name}</div>
        <div class="party-details">
          ${COMPANY_INFO.address.street}<br>
          ${COMPANY_INFO.address.postalCode} ${COMPANY_INFO.address.city}<br>
          ${COMPANY_INFO.address.country}
        </div>
      </div>
      <div class="party">
        <div class="party-label">Partner</div>
        <div class="party-name">${companyName}</div>
        <div class="party-details">
          ${street}<br>
          ${postalCode} ${city}<br>
          ${country}<br>
          ${legalForm ? `<br>${legalForm}` : ''}
          ${taxId !== 'Nicht angegeben' ? `<br>USt-ID: ${taxId}` : ''}
        </div>
      </div>
    </div>
    
    <!-- Contact -->
    <div class="section">
      <div class="section-title">Ansprechpartner beim Partner</div>
      <div class="section-content">
        <p><strong>${contactFirstName} ${contactLastName}</strong><br>E-Mail: ${contactEmail}</p>
      </div>
    </div>
    
    <!-- Commission Highlight -->
    <div class="commission-box">
      <div class="label">Vereinbarter Provisionssatz (Netto)</div>
      <div class="rate">${commissionRate}<span class="suffix">%</span></div>
    </div>
    
    <!-- Contract Sections -->
    <div class="section">
      <div class="section-title">§ 1 Vertragsgegenstand</div>
      <div class="section-content">
        <p>(1) Der Partner vermittelt dem Auftraggeber Neukunden für dessen Dienstleistungen im Bereich Digitalisierung, KI-Lösungen, Websites und Marketing.</p>
        <p>(2) Der Partner erhält für erfolgreiche Vermittlungen eine Provision gemäß § 3 dieses Vertrages.</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">§ 2 Pflichten des Partners</div>
      <div class="section-content">
        <p>(1) Der Partner verpflichtet sich, die Interessen des Auftraggebers zu wahren und potenzielle Kunden professionell zu beraten.</p>
        <p>(2) Der Partner darf keine falschen oder irreführenden Aussagen über die Produkte und Dienstleistungen des Auftraggebers machen.</p>
        <p>(3) Der Partner stellt sicher, dass er ausschließlich im B2B-Bereich tätig ist und nur gewerbliche Kunden vermittelt.</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">§ 3 Provisionen</div>
      <div class="section-content">
        <p>(1) Der Partner erhält eine Provision in Höhe von <strong>${commissionRate}%</strong> auf den Nettoumsatz vermittelter Aufträge.</p>
        <p>(2) Die Provision wird ausschließlich auf Basis der Nettoumsätze berechnet. Umsatzsteuer wird nicht provisioniert.</p>
        <p>(3) Die Provision ist fällig nach vollständiger Bezahlung des vermittelten Auftrags durch den Endkunden.</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">§ 4 Abrechnung</div>
      <div class="section-content">
        <p>(1) Der Partner erstellt monatlich eine Rechnung über seine Provisionsansprüche.</p>
        <p>(2) Die Rechnung muss alle relevanten Angaben enthalten (Rechnungsnummer, Leistungszeitraum, vermittelte Kunden, Provisionsbeträge).</p>
        <p>(3) Nach Prüfung und Freigabe durch den Auftraggeber erfolgt die Auszahlung innerhalb von 14 Tagen.</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">§ 5 Vertraulichkeit</div>
      <div class="section-content">
        <p>(1) Beide Parteien verpflichten sich, alle im Rahmen dieser Zusammenarbeit erhaltenen vertraulichen Informationen geheim zu halten.</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">§ 6 Laufzeit und Kündigung</div>
      <div class="section-content">
        <p>(1) Dieser Vertrag wird auf unbestimmte Zeit geschlossen.</p>
        <p>(2) Er kann von beiden Seiten mit einer Frist von 4 Wochen zum Monatsende gekündigt werden.</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">§ 7 Schlussbestimmungen</div>
      <div class="section-content">
        <p>(1) Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.</p>
        <p>(2) Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.</p>
        <p>(3) Es gilt deutsches Recht.</p>
      </div>
    </div>
    
    <!-- Signatures -->
    <div class="signatures">
      <div class="signature">
        <div class="signature-line">Ort, Datum, Unterschrift Auftraggeber</div>
      </div>
      <div class="signature">
        <div class="signature-line">Ort, Datum, Unterschrift Partner</div>
      </div>
    </div>
    
    <!-- Meta Info -->
    <div class="meta-info">
      <span><strong>Partner-Nr.:</strong> ${partnerNumber}</span>
      <span><strong>Vertragsdatum:</strong> ${contractDate}</span>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <span class="footer-line">${COMPANY_INFO.legal.fullName} | ${COMPANY_INFO.legal.tradingAs}</span>
      <span class="footer-line">${COMPANY_INFO.legal.addressLine1} | ${COMPANY_INFO.legal.addressLine2}</span>
      <span class="footer-line">Steuernummer: ${COMPANY_INFO.legal.taxNumber} | ${COMPANY_INFO.legal.commercialRegister}, ${COMPANY_INFO.legal.court}</span>
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    console.log("Generating contract PDF for:", data.companyName);

    const html = generateContractHtml(data);

    return new Response(
      JSON.stringify({ html, success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Contract PDF generation error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, success: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
