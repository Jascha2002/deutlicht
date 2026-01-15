// DeutLicht Angebotsgenerator v4.0 - Mit fixen Hosting-Preisen
// JSON-Projektanfrage → PDF-Angebot in 30 Sekunden

export interface BranchenPaket {
  id: string;
  branche: string;
  botName: string;
  einmalpreis: number;
  monatspreis: number;
  features: string[];
  umsetzungWochen: number;
  zielgruppe: string;
}

// Branchenspezifische Bot-Pakete
export const branchenPakete: BranchenPaket[] = [
  {
    id: "handwerk",
    branche: "Handwerk",
    botName: "HandwerksBot",
    einmalpreis: 1990,
    monatspreis: 179,
    features: [
      "Digitale Baustellenprotokolle",
      "Angebots- & Terminabstimmung",
      "Wartungs- & Upsell-Hinweise",
      "Kundenstatus-Updates",
      "70% weniger Telefonate"
    ],
    umsetzungWochen: 4,
    zielgruppe: "Handwerksbetriebe mit 5-50 Mitarbeitern"
  },
  {
    id: "kanzlei",
    branche: "Kanzlei & Beratung",
    botName: "KanzleiBot",
    einmalpreis: 2990,
    monatspreis: 249,
    features: [
      "Mandantenanfragen-Qualifizierung",
      "Terminvereinbarung & Erinnerungen",
      "Dokumenten-Upload & -Verwaltung",
      "FAQ & Erstberatungs-Automation",
      "DSGVO-konforme Verarbeitung"
    ],
    umsetzungWochen: 4,
    zielgruppe: "Kanzleien und Beratungsunternehmen"
  },
  {
    id: "ecommerce",
    branche: "E-Commerce",
    botName: "ShopBot",
    einmalpreis: 4990,
    monatspreis: 399,
    features: [
      "24/7 Kundenservice-Automation",
      "Bestellstatus & Tracking",
      "Produktberatung & Empfehlungen",
      "Retouren-Management",
      "Cross- & Upselling",
      "Multi-Channel-Integration"
    ],
    umsetzungWochen: 6,
    zielgruppe: "Online-Shops mit 1.000+ Bestellungen/Monat"
  },
  {
    id: "produktion",
    branche: "Maschinenbau & Industrie",
    botName: "ProdBot",
    einmalpreis: 3490,
    monatspreis: 299,
    features: [
      "Produktkonfigurator",
      "Technische Vorqualifizierung",
      "Angebotsvorbereitung",
      "ERP-Integration",
      "Lead-Scoring & Übergabe",
      "50% kürzere Angebotsphasen"
    ],
    umsetzungWochen: 6,
    zielgruppe: "Produzierende Unternehmen mit komplexen Produkten"
  },
  {
    id: "gesundheit",
    branche: "Gesundheit & Pflege",
    botName: "CareBot",
    einmalpreis: 2490,
    monatspreis: 199,
    features: [
      "Terminvereinbarung & Erinnerungen",
      "Angehörigen-Updates",
      "Dokumentationshilfe",
      "Informationshotline",
      "DSGVO-konforme Patientendaten"
    ],
    umsetzungWochen: 5,
    zielgruppe: "Arztpraxen, Pflegeeinrichtungen, Therapiepraxen"
  },
  {
    id: "bildung",
    branche: "Bildung & Weiterbildung",
    botName: "LernBot",
    einmalpreis: 2790,
    monatspreis: 249,
    features: [
      "Kursberatung & Anmeldung",
      "Förderfähigkeits-Check (BAFA)",
      "Terminmanagement",
      "Teilnehmerkommunikation",
      "Zertifikats-Verwaltung"
    ],
    umsetzungWochen: 4,
    zielgruppe: "Bildungsträger, Schulen, Akademien"
  },
  {
    id: "gastronomie",
    branche: "Gastronomie & Hotellerie",
    botName: "GastroBot",
    einmalpreis: 2490,
    monatspreis: 199,
    features: [
      "24/7 Bestellannahme",
      "Reservierungsmanagement",
      "Abhol- & Lieferstatus",
      "Zusatzverkäufe (Upselling)",
      "+30% Umsatz durch permanente Bestellbarkeit"
    ],
    umsetzungWochen: 4,
    zielgruppe: "Restaurants, Hotels, Cafés"
  },
  {
    id: "verwaltung",
    branche: "Öffentliche Verwaltung",
    botName: "BürgerBot",
    einmalpreis: 3990,
    monatspreis: 299,
    features: [
      "Bürgeranfragen-Bearbeitung",
      "Formularhilfe & Antragsstatus",
      "Terminbuchung",
      "Bürgerumfragen",
      "80% Routineanfragen automatisiert"
    ],
    umsetzungWochen: 6,
    zielgruppe: "Kommunen und Behörden"
  },
  {
    id: "immobilien",
    branche: "Immobilien",
    botName: "ImmoBot",
    einmalpreis: 3490,
    monatspreis: 279,
    features: [
      "Anfragen-Qualifizierung",
      "Besichtigungstermine",
      "Exposé-Versand",
      "FAQ-Beantwortung",
      "Mieterkommunikation"
    ],
    umsetzungWochen: 5,
    zielgruppe: "Makler, Hausverwaltungen, Bauträger"
  },
  {
    id: "standard",
    branche: "Sonstiges",
    botName: "BranchenBot",
    einmalpreis: 2490,
    monatspreis: 199,
    features: [
      "Kundenanfragen-Automation",
      "Terminvereinbarung",
      "FAQ-Management",
      "Lead-Qualifizierung",
      "Basis-Reporting"
    ],
    umsetzungWochen: 4,
    zielgruppe: "Alle Branchen"
  }
];

// Website-Preise (Basispreise für Kalkulation)
export const websitePreise = {
  onepager: 1200,
  landingpage: 1500,
  landingpage_starter: 299,
  "5-10": { base: 1900, perPage: 300 },
  "10-20": { base: 3400, perPage: 250 },
  "20-30": { base: 5900, perPage: 200 },
  ">30": { base: 7900, perPage: 180 }
};

// Website-Features Preise
export const websiteFeatures = {
  "Lead-/Vertriebsfokus": 2000,
  "Konfigurator": 4500,
  "ERP-Anbindung": 4500,
  "Blog/News-Bereich": 800,
  "Mehrsprachigkeit": 1200,
  "Online-Terminbuchung": 1500,
  "Mitgliederbereich": 2500
};

// Migrations-Preise
export const migrationPreise = {
  "1": 400,
  "2-5": 600,
  "6-10": 800,
  ">10": 1000
};

// ===== HOSTING-PAKETE - FIXE PREISE (keine Faktoren!) =====
export interface HostingPaket {
  id: string;
  name: string;
  monatlich: number;
  jaehrlich: number;
  beschreibung?: string;
}

// Standard Hosting-Pakete - FIXE PREISE
export const hostingPakete: HostingPaket[] = [
  { 
    id: "onepager", 
    name: "Onepager/Landingpage", 
    monatlich: 12, 
    jaehrlich: 120,
    beschreibung: "Für einfache Landingpages und Onepager"
  },
  { 
    id: "website_5_10", 
    name: "Website 5-10 Seiten", 
    monatlich: 20, 
    jaehrlich: 200,
    beschreibung: "Ideal für kleine bis mittlere Websites"
  },
  { 
    id: "website_10_20", 
    name: "Website 10-20 Seiten", 
    monatlich: 30, 
    jaehrlich: 300,
    beschreibung: "Für umfangreichere Unternehmenswebsites"
  },
  { 
    id: "shop_klein", 
    name: "Kleiner Shop", 
    monatlich: 25, 
    jaehrlich: 250,
    beschreibung: "Bis 100 Produkte"
  },
  { 
    id: "shop_mittel", 
    name: "Mittelgroßer Shop", 
    monatlich: 40, 
    jaehrlich: 400,
    beschreibung: "100-500 Produkte"
  },
  { 
    id: "shop_gross", 
    name: "Großer Shop", 
    monatlich: 60, 
    jaehrlich: 600,
    beschreibung: "500+ Produkte"
  }
];

// Pro-Shop-Server - Premium Hosting mit Vertragslaufzeiten
export interface ProHostingPaket {
  id: string;
  name: string;
  monatlich: number;
  jaehrlich: number;
  zweiJahre: number;
  dreiJahre: number;
  beschreibung: string;
}

export const proHostingPakete: ProHostingPaket[] = [
  {
    id: "pro_shop_server",
    name: "Pro-Shop-Server",
    monatlich: 80,
    jaehrlich: 800,
    zweiJahre: 1500, // entspricht 62,50€/Monat
    dreiJahre: 2100, // entspricht 58,33€/Monat
    beschreibung: "Hohe Ausfallsicherheit und schnelle Zugriffen in Deutschland"
  }
];

// Service/Wartungsverträge - FIXE PREISE
export interface ServiceVertrag {
  id: string;
  name: string;
  minuten: number;
  monatlich: number;
}

export const serviceVertraege: ServiceVertrag[] = [
  { id: "service_20", name: "Basic Service", minuten: 20, monatlich: 39 },
  { id: "service_60", name: "Standard Service", minuten: 60, monatlich: 99 },
  { id: "service_120", name: "Premium Service", minuten: 120, monatlich: 179 }
];

// Voicebot-Preise
export const voicebotPreise = {
  weiterleitung: 3500,
  vorqualifizierung: 6000,
  vollautomatisch: 9500
};

// Voicebot Anwendungs-spezifische Preise (intern)
export const voicebotAnwendungPreise: Record<string, { setup: number; monthly: number }> = {
  "Mieteranfragen (Hausverwaltung)": { setup: 2000, monthly: 100 },
  "Besichtigungstermine (Immobilienbüros)": { setup: 2500, monthly: 150 },
  "Schadensmeldungen (Versicherungen)": { setup: 3000, monthly: 200 },
  "Zählerablesung (Ablesedienste)": { setup: 1500, monthly: 80 },
  "Vorsorgeuntersuchungen (Arztpraxen)": { setup: 3500, monthly: 250 },
  "Terminerinnerungen (Werkstatt, Therapeuten)": { setup: 1000, monthly: 50 },
  "Abholbenachrichtigungen (Retail, Services)": { setup: 1200, monthly: 60 }
};

// SEO-Pakete
export interface SEOPaket {
  id: string;
  name: string;
  setup: number;
  monthly: number;
  beschreibung: string;
}

export const seoPakete: SEOPaket[] = [
  { id: "micro", name: "Micro", setup: 199, monthly: 0, beschreibung: "KI-Quick-Check für 5-10 Seiten" },
  { id: "starter", name: "Starter", setup: 299, monthly: 0, beschreibung: "inkl. Keywords & Google Search Console" },
  { id: "quickwin", name: "Quickwin", setup: 449, monthly: 0, beschreibung: "inkl. Google My Business Optimierung" },
  { id: "klein", name: "Klein", setup: 0, monthly: 199, beschreibung: "Monatliche Routinepflege & Updates" },
  { id: "basic", name: "Basic", setup: 0, monthly: 790, beschreibung: "20h/Monat, 25 Keywords, Basis-Reporting" },
  { id: "pro", name: "Pro", setup: 0, monthly: 1390, beschreibung: "35h/Monat, 50 Keywords, erweitertes Tracking" },
  { id: "enterprise", name: "Enterprise", setup: 0, monthly: 2490, beschreibung: "60h/Monat, 100+ Keywords, Premium-Support" }
];

// KI-Agenten Preise
export const kiAgentenPreise = {
  einfach: { setup: 1750, monthly: 0 },
  workflow: { setup: 7500, monthly: 0 },
  multi: { setup: 12000, monthly: 0 },
  branche: {
    kanzlei: { setup: 2990, monthly: 249 },
    handwerk: { setup: 1990, monthly: 179 },
    ecommerce: { setup: 4990, monthly: 399 },
    produktion: { setup: 3490, monthly: 299 },
    gesundheit: { setup: 2490, monthly: 199 },
    bildung: { setup: 2790, monthly: 249 }
  }
};

// Prozessoptimierung Preise
export const prozessPreise = {
  audit: 1200,
  workshop: 2500
};

// Beratungspreise
export const beratungsPreise = {
  kontingent: 3500, // 3,5 Tage
  stundenpreis: 199
};

// Unternehmensgrößen-Faktoren (für andere Leistungen, NICHT für Hosting!)
export const COMPANY_SIZE_FACTORS: Record<string, number> = {
  "1-10": 1.0,
  "11-50": 1.3,
  "51-250": 1.6,
  ">250": 2.2
};

// Zeitfaktoren basierend auf Projektstart
export const TIME_FACTORS: Record<string, { factor: number; label: string }> = {
  "sofort": { factor: 1.3, label: "Sofortstart (7 Tage)" },
  "2wochen": { factor: 1.15, label: "In 2 Wochen" },
  "4wochen": { factor: 1.0, label: "In 4 Wochen" },
  "1-2monate": { factor: 0.95, label: "In 1-2 Monaten" },
  "6monate": { factor: 0.9, label: "Innerhalb 6 Monate" },
  "planung": { factor: 0.85, label: "Noch in Planung" },
  "unbekannt": { factor: 1.0, label: "Unbekannt" }
};

// Branchenfaktoren
export function getIndustryFactor(industry: string, companySize: string): number {
  const schwacheBranchen = [
    'Immobilienwirtschaft', 'Immobilien', 'Automobilindustrie', 'Automobil', 'Auto',
    'Maschinenbau', 'Chemieindustrie', 'Chemie', 'Stahlindustrie', 'Stahl',
    'Baubranche', 'Bau', 'Einzelhandel', 'Handel', 'Energieintensive Industrie',
    'Schiffbau', 'Textilindustrie', 'Textil'
  ];
  
  const starkeBranchen = [
    'Technologie', 'IT', 'Tech', 'Software', 'Pharmabranche', 'Pharma',
    'Medizintechnik', 'Medizin', 'Erneuerbare Energien', 'Solar', 'Wind',
    'Industrie 4.0', 'Logistik', 'Transport', 'Gesundheitswesen', 'Gesundheit',
    'Künstliche Intelligenz', 'KI', 'AI', 'Energieeffizienz', 'Kreislaufwirtschaft'
  ];
  
  const industryLower = industry.toLowerCase();
  
  // Schwache Branche: -10%
  if (schwacheBranchen.some(b => industryLower.includes(b.toLowerCase()))) {
    return 0.9;
  }
  
  // Starke Branche: Basis + Mitarbeiter-Aufschlag
  if (starkeBranchen.some(b => industryLower.includes(b.toLowerCase()))) {
    if (companySize === '1-10' || companySize === '11-50') return 1.0;
    if (companySize === '51-250') return 1.012; // +1.2%
    if (companySize === '>250') return 1.0375; // +3.75%
  }
  
  return 1.0;
}

// Branche zu Paket Mapping
export function getBranchenPaketByIndustry(industry: string): BranchenPaket {
  const industryMapping: Record<string, string> = {
    "Handwerk": "handwerk",
    "Einzelhandel": "ecommerce",
    "Gastronomie & Hotellerie": "gastronomie",
    "Gesundheitswesen": "gesundheit",
    "IT & Technologie": "standard",
    "Beratung & Dienstleistung": "kanzlei",
    "Produktion & Industrie": "produktion",
    "Immobilien": "immobilien",
    "Bildung & Schulung": "bildung",
    "Öffentliche Verwaltung / Kommune": "verwaltung",
    "Vereine & Verbände": "standard",
    "Sonstiges": "standard",
    "Kanzlei": "kanzlei",
    "ECommerce": "ecommerce",
    "Industrie": "produktion",
    "Kommunen": "verwaltung",
    "Gesundheit": "gesundheit",
    "Bildung": "bildung"
  };

  const paketId = industryMapping[industry] || "standard";
  return branchenPakete.find(p => p.id === paketId) || branchenPakete.find(p => p.id === "standard")!;
}

// Bestimme passendes Hosting-Paket
export function getHostingPaket(websiteType: string, shopProducts?: string): HostingPaket {
  if (websiteType === 'onepager' || websiteType === 'landingpage' || websiteType === 'landingpage_starter') {
    return hostingPakete.find(p => p.id === 'onepager')!;
  }
  if (websiteType === '5-10') {
    return hostingPakete.find(p => p.id === 'website_5_10')!;
  }
  if (websiteType === '10-20' || websiteType === '20-30' || websiteType === '>30') {
    return hostingPakete.find(p => p.id === 'website_10_20')!;
  }
  
  // Shop-Typen
  if (shopProducts === 'klein' || shopProducts === '<100') {
    return hostingPakete.find(p => p.id === 'shop_klein')!;
  }
  if (shopProducts === 'mittel' || shopProducts === '100-500') {
    return hostingPakete.find(p => p.id === 'shop_mittel')!;
  }
  if (shopProducts === 'gross' || shopProducts === '>500') {
    return hostingPakete.find(p => p.id === 'shop_gross')!;
  }
  
  return hostingPakete.find(p => p.id === 'onepager')!;
}

// Preisrundung (psychologisch optimiert)
export function roundPrice(price: number): number {
  if (price === 0) return 0;
  
  // Für Beträge unter 100€: normale Rundung
  if (price < 100) {
    return Math.round(price);
  }
  
  // Für größere Beträge: auf 50er runden
  return Math.round(price / 50) * 50;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format number with thousand separators
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('de-DE').format(amount);
}

// ===== Vollständige Angebotskalkulation =====
export interface AngebotKalkulation {
  branchenPaket: BranchenPaket;
  hostingPaket: HostingPaket;
  basispreis: number;
  unternehmenfaktor: number;
  zeitfaktor: number;
  zeitfaktorLabel: string;
  monateBisStart: number;
  einmalpreisFinal: number;
  monatspreisFinal: number;
  hostingKosten: number;
  hostingJahrespreis: number;
  gesamtMonatlich: number;
  websiteKosten: number;
  voicebotKosten: number;
  umsetzungWochen: number;
  projektStartDatum: string;
  projektEndeDatum: string;
  naechstesBesprechung: string;
  selectedServices: string[];
}

// Berechne Monate bis Projektstart
export function berechneMonateBisStart(projectStart: string): { months: number; category: string } {
  if (!projectStart) return { months: 3, category: "4wochen" };
  
  // Handle predefined categories
  if (projectStart === 'sofort') return { months: 0, category: "sofort" };
  if (projectStart === '2wochen') return { months: 0.5, category: "2wochen" };
  if (projectStart === '4wochen') return { months: 1, category: "4wochen" };
  if (projectStart === '1-2monate' || projectStart === '1-3-monate') return { months: 2, category: "1-2monate" };
  if (projectStart === '6monate' || projectStart === '3-6-monate') return { months: 4, category: "6monate" };
  if (projectStart === 'planung' || projectStart === 'offen') return { months: 6, category: "planung" };
  
  // Handle date string
  const startDate = new Date(projectStart);
  const today = new Date();
  const diffTime = startDate.getTime() - today.getTime();
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
  
  if (diffMonths < 0.5) return { months: 0, category: "sofort" };
  if (diffMonths < 1) return { months: 0.5, category: "2wochen" };
  if (diffMonths < 2) return { months: 1, category: "4wochen" };
  if (diffMonths < 3) return { months: 2, category: "1-2monate" };
  if (diffMonths < 6) return { months: Math.round(diffMonths), category: "6monate" };
  return { months: Math.round(diffMonths), category: "planung" };
}

export function berechneAngebot(
  industry: string,
  companySize: string,
  projectStart: string,
  servicesNeeded: string[] = [],
  pagesNeeded: number = 5,
  websiteType: string = 'onepager'
): AngebotKalkulation {
  const paket = getBranchenPaketByIndustry(industry);
  const unternehmenfaktor = COMPANY_SIZE_FACTORS[companySize] || 1.0;
  
  const { months, category } = berechneMonateBisStart(projectStart);
  const zeitInfo = TIME_FACTORS[category] || TIME_FACTORS["4wochen"];
  const zeitfaktor = zeitInfo.factor;
  
  // HOSTING MIT FIXEN PREISEN (keine Faktoren!)
  const hostingPaketData = getHostingPaket(websiteType);

  // Basispreis für Bot-Paket
  let basispreis = paket.einmalpreis;
  
  // Zusätzliche Website-Kosten (werden mit Faktoren berechnet)
  let websiteKosten = 0;
  if (servicesNeeded.includes('Website') || servicesNeeded.includes('Website & Digitale Plattformen')) {
    if (pagesNeeded <= 1) {
      websiteKosten = websitePreise.onepager;
    } else if (pagesNeeded <= 10) {
      websiteKosten = (websitePreise["5-10"] as any).base + ((pagesNeeded - 5) * (websitePreise["5-10"] as any).perPage);
    } else {
      websiteKosten = (websitePreise["10-20"] as any).base + ((pagesNeeded - 10) * (websitePreise["10-20"] as any).perPage);
    }
  }
  if (servicesNeeded.includes('Webshop')) {
    websiteKosten = 4500; // Shop Starter
  }
  
  // Voicebot-Kosten
  let voicebotKosten = 0;
  if (servicesNeeded.includes('Voicebots / Sprachassistenz')) {
    voicebotKosten = voicebotPreise.vorqualifizierung;
  }

  // Gesamtberechnung (Hosting ist FIX, keine Faktoren!)
  const einmalpreisFinal = roundPrice((basispreis + websiteKosten + voicebotKosten) * unternehmenfaktor * zeitfaktor);
  const monatspreisFinal = roundPrice(paket.monatspreis * unternehmenfaktor);
  
  // Hosting ist FIX - keine Faktoren anwenden!
  const hostingKosten = hostingPaketData.monatlich;
  const gesamtMonatlich = monatspreisFinal + hostingKosten;

  // Zeitplan berechnen
  const heute = new Date();
  let startDatum: Date;
  
  if (projectStart === 'sofort') {
    startDatum = new Date(heute.setDate(heute.getDate() + 7));
  } else if (projectStart === '2wochen') {
    startDatum = new Date(heute.setDate(heute.getDate() + 14));
  } else if (projectStart === '4wochen' || projectStart === '1-3-monate') {
    startDatum = new Date(heute.setMonth(heute.getMonth() + 1));
  } else if (projectStart === '1-2monate') {
    startDatum = new Date(heute.setMonth(heute.getMonth() + 2));
  } else if (projectStart === '6monate' || projectStart === '3-6-monate') {
    startDatum = new Date(heute.setMonth(heute.getMonth() + 3));
  } else if (projectStart && !isNaN(Date.parse(projectStart))) {
    startDatum = new Date(projectStart);
  } else {
    startDatum = new Date(heute.setMonth(heute.getMonth() + 1));
  }
  
  const endDatum = new Date(startDatum);
  endDatum.setDate(endDatum.getDate() + (paket.umsetzungWochen * 7));
  
  const naechstesBesprechung = new Date();
  naechstesBesprechung.setDate(naechstesBesprechung.getDate() + 3);

  return {
    branchenPaket: paket,
    hostingPaket: hostingPaketData,
    basispreis: basispreis + websiteKosten + voicebotKosten,
    unternehmenfaktor,
    zeitfaktor,
    zeitfaktorLabel: zeitInfo.label,
    monateBisStart: months,
    einmalpreisFinal,
    monatspreisFinal,
    hostingKosten,
    hostingJahrespreis: hostingPaketData.jaehrlich,
    gesamtMonatlich,
    websiteKosten,
    voicebotKosten,
    umsetzungWochen: paket.umsetzungWochen,
    projektStartDatum: startDatum.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
    projektEndeDatum: endDatum.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
    naechstesBesprechung: naechstesBesprechung.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
    selectedServices: servicesNeeded
  };
}
