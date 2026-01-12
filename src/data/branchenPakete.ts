// DeutLicht Angebotsgenerator v3.1 - Branchenpakete & Kalkulation

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
      "Dokumentenmanagement"
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
      "Gästefeedback-Erfassung"
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
      "Eskalation an Sachbearbeiter"
    ],
    umsetzungWochen: 6,
    zielgruppe: "Kommunen und Behörden"
  },
  {
    id: "gesundheit",
    branche: "Gesundheit & Pflege",
    botName: "CareBot",
    einmalpreis: 2990,
    monatspreis: 249,
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
    id: "industrie",
    branche: "Maschinenbau & Industrie",
    botName: "ProdBot",
    einmalpreis: 5990,
    monatspreis: 449,
    features: [
      "Produktkonfigurator",
      "Technische Vorqualifizierung",
      "Angebotsvorbereitung",
      "ERP-Integration",
      "Lead-Scoring & Übergabe"
    ],
    umsetzungWochen: 8,
    zielgruppe: "Produzierende Unternehmen mit komplexen Produkten"
  },
  {
    id: "bildung",
    branche: "Bildung & Weiterbildung",
    botName: "LernBot",
    einmalpreis: 1990,
    monatspreis: 149,
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
    branche: "Standard-Paket",
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

// Unternehmensgrößen-Faktoren
export const COMPANY_SIZE_FACTORS: Record<string, number> = {
  "1-10": 1.0,
  "11-50": 1.2,
  "51-250": 1.5,
  ">250": 2.0
};

// Zeitfaktoren (Dringlichkeit)
export const TIME_FACTORS: Record<string, number> = {
  "sofort": 1.15,
  "1-3-monate": 1.0,
  "3-6-monate": 0.95,
  "offen": 1.0
};

// Hosting-Kosten
export const HOSTING_COSTS = {
  onepager: 12,
  service: 39,
  total: 51
};

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
    "Produktion & Industrie": "industrie",
    "Immobilien": "immobilien",
    "Bildung & Schulung": "bildung",
    "Öffentliche Verwaltung / Kommune": "verwaltung",
    "Vereine & Verbände": "standard",
    "Sonstiges": "standard"
  };

  const paketId = industryMapping[industry] || "standard";
  return branchenPakete.find(p => p.id === paketId) || branchenPakete.find(p => p.id === "standard")!;
}

// Kalkulationslogik
export interface AngebotKalkulation {
  branchenPaket: BranchenPaket;
  basispreis: number;
  unternehmenfaktor: number;
  zeitfaktor: number;
  einmalpreisFinal: number;
  monatspreisFinal: number;
  hostingKosten: number;
  gesamtMonatlich: number;
  umsetzungStart: string;
  umsetzungEnde: string;
}

export function berechneAngebot(
  industry: string,
  companySize: string,
  projectStart: string,
  additionalServices: string[] = []
): AngebotKalkulation {
  const paket = getBranchenPaketByIndustry(industry);
  const unternehmenfaktor = COMPANY_SIZE_FACTORS[companySize] || 1.0;
  const zeitfaktor = TIME_FACTORS[projectStart] || 1.0;

  const einmalpreisFinal = Math.round(paket.einmalpreis * unternehmenfaktor * zeitfaktor);
  const monatspreisFinal = Math.round(paket.monatspreis * unternehmenfaktor);
  
  const hostingKosten = HOSTING_COSTS.total;
  const gesamtMonatlich = monatspreisFinal + hostingKosten;

  // Berechne Umsetzungszeitraum
  const today = new Date();
  const startDate = projectStart === 'sofort' ? today : 
    projectStart === '1-3-monate' ? new Date(today.setMonth(today.getMonth() + 1)) :
    new Date(today.setMonth(today.getMonth() + 3));
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (paket.umsetzungWochen * 7));

  return {
    branchenPaket: paket,
    basispreis: paket.einmalpreis,
    unternehmenfaktor,
    zeitfaktor,
    einmalpreisFinal,
    monatspreisFinal,
    hostingKosten,
    gesamtMonatlich,
    umsetzungStart: startDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
    umsetzungEnde: endDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
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
