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

// Branchenpakete Daten (Server-side copy)
const branchenPakete = [
  { id: "handwerk", branche: "Handwerk", botName: "HandwerksBot", einmalpreis: 1990, monatspreis: 179, umsetzungWochen: 4 },
  { id: "kanzlei", branche: "Kanzlei & Beratung", botName: "KanzleiBot", einmalpreis: 2990, monatspreis: 249, umsetzungWochen: 4 },
  { id: "ecommerce", branche: "E-Commerce", botName: "ShopBot", einmalpreis: 4990, monatspreis: 399, umsetzungWochen: 6 },
  { id: "gastronomie", branche: "Gastronomie & Hotellerie", botName: "GastroBot", einmalpreis: 2490, monatspreis: 199, umsetzungWochen: 4 },
  { id: "verwaltung", branche: "Öffentliche Verwaltung", botName: "BürgerBot", einmalpreis: 3990, monatspreis: 299, umsetzungWochen: 6 },
  { id: "gesundheit", branche: "Gesundheit & Pflege", botName: "CareBot", einmalpreis: 2990, monatspreis: 249, umsetzungWochen: 5 },
  { id: "industrie", branche: "Maschinenbau & Industrie", botName: "ProdBot", einmalpreis: 5990, monatspreis: 449, umsetzungWochen: 8 },
  { id: "bildung", branche: "Bildung & Weiterbildung", botName: "LernBot", einmalpreis: 1990, monatspreis: 149, umsetzungWochen: 4 },
  { id: "immobilien", branche: "Immobilien", botName: "ImmoBot", einmalpreis: 3490, monatspreis: 279, umsetzungWochen: 5 },
  { id: "standard", branche: "Standard-Paket", botName: "BranchenBot", einmalpreis: 2490, monatspreis: 199, umsetzungWochen: 4 }
];

const industryMapping: Record<string, string> = {
  "Handwerk": "handwerk",
  "Einzelhandel": "ecommerce",
  "Gastronomie & Hotellerie": "gastronomie",
  "Gesundheitswesen": "gesundheit",
  "IT & Technologie": "standard",
  "Beratung & Dienstleistung": "kanzlei",
  "Produktion & Industrie": "industrie",
  "Immobilien": "immobilien",
  "Bildung & Schulung": "bildung",
  "Öffentliche Verwaltung / Kommune": "verwaltung",
  "Vereine & Verbände": "standard",
  "Sonstiges": "standard"
};

const companySizeFactors: Record<string, number> = {
  "1-10": 1.0, "11-50": 1.2, "51-250": 1.5, ">250": 2.0
};

const timeFactors: Record<string, number> = {
  "sofort": 1.15, "1-3-monate": 1.0, "3-6-monate": 0.95, "offen": 1.0
};

function getPaket(industry: string) {
  const paketId = industryMapping[industry] || "standard";
  return branchenPakete.find(p => p.id === paketId) || branchenPakete.find(p => p.id === "standard")!;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function generateOfferHtml(data: any): string {
  const safeCompanyName = escapeHtml(data.company_name);
  const safeContactPerson = escapeHtml(data.contact_person);
  const safeIndustry = escapeHtml(data.industry);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeMainChallenge = escapeHtml(data.main_challenge);
  const safeProjectGoals = (data.project_goals || []).map((g: string) => escapeHtml(g));
  const safeServicesNeeded = (data.services_needed || []).map((s: string) => escapeHtml(s));

  const paket = getPaket(data.industry || "Sonstiges");
  const sizeFactor = companySizeFactors[data.company_size] || 1.0;
  const timeFactor = timeFactors[data.project_start] || 1.0;
  
  const einmalpreis = Math.round(paket.einmalpreis * sizeFactor * timeFactor);
  const monatspreis = Math.round(paket.monatspreis * sizeFactor);
  const hostingKosten = 51;
  const gesamtMonatlich = monatspreis + hostingKosten;

  const today = new Date();
  const offerDate = today.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  const validUntil = new Date(today.setDate(today.getDate() + 30)).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  // Generate 6-page PDF HTML structure
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angebot für ${safeCompanyName}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      background: white;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      page-break-after: always;
      position: relative;
    }
    .page:last-child { page-break-after: auto; }
    
    /* Colors - Neonblau/Gelb Theme */
    :root {
      --primary: #0066FF;
      --accent: #FFD700;
      --dark: #0f172a;
      --gray: #64748b;
      --light: #f8fafc;
    }
    
    /* Cover Page */
    .cover {
      background: linear-gradient(135deg, var(--dark) 0%, #1e293b 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .cover-logo {
      width: 180px;
      margin-bottom: 40px;
    }
    .cover h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 20px;
      color: var(--accent);
    }
    .cover h2 {
      font-size: 24px;
      font-weight: 400;
      opacity: 0.9;
      margin-bottom: 60px;
    }
    .cover-meta {
      position: absolute;
      bottom: 40mm;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 14px;
      opacity: 0.7;
    }
    
    /* Standard Pages */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid var(--primary);
    }
    .page-header img { height: 40px; }
    .page-number {
      font-size: 12px;
      color: var(--gray);
    }
    
    h2 {
      font-size: 24px;
      color: var(--dark);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    h2::before {
      content: '';
      width: 4px;
      height: 28px;
      background: var(--accent);
      border-radius: 2px;
    }
    
    h3 {
      font-size: 18px;
      color: var(--dark);
      margin: 25px 0 15px;
    }
    
    p { margin-bottom: 15px; color: #334155; }
    
    .highlight-box {
      background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      margin: 25px 0;
    }
    .highlight-box h3 { color: white; margin-top: 0; }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }
    .info-card {
      background: var(--light);
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid var(--primary);
    }
    .info-card label {
      font-size: 12px;
      text-transform: uppercase;
      color: var(--gray);
      display: block;
      margin-bottom: 5px;
    }
    .info-card .value {
      font-size: 18px;
      font-weight: 600;
      color: var(--dark);
    }
    
    .timeline {
      position: relative;
      padding-left: 40px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--primary);
    }
    .timeline-item {
      position: relative;
      margin-bottom: 25px;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -33px;
      top: 5px;
      width: 16px;
      height: 16px;
      background: var(--accent);
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 3px var(--primary);
    }
    .timeline-item h4 {
      font-size: 16px;
      color: var(--dark);
      margin-bottom: 5px;
    }
    .timeline-item p {
      font-size: 14px;
      color: var(--gray);
      margin: 0;
    }
    
    .price-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .price-table th, .price-table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    .price-table th {
      background: var(--light);
      font-weight: 600;
      color: var(--dark);
    }
    .price-table .total {
      background: var(--dark);
      color: white;
      font-weight: 700;
    }
    .price-table .price {
      text-align: right;
      font-weight: 600;
      color: var(--primary);
    }
    .price-table .total .price {
      color: var(--accent);
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
    }
    .feature-list li {
      padding: 10px 0 10px 30px;
      position: relative;
      border-bottom: 1px solid #f1f5f9;
    }
    .feature-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }
    
    .cta-box {
      background: var(--accent);
      color: var(--dark);
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin-top: 40px;
    }
    .cta-box h3 {
      margin-top: 0;
      font-size: 22px;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 30px;
    }
    .contact-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .footer {
      position: absolute;
      bottom: 20mm;
      left: 20mm;
      right: 20mm;
      text-align: center;
      font-size: 11px;
      color: var(--gray);
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER -->
  <div class="page cover">
    <img src="https://deutlicht.de/logo.png" alt="DeutLicht" class="cover-logo" onerror="this.style.display='none'">
    <h1>Ihr individuelles Angebot</h1>
    <h2>für ${safeCompanyName}</h2>
    <div style="background: rgba(255,215,0,0.2); padding: 20px 40px; border-radius: 50px; margin-top: 20px;">
      <span style="font-size: 20px; font-weight: 600;">DeutLicht ${paket.botName}</span>
    </div>
    <div class="cover-meta">
      <p>Erstellt am ${offerDate}</p>
      <p>Gültig bis ${validUntil}</p>
    </div>
  </div>

  <!-- PAGE 2: AUSGANGSLAGE -->
  <div class="page">
    <div class="page-header">
      <span style="font-weight: 600; color: var(--dark);">DeutLicht®</span>
      <span class="page-number">Seite 2 von 6</span>
    </div>
    
    <h2>Ihre Ausgangslage</h2>
    
    <div class="info-grid">
      <div class="info-card">
        <label>Unternehmen</label>
        <div class="value">${safeCompanyName}</div>
      </div>
      <div class="info-card">
        <label>Branche</label>
        <div class="value">${safeIndustry || 'Nicht angegeben'}</div>
      </div>
      <div class="info-card">
        <label>Ansprechpartner</label>
        <div class="value">${safeContactPerson}</div>
      </div>
      <div class="info-card">
        <label>Kontakt</label>
        <div class="value">${safeEmail}<br>${safePhone || '-'}</div>
      </div>
    </div>
    
    <h3>Ihre Projektziele</h3>
    <ul class="feature-list">
      ${safeProjectGoals.length ? safeProjectGoals.map((g: string) => `<li>${g}</li>`).join('') : '<li>Keine angegeben</li>'}
    </ul>
    
    ${safeMainChallenge ? `
    <h3>Ihre Hauptherausforderung</h3>
    <div class="highlight-box">
      <p style="margin: 0; font-size: 16px;">"${safeMainChallenge}"</p>
    </div>
    ` : ''}
    
    <h3>Gewünschte Leistungen</h3>
    <ul class="feature-list">
      ${safeServicesNeeded.length ? safeServicesNeeded.map((s: string) => `<li>${s}</li>`).join('') : '<li>Keine angegeben</li>'}
    </ul>
    
    <div class="footer">
      Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de
    </div>
  </div>

  <!-- PAGE 3: LEISTUNGSMODULE -->
  <div class="page">
    <div class="page-header">
      <span style="font-weight: 600; color: var(--dark);">DeutLicht®</span>
      <span class="page-number">Seite 3 von 6</span>
    </div>
    
    <h2>Ihr Lösungspaket: DeutLicht ${paket.botName}</h2>
    
    <p>Basierend auf Ihrer Branche <strong>${safeIndustry || 'Sonstiges'}</strong> empfehlen wir Ihnen unser <strong>${paket.branche}</strong>-Paket. Dieses Paket wurde speziell für die Anforderungen Ihrer Branche entwickelt.</p>
    
    <div class="highlight-box">
      <h3>Was der ${paket.botName} für Sie leistet:</h3>
      <p style="margin: 0;">
        Der ${paket.botName} automatisiert Ihre Routineanfragen, entlastet Ihr Team und ist 24/7 für Ihre Kunden erreichbar – 
        ohne zusätzliches Personal, ohne Wartezeiten, ohne Qualitätsverlust.
      </p>
    </div>
    
    <h3>Enthaltene Leistungen</h3>
    <ul class="feature-list">
      <li>Individuelle Konfiguration für ${safeCompanyName}</li>
      <li>Branchenspezifische Antwortvorlagen</li>
      <li>Integration in Ihre bestehenden Systeme</li>
      <li>24/7 Verfügbarkeit</li>
      <li>Deutschsprachige Konversationen</li>
      <li>Eskalation an Mitarbeiter bei komplexen Anfragen</li>
      <li>Monatliches Reporting & Analytics</li>
      <li>Technischer Support</li>
    </ul>
    
    <h3>Optionale Erweiterungen</h3>
    <div class="info-grid">
      <div class="info-card">
        <label>Mehrsprachigkeit</label>
        <div class="value">+ 490 € einmalig</div>
      </div>
      <div class="info-card">
        <label>CRM-Integration</label>
        <div class="value">+ 790 € einmalig</div>
      </div>
      <div class="info-card">
        <label>Priority Support</label>
        <div class="value">+ 99 €/Monat</div>
      </div>
      <div class="info-card">
        <label>Custom Training</label>
        <div class="value">+ 890 € (5 Std.)</div>
      </div>
    </div>
    
    <div class="footer">
      Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de
    </div>
  </div>

  <!-- PAGE 4: UMSETZUNG -->
  <div class="page">
    <div class="page-header">
      <span style="font-weight: 600; color: var(--dark);">DeutLicht®</span>
      <span class="page-number">Seite 4 von 6</span>
    </div>
    
    <h2>Umsetzungsplan</h2>
    
    <p>Ihr ${paket.botName} wird in <strong>${paket.umsetzungWochen} Wochen</strong> einsatzbereit sein. Hier ist Ihr persönlicher Projektplan:</p>
    
    <div class="timeline">
      <div class="timeline-item">
        <h4>1️⃣ Woche 1: Analyse & Strategieplanung</h4>
        <p>Kick-off Meeting, Anforderungsanalyse, Prozess-Mapping, Projektplan-Finalisierung</p>
      </div>
      
      <div class="timeline-item">
        <h4>2️⃣ Wochen 2-${Math.max(paket.umsetzungWochen - 2, 2)}: Umsetzung</h4>
        <p>Konfiguration des ${paket.botName}, Integration Ihrer Systeme, Erstellung der Antwortvorlagen, Testphase intern</p>
      </div>
      
      <div class="timeline-item">
        <h4>3️⃣ Woche ${paket.umsetzungWochen - 1}: Test & Optimierung</h4>
        <p>Pilotbetrieb mit ausgewählten Nutzern, Feedback-Integration, Feintuning der Antworten</p>
      </div>
      
      <div class="timeline-item">
        <h4>4️⃣ Woche ${paket.umsetzungWochen}: Livegang</h4>
        <p>Go-Live, Schulung Ihres Teams, Übergabe der Dokumentation, Start des laufenden Supports</p>
      </div>
    </div>
    
    <div class="highlight-box">
      <h3>Unsere Projektgarantie</h3>
      <p style="margin: 0;">
        Sollte der ${paket.botName} nach 30 Tagen Live-Betrieb nicht die vereinbarten Leistungsziele erreichen, 
        optimieren wir kostenlos nach – bis Sie zufrieden sind.
      </p>
    </div>
    
    <h3>Ihre Vorteile</h3>
    <ul class="feature-list">
      <li>Dedizierter Projektmanager als fester Ansprechpartner</li>
      <li>Wöchentliche Status-Updates während der Umsetzung</li>
      <li>Keine versteckten Kosten – Festpreis-Garantie</li>
      <li>Flexible Anpassungen auch nach Go-Live möglich</li>
    </ul>
    
    <div class="footer">
      Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de
    </div>
  </div>

  <!-- PAGE 5: INVESTMENT -->
  <div class="page">
    <div class="page-header">
      <span style="font-weight: 600; color: var(--dark);">DeutLicht®</span>
      <span class="page-number">Seite 5 von 6</span>
    </div>
    
    <h2>Ihre Investition</h2>
    
    <p>Transparente Preisgestaltung ohne versteckte Kosten. Alle Preise verstehen sich zzgl. der gesetzlichen MwSt.</p>
    
    <h3>Einmalige Kosten</h3>
    <table class="price-table">
      <tr>
        <th>Position</th>
        <th class="price">Preis</th>
      </tr>
      <tr>
        <td>DeutLicht ${paket.botName} – Setup & Konfiguration</td>
        <td class="price">${formatCurrency(paket.einmalpreis)}</td>
      </tr>
      <tr>
        <td>Unternehmensgröße-Anpassung (Faktor ${sizeFactor.toFixed(1)})</td>
        <td class="price">${sizeFactor > 1 ? '+' + formatCurrency(Math.round(paket.einmalpreis * (sizeFactor - 1))) : '—'}</td>
      </tr>
      <tr>
        <td>Zeitfaktor ${data.project_start === 'sofort' ? '(Express)' : ''} (${timeFactor.toFixed(2)})</td>
        <td class="price">${timeFactor !== 1 ? (timeFactor > 1 ? '+' : '') + formatCurrency(Math.round(paket.einmalpreis * sizeFactor * (timeFactor - 1))) : '—'}</td>
      </tr>
      <tr class="total">
        <td>Gesamtinvestition einmalig</td>
        <td class="price">${formatCurrency(einmalpreis)}</td>
      </tr>
    </table>
    
    <h3>Monatliche Kosten</h3>
    <table class="price-table">
      <tr>
        <th>Position</th>
        <th class="price">Preis/Monat</th>
      </tr>
      <tr>
        <td>DeutLicht ${paket.botName} – Betrieb & Support</td>
        <td class="price">${formatCurrency(monatspreis)}</td>
      </tr>
      <tr>
        <td>Hosting & Infrastruktur (Onepager 12 € + Service 39 €)</td>
        <td class="price">${formatCurrency(hostingKosten)}</td>
      </tr>
      <tr class="total">
        <td>Gesamtkosten monatlich</td>
        <td class="price">${formatCurrency(gesamtMonatlich)}</td>
      </tr>
    </table>
    
    <div class="highlight-box" style="background: var(--accent); color: var(--dark);">
      <h3 style="color: var(--dark);">💡 Ihr ROI-Potenzial</h3>
      <p style="margin: 0; color: var(--dark);">
        Mit dem ${paket.botName} können Sie bis zu <strong>70% der Routineanfragen automatisieren</strong>. 
        Bei durchschnittlich 5 Minuten pro Anfrage und 100 Anfragen/Monat sparen Sie <strong>~8 Arbeitsstunden monatlich</strong>.
      </p>
    </div>
    
    <div class="footer">
      Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de
    </div>
  </div>

  <!-- PAGE 6: NÄCHSTE SCHRITTE -->
  <div class="page">
    <div class="page-header">
      <span style="font-weight: 600; color: var(--dark);">DeutLicht®</span>
      <span class="page-number">Seite 6 von 6</span>
    </div>
    
    <h2>Nächste Schritte</h2>
    
    <p>So geht es weiter – wir machen Ihnen den Einstieg so einfach wie möglich:</p>
    
    <div class="timeline">
      <div class="timeline-item">
        <h4>📞 Schritt 1: Persönliches Gespräch</h4>
        <p>Wir besprechen Ihr Angebot im Detail und beantworten alle Ihre Fragen. Dauer: ca. 30 Minuten.</p>
      </div>
      
      <div class="timeline-item">
        <h4>✍️ Schritt 2: Auftragsbestätigung</h4>
        <p>Nach Ihrer Zustimmung erhalten Sie eine verbindliche Auftragsbestätigung mit allen Details.</p>
      </div>
      
      <div class="timeline-item">
        <h4>🚀 Schritt 3: Projektstart</h4>
        <p>Kick-off Meeting mit Ihrem persönlichen Projektmanager – dann geht's los!</p>
      </div>
    </div>
    
    <div class="cta-box">
      <h3>Bereit für Ihren ${paket.botName}?</h3>
      <p style="margin-bottom: 20px;">Vereinbaren Sie jetzt Ihr kostenloses Beratungsgespräch!</p>
      <p style="font-size: 20px; font-weight: 700;">📞 +49 178 5549216</p>
      <p>oder per E-Mail: <strong>info@deutlicht.de</strong></p>
    </div>
    
    <div class="contact-grid">
      <div class="contact-card">
        <h4>Ihr Ansprechpartner</h4>
        <p><strong>DeutLicht Team</strong></p>
        <p>Tel: +49 178 5549216</p>
        <p>info@deutlicht.de</p>
      </div>
      <div class="contact-card">
        <h4>Dieses Angebot</h4>
        <p>Erstellt am: ${offerDate}</p>
        <p>Gültig bis: ${validUntil}</p>
        <p>Angebots-Nr.: ${Date.now().toString(36).toUpperCase()}</p>
      </div>
    </div>
    
    <p style="text-align: center; margin-top: 40px; font-style: italic; color: var(--gray);">
      Wir freuen uns auf die Zusammenarbeit mit ${safeCompanyName}!
    </p>
    
    <div class="footer">
      Stadtnetz UG (haftungsbeschränkt) · handelnd unter DeutLicht® · Gemeindeweg 4, 07546 Gera · www.deutlicht.de
    </div>
  </div>

</body>
</html>
`;
}

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

    const html = generateOfferHtml(requestData.data);

    // Return HTML that can be converted to PDF client-side
    return new Response(
      JSON.stringify({ 
        success: true, 
        html,
        metadata: {
          company: requestData.data.company_name,
          created: new Date().toISOString(),
          paket: getPaket(requestData.data.industry || "Sonstiges").botName
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error generating offer:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Erstellen des Angebots" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
