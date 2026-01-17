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

// ==================== PRICING DATA ====================

const branchenPakete = [
  { id: "handwerk", branche: "Handwerk", botName: "HandwerksBot", einmalpreis: 1990, monatspreis: 179, umsetzungWochen: 4, highlight: "70% weniger Telefonate" },
  { id: "kanzlei", branche: "Kanzlei & Beratung", botName: "KanzleiBot", einmalpreis: 2990, monatspreis: 249, umsetzungWochen: 4, highlight: "Mandantenqualifizierung" },
  { id: "ecommerce", branche: "E-Commerce", botName: "ShopBot", einmalpreis: 4990, monatspreis: 399, umsetzungWochen: 6, highlight: "24/7 Kundenservice" },
  { id: "produktion", branche: "Maschinenbau & Industrie", botName: "ProdBot", einmalpreis: 3490, monatspreis: 299, umsetzungWochen: 6, highlight: "50% kürzere Angebotsphasen" },
  { id: "gesundheit", branche: "Gesundheit & Pflege", botName: "CareBot", einmalpreis: 2490, monatspreis: 199, umsetzungWochen: 5, highlight: "Pflegekräfte entlastet" },
  { id: "bildung", branche: "Bildung & Weiterbildung", botName: "LernBot", einmalpreis: 2790, monatspreis: 249, umsetzungWochen: 4, highlight: "Förderfähigkeits-Check" },
  { id: "gastronomie", branche: "Gastronomie & Hotellerie", botName: "GastroBot", einmalpreis: 2490, monatspreis: 199, umsetzungWochen: 4, highlight: "+30% Umsatz" },
  { id: "verwaltung", branche: "Öffentliche Verwaltung", botName: "BürgerBot", einmalpreis: 3990, monatspreis: 299, umsetzungWochen: 6, highlight: "80% Routineanfragen automatisiert" },
  { id: "immobilien", branche: "Immobilien", botName: "ImmoBot", einmalpreis: 3490, monatspreis: 279, umsetzungWochen: 5, highlight: "Lead-Qualifizierung" },
  { id: "standard", branche: "Sonstiges", botName: "BranchenBot", einmalpreis: 2490, monatspreis: 199, umsetzungWochen: 4, highlight: "Flexibel anpassbar" }
];

const websitePreise = {
  onepager: { min: 1200, max: 2200, avg: 1800 },
  "5-seiten": { min: 1900, max: 3800, avg: 3500, perPage: 340 },
  webshop_starter: { min: 3500, max: 5500, avg: 4500 }
};

const voicebotPreise = {
  weiterleitung: 3500,
  qualifizierung: 6000,
  vollauto: 9500
};

const hostingPakete = [
  { id: "onepager", name: "Onepager", basis: 12, service: 39, total: 51, jahr: 561 },
  { id: "5-seiten", name: "5-Seiten", basis: 22, service: 42, total: 64, jahr: 704 },
  { id: "webshop", name: "Webshop", basis: 79, service: 59, total: 138, jahr: 1518 }
];

const companySizeFactors: Record<string, number> = {
  "1-10": 1.0, "11-50": 1.3, "51-250": 1.6, ">250": 2.2
};

const industryMapping: Record<string, string> = {
  "Handwerk": "handwerk", "Einzelhandel": "ecommerce", "Gastronomie & Hotellerie": "gastronomie",
  "Gesundheitswesen": "gesundheit", "IT & Technologie": "standard", "Beratung & Dienstleistung": "kanzlei",
  "Produktion & Industrie": "produktion", "Immobilien": "immobilien", "Bildung & Schulung": "bildung",
  "Öffentliche Verwaltung / Kommune": "verwaltung", "Vereine & Verbände": "standard", "Sonstiges": "standard",
  "Kanzlei": "kanzlei", "ECommerce": "ecommerce", "Industrie": "produktion", "Kommunen": "verwaltung",
  "Gesundheit": "gesundheit", "Bildung": "bildung"
};

function getPaket(industry: string) {
  const paketId = industryMapping[industry] || "standard";
  return branchenPakete.find(p => p.id === paketId) || branchenPakete.find(p => p.id === "standard")!;
}

function getHostingPaket(services: string[], pages?: number) {
  if (services.some(s => s.toLowerCase().includes('webshop'))) return hostingPakete[2];
  if (pages && pages > 1) return hostingPakete[1];
  return hostingPakete[0];
}

function berechneMonateBisStart(projectStart: string): { months: number; factor: number; label: string } {
  if (!projectStart) return { months: 3, factor: 1.0, label: "1-3 Monate Vorlauf" };
  if (projectStart === 'sofort') return { months: 0, factor: 1.2, label: "Sofortstart" };
  if (projectStart === '1-3-monate') return { months: 2, factor: 1.0, label: "1-3 Monate Vorlauf" };
  if (projectStart === '3-6-monate') return { months: 4, factor: 0.9, label: "3-6 Monate Vorlauf" };
  if (projectStart === 'offen') return { months: 3, factor: 1.0, label: "Flexibel" };
  
  const startDate = new Date(projectStart);
  const today = new Date();
  const diffMonths = (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (diffMonths < 0.5) return { months: 0, factor: 1.4, label: "Express (unter 2 Wochen)" };
  if (diffMonths < 1) return { months: 1, factor: 1.2, label: "Weniger als 1 Monat" };
  if (diffMonths < 3) return { months: Math.round(diffMonths), factor: 1.0, label: "1-3 Monate Vorlauf" };
  if (diffMonths < 6) return { months: Math.round(diffMonths), factor: 0.9, label: "3-6 Monate Vorlauf" };
  return { months: Math.round(diffMonths), factor: 0.85, label: "Mehr als 6 Monate Vorlauf" };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ==================== PDF GENERATION ====================

function generateOfferHtml(data: any): string {
  // Escape all user inputs
  const company = escapeHtml(data.company_name) || "Ihr Unternehmen";
  const contact = escapeHtml(data.contact_person) || "Ansprechpartner";
  const industry = escapeHtml(data.industry) || "Sonstiges";
  const email = escapeHtml(data.email) || "";
  const phone = escapeHtml(data.phone) || "";
  const challenge = escapeHtml(data.main_challenge) || "Digitale Optimierung";
  const projectGoal = escapeHtml(data.project_goals?.join(", ") || data.project_goal) || "Digitalisierung";
  const companySize = data.company_size || "1-10";
  const projectStart = data.project_start || "1-3-monate";
  const services = Array.isArray(data.services_needed) ? data.services_needed : [];
  // WICHTIG: services_selected wird für die tatsächliche Leistungsmodulauswahl verwendet
  const servicesSelected = Array.isArray(data.services_selected) ? data.services_selected : [];
  const pagesNeeded = data.pages_needed || 5;

  // Get pricing data - Paket wird nur für die Referenz geladen, NICHT automatisch berechnet
  const paket = getPaket(industry);
  const sizeFactor = companySizeFactors[companySize] || 1.0;
  const timeInfo = berechneMonateBisStart(projectStart);
  const timeFactor = timeInfo.factor;
  const hosting = getHostingPaket(services.length > 0 ? services : servicesSelected, pagesNeeded);

  // WICHTIG: Prüfen ob KI-Branchenlösung EXPLIZIT ausgewählt wurde
  const kiSelected = servicesSelected.some((s: string) => 
    s.toLowerCase().includes('ki-agenten') || 
    s.toLowerCase().includes('ki-branchenl') ||
    s.toLowerCase().includes('automation')
  ) || services.some((s: string) => 
    s.toLowerCase().includes('ki-agenten') || 
    s.toLowerCase().includes('ki-branchenl') ||
    s.toLowerCase().includes('automation')
  );

  // Calculate website costs - NUR wenn Website explizit ausgewählt
  let websiteKosten = 0;
  let websiteLabel = "";
  const websiteSelected = servicesSelected.some((s: string) => 
    s.toLowerCase().includes('website') || s.toLowerCase().includes('digitale plattform')
  ) || services.some((s: string) => s.toLowerCase().includes('website'));
  
  if (websiteSelected) {
    if (pagesNeeded <= 1) {
      websiteKosten = websitePreise.onepager.avg;
      websiteLabel = "Onepager/Starter";
    } else {
      websiteKosten = websitePreise["5-seiten"].avg + Math.max(0, (pagesNeeded - 5) * websitePreise["5-seiten"].perPage);
      websiteLabel = `${pagesNeeded} Seiten Website`;
    }
  }
  const webshopSelected = servicesSelected.some((s: string) => s.toLowerCase().includes('webshop')) || 
    services.some((s: string) => s.toLowerCase().includes('webshop'));
  if (webshopSelected) {
    websiteKosten = websitePreise.webshop_starter.avg;
    websiteLabel = "Webshop Starter";
  }

  // Calculate voicebot costs - NUR wenn Voicebot explizit ausgewählt
  let voicebotKosten = 0;
  const voicebotSelected = servicesSelected.some((s: string) => 
    s.toLowerCase().includes('voicebot') || s.toLowerCase().includes('sprachassistenz')
  ) || services.some((s: string) => 
    s.toLowerCase().includes('voicebot') || s.toLowerCase().includes('sprachassistenz')
  );
  if (voicebotSelected) {
    voicebotKosten = voicebotPreise.qualifizierung;
  }

  // KORRIGIERTE BERECHNUNG: BranchenBot NUR wenn KI explizit ausgewählt wurde
  const branchenBotEinmalpreis = kiSelected ? paket.einmalpreis : 0;
  const branchenBotMonatspreis = kiSelected ? paket.monatspreis : 0;

  // Total calculations - Branchenlösung wird NUR berechnet wenn explizit ausgewählt
  const basispreis = branchenBotEinmalpreis + websiteKosten + voicebotKosten;
  const einmalpreis = Math.round(basispreis * sizeFactor * timeFactor);
  const monatspreis = Math.round(branchenBotMonatspreis * sizeFactor);
  
  // Hosting nur wenn Website/Shop ausgewählt, sonst 0
  const hostingMonatlich = (websiteSelected || webshopSelected) ? hosting.total : 0;
  const gesamtMonatlich = monatspreis + hostingMonatlich;

  // Dates
  const today = new Date();
  const offerDate = formatDate(today);
  const validUntil = formatDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000));
  const nextMeeting = formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000));
  
  let projectStartDate = new Date();
  if (projectStart === 'sofort') projectStartDate.setDate(projectStartDate.getDate() + 7);
  else if (projectStart === '1-3-monate') projectStartDate.setMonth(projectStartDate.getMonth() + 1);
  else if (projectStart === '3-6-monate') projectStartDate.setMonth(projectStartDate.getMonth() + 3);
  else if (projectStart && !isNaN(Date.parse(projectStart))) projectStartDate = new Date(projectStart);
  else projectStartDate.setMonth(projectStartDate.getMonth() + 1);
  
  const projectEndDate = new Date(projectStartDate);
  projectEndDate.setDate(projectEndDate.getDate() + paket.umsetzungWochen * 7);

  const offerNumber = `DL-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

  // Generate service-specific content - kombiniere services und servicesSelected
  const allSelectedServices = [...new Set([...services, ...servicesSelected])];
  
  const serviceBlocks = allSelectedServices.map((service: string) => {
    if (service.toLowerCase().includes('website') || service.toLowerCase().includes('webshop') || service.toLowerCase().includes('digitale plattform')) {
      return `
        <div class="service-block">
          <h4>🌐 Website & Digitale Plattformen</h4>
          <ul>
            <li>Onepager/Starter: 1.200–2.200€</li>
            <li>5 Seiten: 1.900–3.800€ (+340€/Seite)</li>
            <li>Webshop Starter: 3.500–5.500€</li>
          </ul>
          ${industry === 'Handwerk' ? '<p class="highlight">→ Perfekt für Handwerksbetriebe</p>' : ''}
        </div>`;
    }
    // KI-Agenten NUR wenn explizit ausgewählt
    if ((service.toLowerCase().includes('ki-agenten') || service.toLowerCase().includes('automation') || service.toLowerCase().includes('ki-branchenl')) && kiSelected) {
      return `
        <div class="service-block">
          <h4>🤖 KI-Agenten für ${escapeHtml(industry)}</h4>
          <ul>
            <li>Handwerk: HandwerksBot (1.990€ + 179€/Monat) – 70% weniger Telefonate</li>
            <li>Kanzlei: KanzleiBot (2.990€ + 249€/Monat)</li>
            <li>E-Commerce: ShopBot (4.990€ + 399€/Monat)</li>
          </ul>
          <p class="highlight">→ Ihr Paket: DeutLicht ${paket.botName}</p>
        </div>`;
    }
    if (service.toLowerCase().includes('voicebot') || service.toLowerCase().includes('sprachassistenz')) {
      return `
        <div class="service-block">
          <h4>🎙️ Voicebots / Sprachassistenz</h4>
          <ul>
            <li>Weiterleitung: 3.500€</li>
            <li>Qualifizierung: 6.000€</li>
            <li>Vollauto: 9.500€</li>
          </ul>
        </div>`;
    }
    if (service.toLowerCase().includes('social media') || service.toLowerCase().includes('marketing')) {
      return `
        <div class="service-block">
          <h4>📱 Marketing & Social Media</h4>
          <p>Content-Erstellung, Kampagnenmanagement und Community Building</p>
        </div>`;
    }
    if (service.toLowerCase().includes('seo') || service.toLowerCase().includes('sichtbarkeit')) {
      return `
        <div class="service-block">
          <h4>🔍 SEO & Sichtbarkeit</h4>
          <p>Suchmaschinenoptimierung für bessere Rankings</p>
        </div>`;
    }
    if (service.toLowerCase().includes('beratung') || service.toLowerCase().includes('schulung')) {
      return `
        <div class="service-block">
          <h4>📚 Beratung & Schulung</h4>
          <p>Individuelle Workshops und Trainings</p>
        </div>`;
    }
    if (service.toLowerCase().includes('prozess')) {
      return `
        <div class="service-block">
          <h4>⚙️ Prozessoptimierung</h4>
          <p>Digitale Workflow-Analyse und Optimierung</p>
        </div>`;
    }
    return '';
  }).filter(Boolean).join('');

  // ==================== HTML TEMPLATE ====================
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Angebot für ${company} | DeutLicht</title>
  <style>
    @page { size: A4; margin: 0; }
    @media print { .page { page-break-after: always; } .page:last-child { page-break-after: auto; } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.6; background: white; font-size: 11pt; }
    .page { width: 210mm; min-height: 297mm; padding: 15mm 20mm; position: relative; background: white; }
    
    /* Brand Colors */
    :root { --primary: #0066FF; --accent: #FFD700; --dark: #0f172a; --gray: #64748b; --light: #f8fafc; --success: #10b981; }
    
    /* COVER PAGE */
    .cover { background: linear-gradient(135deg, var(--dark) 0%, #1e293b 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
    .cover-badge { background: var(--accent); color: var(--dark); padding: 8px 24px; border-radius: 50px; font-weight: 600; font-size: 13pt; margin-bottom: 40px; }
    .cover h1 { font-size: 14pt; text-transform: uppercase; letter-spacing: 4px; opacity: 0.7; margin-bottom: 15px; font-weight: 400; }
    .cover h2 { font-size: 36pt; font-weight: 700; color: var(--accent); margin-bottom: 10px; }
    .cover h3 { font-size: 18pt; font-weight: 400; opacity: 0.9; margin-bottom: 50px; }
    .cover-package { background: rgba(255,255,255,0.1); padding: 20px 40px; border-radius: 12px; margin-top: 30px; }
    .cover-package span { font-size: 16pt; font-weight: 600; }
    .cover-meta { position: absolute; bottom: 25mm; left: 0; right: 0; text-align: center; font-size: 10pt; opacity: 0.6; }
    .cover-meta p { margin: 5px 0; }
    
    /* STANDARD PAGES */
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 12px; border-bottom: 2px solid var(--primary); }
    .page-header .brand { font-weight: 700; font-size: 14pt; color: var(--dark); }
    .page-header .page-num { font-size: 10pt; color: var(--gray); }
    
    h2 { font-size: 18pt; color: var(--dark); margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
    h2::before { content: ''; width: 4px; height: 24px; background: var(--accent); border-radius: 2px; }
    h3 { font-size: 13pt; color: var(--dark); margin: 20px 0 12px; font-weight: 600; }
    h4 { font-size: 11pt; color: var(--primary); margin: 15px 0 8px; font-weight: 600; }
    p { margin-bottom: 12px; color: #334155; font-size: 10.5pt; }
    
    /* CARDS */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 18px 0; }
    .info-card { background: var(--light); padding: 15px; border-radius: 8px; border-left: 3px solid var(--primary); }
    .info-card label { font-size: 9pt; text-transform: uppercase; color: var(--gray); display: block; margin-bottom: 3px; letter-spacing: 0.5px; }
    .info-card .value { font-size: 13pt; font-weight: 600; color: var(--dark); }
    
    .highlight-box { background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .highlight-box h3 { color: white; margin-top: 0; font-size: 12pt; }
    .highlight-box p { color: rgba(255,255,255,0.95); margin: 0; }
    
    .accent-box { background: var(--accent); color: var(--dark); padding: 20px; border-radius: 10px; margin: 20px 0; }
    .accent-box h3 { color: var(--dark); margin-top: 0; font-size: 12pt; }
    .accent-box p { color: var(--dark); margin: 0; }
    
    /* SERVICE BLOCKS */
    .service-block { background: var(--light); padding: 15px; border-radius: 8px; margin: 12px 0; }
    .service-block h4 { margin-top: 0; color: var(--dark); }
    .service-block ul { padding-left: 20px; margin: 8px 0; }
    .service-block li { margin: 5px 0; font-size: 10pt; }
    .service-block .highlight { color: var(--primary); font-weight: 600; margin: 8px 0 0; font-size: 10pt; }
    
    /* TIMELINE */
    .timeline { position: relative; padding-left: 35px; margin: 20px 0; }
    .timeline::before { content: ''; position: absolute; left: 12px; top: 5px; bottom: 5px; width: 2px; background: var(--primary); }
    .timeline-item { position: relative; margin-bottom: 20px; }
    .timeline-item::before { content: ''; position: absolute; left: -30px; top: 3px; width: 14px; height: 14px; background: var(--accent); border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px var(--primary); }
    .timeline-item h4 { font-size: 11pt; color: var(--dark); margin-bottom: 4px; font-weight: 600; }
    .timeline-item p { font-size: 10pt; color: var(--gray); margin: 0; }
    
    /* PRICE TABLE */
    .price-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10pt; }
    .price-table th, .price-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .price-table th { background: var(--light); font-weight: 600; color: var(--dark); }
    .price-table .price { text-align: right; font-weight: 600; color: var(--primary); }
    .price-table .total { background: var(--dark); color: white; font-weight: 700; }
    .price-table .total .price { color: var(--accent); }
    .price-table .subtotal { background: var(--light); font-weight: 600; }
    
    /* FEATURES */
    .feature-list { list-style: none; padding: 0; margin: 15px 0; }
    .feature-list li { padding: 8px 0 8px 25px; position: relative; border-bottom: 1px solid #f1f5f9; font-size: 10pt; }
    .feature-list li::before { content: '✓'; position: absolute; left: 0; color: var(--success); font-weight: bold; }
    
    /* CTA */
    .cta-box { background: var(--accent); color: var(--dark); padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0; }
    .cta-box h3 { margin-top: 0; font-size: 14pt; }
    .cta-box .phone { font-size: 18pt; font-weight: 700; margin: 10px 0; }
    
    /* CONTACT */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .contact-card { background: white; padding: 18px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .contact-card h4 { margin-top: 0; font-size: 11pt; color: var(--dark); border-bottom: 2px solid var(--accent); padding-bottom: 8px; margin-bottom: 10px; }
    .contact-card p { margin: 5px 0; font-size: 10pt; }
    
    /* FOOTER */
    .footer { position: absolute; bottom: 12mm; left: 20mm; right: 20mm; text-align: center; font-size: 8pt; color: var(--gray); padding-top: 10px; border-top: 1px solid #e2e8f0; }
    
    /* CALCULATION BOX */
    .calc-box { background: var(--light); padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 10pt; }
    .calc-box code { font-family: 'Consolas', monospace; background: white; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover">
  <div class="cover-badge">DeutLicht® Angebot</div>
  <h1>DIGITALE KLARHEIT FÜR</h1>
  <h2>${company}</h2>
  <h3>Individuelles Lösungskonzept aus Ihrer Projektanfrage</h3>
  <div class="cover-package">
    <span>DeutLicht ${paket.botName}</span>
  </div>
  <div class="cover-meta">
    <p>Angebot ${offerDate} | ${offerNumber}</p>
    <p>${contact} | DeutLicht®</p>
  </div>
</div>

<!-- PAGE 2: AUSGANGSLAGE -->
<div class="page">
  <div class="page-header">
    <span class="brand">DeutLicht®</span>
    <span class="page-num">Seite 2 von 6</span>
  </div>
  
  <h2>Ihre Situation – aus der Projektanfrage</h2>
  
  <div class="info-grid">
    <div class="info-card">
      <label>📊 Branche</label>
      <div class="value">${escapeHtml(industry)}</div>
    </div>
    <div class="info-card">
      <label>👥 Unternehmensgröße</label>
      <div class="value">${companySize} Mitarbeitende</div>
    </div>
    <div class="info-card">
      <label>🎯 Ihr Ziel</label>
      <div class="value">${projectGoal}</div>
    </div>
    <div class="info-card">
      <label>⚠️ Herausforderung</label>
      <div class="value">${challenge}</div>
    </div>
  </div>
  
  <div class="highlight-box">
    <h3>📊 Analyse</h3>
    <p>Ihre Projektanfrage zeigt klare Optimierungspotenziale in: <strong>${services.map((s: string) => escapeHtml(s)).join(', ') || 'Digitale Transformation'}</strong>.</p>
  </div>
  
  <h3>Kontaktdaten</h3>
  <div class="info-grid">
    <div class="info-card">
      <label>Ansprechpartner</label>
      <div class="value">${contact}</div>
    </div>
    <div class="info-card">
      <label>Kontakt</label>
      <div class="value">${email}${phone ? '<br>' + phone : ''}</div>
    </div>
  </div>
  
  <div class="footer">Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de</div>
</div>

<!-- PAGE 3: LEISTUNGSMODULE -->
<div class="page">
  <div class="page-header">
    <span class="brand">DeutLicht®</span>
    <span class="page-num">Seite 3 von 6</span>
  </div>
  
  <h2>Ihre Leistungsmodule</h2>
  
  ${serviceBlocks || `
  <div class="service-block">
    <h4>📋 Ihre ausgewählten Leistungen</h4>
    <p>Basierend auf Ihrer Anfrage erstellen wir Ihnen ein individuelles Angebot.</p>
  </div>`}
  
  ${kiSelected ? `
  <h3>Ihr empfohlenes KI-Paket: DeutLicht ${paket.botName}</h3>
  
  <ul class="feature-list">
    <li>Individuelle Konfiguration für ${company}</li>
    <li>Branchenspezifische Antwortvorlagen</li>
    <li>Integration in bestehende Systeme</li>
    <li>24/7 Verfügbarkeit</li>
    <li>Deutschsprachige Konversationen</li>
    <li>Eskalation bei komplexen Anfragen</li>
    <li>Monatliches Reporting & Analytics</li>
    <li>Technischer Support inklusive</li>
  </ul>
  
  <h3>Branchenspezifische Pakete im Überblick</h3>
  <table class="price-table">
    <tr><th>Branche</th><th>Paket</th><th class="price">Einmalig</th><th class="price">Monatlich</th></tr>
    <tr><td>Handwerk</td><td>HandwerksBot</td><td class="price">1.990 €</td><td class="price">179 €</td></tr>
    <tr><td>Kanzlei</td><td>KanzleiBot</td><td class="price">2.990 €</td><td class="price">249 €</td></tr>
    <tr><td>E-Commerce</td><td>ShopBot</td><td class="price">4.990 €</td><td class="price">399 €</td></tr>
    <tr><td>Produktion</td><td>ProdBot</td><td class="price">3.490 €</td><td class="price">299 €</td></tr>
    <tr><td>Gesundheit</td><td>CareBot</td><td class="price">2.490 €</td><td class="price">199 €</td></tr>
    <tr><td>Bildung</td><td>LernBot</td><td class="price">2.790 €</td><td class="price">249 €</td></tr>
  </table>
  ` : `
  <div class="accent-box" style="margin-top: 20px;">
    <p><strong>Hinweis:</strong> Sie haben noch keine KI-Branchenlösung ausgewählt. Sprechen Sie uns gerne an, um zu erfahren, wie unser DeutLicht ${paket.botName} Ihr Unternehmen unterstützen kann.</p>
  </div>
  `}
  
  <div class="footer">Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de</div>
</div>

<!-- PAGE 4: UMSETZUNG -->
<div class="page">
  <div class="page-header">
    <span class="brand">DeutLicht®</span>
    <span class="page-num">Seite 4 von 6</span>
  </div>
  
  <h2>Ihr Projekt in ${paket.umsetzungWochen} Wochen</h2>
  
  <div class="timeline">
    <div class="timeline-item">
      <h4>1️⃣ WOCHE 1: Analyse & Strategieplanung</h4>
      <p>Projektanfrage auswerten + Workshop, Anforderungsanalyse, Projektplan finalisieren</p>
    </div>
    <div class="timeline-item">
      <h4>2️⃣ WOCHEN 2-${Math.max(paket.umsetzungWochen - 2, 2)}: Umsetzung</h4>
      <p>Design + Entwicklung, Konfiguration des ${paket.botName}, Integration Ihrer Systeme</p>
    </div>
    <div class="timeline-item">
      <h4>3️⃣ WOCHE ${paket.umsetzungWochen - 1}: Testphase</h4>
      <p>2 Korrekturrunden + Optimierung, Pilotbetrieb mit ausgewählten Nutzern</p>
    </div>
    <div class="timeline-item">
      <h4>4️⃣ WOCHE ${paket.umsetzungWochen}: Livegang</h4>
      <p>Go-Live, Training Ihres Teams, 14 Tage Intensiv-Support</p>
    </div>
  </div>
  
  <div class="info-grid">
    <div class="info-card">
      <label>📅 Projektstart</label>
      <div class="value">${formatDate(projectStartDate)}</div>
    </div>
    <div class="info-card">
      <label>🚀 Geplanter Livegang</label>
      <div class="value">${formatDate(projectEndDate)}</div>
    </div>
  </div>
  
  <p style="color: var(--gray); font-size: 10pt; margin-top: 10px;">
    📅 Start: ${formatDate(projectStartDate)} (${timeInfo.months} Monate Vorlauf)
  </p>
  
  <div class="accent-box">
    <h3>🛡️ Unsere Projektgarantie</h3>
    <p>Sollte der ${paket.botName} nach 30 Tagen Live-Betrieb nicht die vereinbarten Leistungsziele erreichen, optimieren wir kostenlos nach – bis Sie zufrieden sind.</p>
  </div>
  
  <h3>Ihre Vorteile</h3>
  <ul class="feature-list">
    <li>Dedizierter Projektmanager als fester Ansprechpartner</li>
    <li>Wöchentliche Status-Updates während der Umsetzung</li>
    <li>Keine versteckten Kosten – Festpreis-Garantie</li>
    <li>2 Korrekturrunden inklusive</li>
  </ul>
  
  <div class="footer">Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de</div>
</div>

<!-- PAGE 5: INVESTMENT -->
<div class="page">
  <div class="page-header">
    <span class="brand">DeutLicht®</span>
    <span class="page-num">Seite 5 von 6</span>
  </div>
  
  <h2>Ihr maßgeschneidertes Angebot</h2>
  
  <div class="info-grid">
    <div class="info-card" style="border-left-color: var(--accent);">
      <label>Ihre Auswahl</label>
      <div class="value">${kiSelected ? paket.botName + ' | ' : ''}${companySize} MA</div>
    </div>
    <div class="info-card" style="border-left-color: var(--success);">
      <label>Zeitfaktor</label>
      <div class="value">${timeInfo.label}</div>
    </div>
  </div>
  
  ${basispreis > 0 ? `
  <h3>Einmalige Investition</h3>
  <table class="price-table">
    <tr><th>Position</th><th class="price">Betrag</th></tr>
    ${kiSelected ? `<tr><td>DeutLicht ${paket.botName} – Setup & Konfiguration</td><td class="price">${formatCurrency(branchenBotEinmalpreis)}</td></tr>` : ''}
    ${websiteKosten > 0 ? `<tr><td>${websiteLabel}</td><td class="price">${formatCurrency(websiteKosten)}</td></tr>` : ''}
    ${voicebotKosten > 0 ? `<tr><td>Voicebot-Qualifizierung</td><td class="price">${formatCurrency(voicebotKosten)}</td></tr>` : ''}
    <tr class="subtotal"><td>Zwischensumme</td><td class="price">${formatCurrency(basispreis)}</td></tr>
    ${sizeFactor !== 1 ? `<tr><td>× Unternehmensfaktor ${sizeFactor.toFixed(1)} (${companySize})</td><td class="price">${sizeFactor > 1 ? '+' : ''}${formatCurrency(Math.round(basispreis * (sizeFactor - 1)))}</td></tr>` : ''}
    ${timeFactor !== 1 ? `<tr><td>× Zeitfaktor ${timeFactor.toFixed(2)} (${timeInfo.label})</td><td class="price">${timeFactor > 1 ? '+' : ''}${formatCurrency(Math.round(basispreis * sizeFactor * (timeFactor - 1)))}</td></tr>` : ''}
    <tr class="total"><td><strong>EINMALIG GESAMT (netto)</strong></td><td class="price">${formatCurrency(einmalpreis)}</td></tr>
  </table>
  
  <div class="calc-box">
    <strong>Detaillierte Kalkulation:</strong><br>
    Basispreis: <code>${formatCurrency(basispreis)}</code> × Unternehmensfaktor <code>${sizeFactor.toFixed(1)}</code> × Zeitfaktor <code>${timeFactor.toFixed(2)}</code> = <strong>${formatCurrency(einmalpreis)}</strong>
  </div>
  ` : `
  <div class="accent-box">
    <p><strong>Hinweis:</strong> Sie haben noch keine kostenpflichtigen Leistungen ausgewählt. Bitte wählen Sie im Bereich "Leistungsmodule" die gewünschten Services aus.</p>
  </div>
  `}
  
  ${gesamtMonatlich > 0 ? `
  <h3>Monatliche Kosten (optional)</h3>
  <table class="price-table">
    <tr><th>Position</th><th class="price">Betrag/Monat</th></tr>
    ${kiSelected && monatspreis > 0 ? `<tr><td>${paket.botName} – Betrieb & Support</td><td class="price">${formatCurrency(monatspreis)}</td></tr>` : ''}
    ${hostingMonatlich > 0 ? `<tr><td>${hosting.name} Hosting (${hosting.basis}€ + ${hosting.service}€ Service)</td><td class="price">${formatCurrency(hostingMonatlich)}</td></tr>` : ''}
    <tr class="total"><td><strong>MONATLICH GESAMT (netto)</strong></td><td class="price">${formatCurrency(gesamtMonatlich)}</td></tr>
  </table>
  ${hostingMonatlich > 0 ? `<p style="font-size: 9pt; color: var(--gray);">Jahreszahlung: ${formatCurrency(hosting.jahr)}/Jahr (Hosting)</p>` : ''}
  ` : ''}
  
  <h3>✅ Beinhaltet:</h3>
  <div class="info-grid">
    <ul class="feature-list" style="margin: 0;">
      <li>Strategie-Workshop aus Projektanfrage</li>
      <li>Design im Corporate Identity</li>
      <li>Vollständige Umsetzung</li>
    </ul>
    <ul class="feature-list" style="margin: 0;">
      <li>Mobiloptimierung + Basis-SEO</li>
      <li>2 Korrekturrunden</li>
      <li>14 Tage Intensiv-Support</li>
    </ul>
  </div>
  
  <div class="footer">Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de</div>
</div>

<!-- PAGE 6: NÄCHSTE SCHRITTE -->
<div class="page">
  <div class="page-header">
    <span class="brand">DeutLicht®</span>
    <span class="page-num">Seite 6 von 6</span>
  </div>
  
  <h2>3 Schritte zum Start</h2>
  
  <div class="timeline">
    <div class="timeline-item">
      <h4>1️⃣ Abstimmung</h4>
      <p>📅 ${nextMeeting} | Feinjustierung Ihres Angebots im persönlichen Gespräch</p>
    </div>
    <div class="timeline-item">
      <h4>2️⃣ Freigabe</h4>
      <p>✍️ Angebot unterschreiben (50% Anzahlung) | Vertrag & Projektstart</p>
    </div>
    <div class="timeline-item">
      <h4>3️⃣ Kickoff</h4>
      <p>🚀 Woche 1 nach Vertragsunterzeichnung | Ihr ${paket.botName} startet</p>
    </div>
  </div>
  
  <div class="cta-box">
    <h3>Bereit für Ihren ${paket.botName}?</h3>
    <p>Vereinbaren Sie jetzt Ihr kostenloses Beratungsgespräch!</p>
    <p class="phone">📞 +49 178 5549216</p>
    <p>oder per E-Mail: <strong>info@deutlicht.de</strong></p>
  </div>
  
  <div class="contact-grid">
    <div class="contact-card">
      <h4>Ihr Ansprechpartner</h4>
      <p><strong>Carsten van de Sand</strong></p>
      <p>Tel: +49 178 5549216</p>
      <p>info@deutlicht.de</p>
      <p>www.deutlicht.de</p>
    </div>
    <div class="contact-card">
      <h4>Dieses Angebot</h4>
      <p><strong>Nr.: ${offerNumber}</strong></p>
      <p>Erstellt: ${offerDate}</p>
      <p>Gültig bis: ${validUntil}</p>
      <p>Alle Preise zzgl. MwSt.</p>
    </div>
  </div>
  
  <div class="accent-box" style="margin-top: 20px; text-align: center;">
    <p style="font-size: 12pt; font-weight: 600; margin: 0;">DeutLicht. Wo Komplexes einfach wird.</p>
  </div>
  
  <div class="footer">Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de</div>
</div>

</body>
</html>`;
}

// ==================== HANDLER ====================

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    if (!requestData.data) {
      return new Response(
        JSON.stringify({ error: "Keine Daten übermittelt" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Generating offer for:", requestData.data.company_name);
    
    const html = generateOfferHtml(requestData.data);
    const paket = getPaket(requestData.data.industry || "Sonstiges");

    return new Response(
      JSON.stringify({ 
        success: true, 
        html,
        metadata: {
          company: requestData.data.company_name,
          created: new Date().toISOString(),
          paket: paket.botName,
          offerNumber: `DL-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(-6)}`
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error generating offer:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Erstellen des Angebots", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
