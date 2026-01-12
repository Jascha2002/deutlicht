// DeutLicht Angebotsgenerator v3.1 - Vollautomatische Angebotserstellung
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

// Website-Preise
export const websitePreise = {
  onepager: { min: 1200, max: 2200, avg: 1800 },
  "5-seiten": { min: 1900, max: 3800, avg: 3500, perPage: 340 },
  webshop_starter: { min: 3500, max: 5500, avg: 4500 }
};

// Voicebot-Preise
export const voicebotPreise = {
  weiterleitung: 3500,
  qualifizierung: 6000,
  vollauto: 9500
};

// Unternehmensgrößen-Faktoren (aktualisiert)
export const COMPANY_SIZE_FACTORS: Record<string, number> = {
  "1-10": 1.0,
  "11-50": 1.3,
  "51-250": 1.6,
  ">250": 2.2
};

// Zeitfaktoren basierend auf Monaten bis Projektstart
export const TIME_FACTORS: Record<string, { factor: number; label: string }> = {
  ">6": { factor: 0.85, label: "Mehr als 6 Monate Vorlauf" },
  "3-6": { factor: 0.9, label: "3-6 Monate Vorlauf" },
  "1-3": { factor: 1.0, label: "1-3 Monate Vorlauf" },
  "<1": { factor: 1.2, label: "Weniger als 1 Monat" },
  "<2w": { factor: 1.4, label: "Express (unter 2 Wochen)" }
};

// Hosting-Pakete (aktualisiert)
export interface HostingPaket {
  id: string;
  name: string;
  basis: number;
  service: number;
  total: number;
  jahrespreis: number;
}

export const hostingPakete: HostingPaket[] = [
  { id: "onepager", name: "Onepager", basis: 12, service: 39, total: 51, jahrespreis: 561 },
  { id: "5-seiten", name: "5-Seiten Website", basis: 22, service: 42, total: 64, jahrespreis: 704 },
  { id: "webshop", name: "Webshop", basis: 79, service: 59, total: 138, jahrespreis: 1518 }
];

// Zusatzleistungen
export interface Zusatzleistung {
  id: string;
  name: string;
  preis: number;
  monatlich: boolean;
}

export const zusatzleistungen: Zusatzleistung[] = [
  { id: "multisprache", name: "Mehrsprachigkeit (+2 Sprachen)", preis: 490, monatlich: false },
  { id: "crm-integration", name: "CRM-Integration", preis: 790, monatlich: false },
  { id: "erp-integration", name: "ERP-Integration", preis: 1290, monatlich: false },
  { id: "analytics-pro", name: "Analytics Pro Dashboard", preis: 49, monatlich: true },
  { id: "priority-support", name: "Priority Support", preis: 99, monatlich: true },
  { id: "custom-training", name: "Custom Training (5 Stunden)", preis: 890, monatlich: false }
];

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
    // Alternative Schreibweisen
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

// Berechne Monate bis Projektstart
export function berechneMonateBisStart(projectStart: string): { months: number; category: string } {
  if (!projectStart) return { months: 3, category: "1-3" };
  
  // Handle predefined categories
  if (projectStart === 'sofort') return { months: 0, category: "<1" };
  if (projectStart === '1-3-monate') return { months: 2, category: "1-3" };
  if (projectStart === '3-6-monate') return { months: 4, category: "3-6" };
  if (projectStart === 'offen') return { months: 3, category: "1-3" };
  
  // Handle date string
  const startDate = new Date(projectStart);
  const today = new Date();
  const diffTime = startDate.getTime() - today.getTime();
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
  
  if (diffMonths < 0.5) return { months: 0, category: "<2w" };
  if (diffMonths < 1) return { months: 1, category: "<1" };
  if (diffMonths < 3) return { months: Math.round(diffMonths), category: "1-3" };
  if (diffMonths < 6) return { months: Math.round(diffMonths), category: "3-6" };
  return { months: Math.round(diffMonths), category: ">6" };
}

// Bestimme Hosting-Paket basierend auf Services
export function getHostingPaket(servicesNeeded: string[], pagesNeeded?: number): HostingPaket {
  if (servicesNeeded.includes('Webshop')) {
    return hostingPakete.find(p => p.id === 'webshop')!;
  }
  if (pagesNeeded && pagesNeeded > 1) {
    return hostingPakete.find(p => p.id === '5-seiten')!;
  }
  return hostingPakete.find(p => p.id === 'onepager')!;
}

// Vollständige Angebotskalkulation
export interface AngebotKalkulation {
  // Paket Info
  branchenPaket: BranchenPaket;
  hostingPaket: HostingPaket;
  
  // Faktoren
  basispreis: number;
  unternehmenfaktor: number;
  zeitfaktor: number;
  zeitfaktorLabel: string;
  monateBisStart: number;
  
  // Berechnete Preise
  einmalpreisFinal: number;
  monatspreisFinal: number;
  hostingKosten: number;
  hostingJahrespreis: number;
  gesamtMonatlich: number;
  
  // Zusatzkosten für Website
  websiteKosten: number;
  voicebotKosten: number;
  
  // Zeitplan
  umsetzungWochen: number;
  projektStartDatum: string;
  projektEndeDatum: string;
  naechstesBesprechung: string;
  
  // Services
  selectedServices: string[];
}

export function berechneAngebot(
  industry: string,
  companySize: string,
  projectStart: string,
  servicesNeeded: string[] = [],
  pagesNeeded: number = 5,
  budgetRange?: string
): AngebotKalkulation {
  const paket = getBranchenPaketByIndustry(industry);
  const unternehmenfaktor = COMPANY_SIZE_FACTORS[companySize] || 1.0;
  
  const { months, category } = berechneMonateBisStart(projectStart);
  const zeitInfo = TIME_FACTORS[category] || TIME_FACTORS["1-3"];
  const zeitfaktor = zeitInfo.factor;
  
  const hostingPaket = getHostingPaket(servicesNeeded, pagesNeeded);

  // Basispreis für Bot-Paket
  let basispreis = paket.einmalpreis;
  
  // Zusätzliche Website-Kosten
  let websiteKosten = 0;
  if (servicesNeeded.includes('Website')) {
    if (pagesNeeded <= 1) {
      websiteKosten = websitePreise.onepager.avg;
    } else {
      websiteKosten = websitePreise["5-seiten"].avg + ((pagesNeeded - 5) * websitePreise["5-seiten"].perPage);
    }
  }
  if (servicesNeeded.includes('Webshop')) {
    websiteKosten = websitePreise.webshop_starter.avg;
  }
  
  // Voicebot-Kosten
  let voicebotKosten = 0;
  if (servicesNeeded.includes('Voicebots / Sprachassistenz')) {
    voicebotKosten = voicebotPreise.qualifizierung;
  }

  // Gesamtberechnung
  const einmalpreisFinal = Math.round((basispreis + websiteKosten + voicebotKosten) * unternehmenfaktor * zeitfaktor);
  const monatspreisFinal = Math.round(paket.monatspreis * unternehmenfaktor);
  const gesamtMonatlich = monatspreisFinal + hostingPaket.total;

  // Zeitplan berechnen
  const heute = new Date();
  let startDatum: Date;
  
  if (projectStart === 'sofort') {
    startDatum = new Date(heute.setDate(heute.getDate() + 7));
  } else if (projectStart === '1-3-monate') {
    startDatum = new Date(heute.setMonth(heute.getMonth() + 1));
  } else if (projectStart === '3-6-monate') {
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
    hostingPaket,
    basispreis: basispreis + websiteKosten + voicebotKosten,
    unternehmenfaktor,
    zeitfaktor,
    zeitfaktorLabel: zeitInfo.label,
    monateBisStart: months,
    einmalpreisFinal,
    monatspreisFinal,
    hostingKosten: hostingPaket.total,
    hostingJahrespreis: hostingPaket.jahrespreis,
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
