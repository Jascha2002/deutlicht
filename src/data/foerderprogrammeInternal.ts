// ============================================================================
// INTERNE FÖRDERPROGRAMM-WISSENSDATENBANK (VERTRAULICH)
// Stand: Anfang 2026
// WICHTIG: Diese Daten sind NUR für interne Beratungsberichte gedacht!
// NICHT öffentlich auf der Website anzeigen!
// Voice Agents behandeln diese Informationen als vertraulich.
// ============================================================================

export interface Foerderprogramm {
  id: string;
  name: string;
  ebene: 'eu' | 'bundesweit' | 'regional';
  region?: string; // z.B. "Thüringen", "Bayern", etc.
  zweck: string;
  zielgruppen: string[];
  foerderhoehe: string;
  foerderart: 'zuschuss' | 'kredit' | 'steuerhilfe' | 'mischform';
  fristenInfo: string;
  voraussetzungen: string[];
  antragsdauer: string;
  auszahlungsInfo: string;
  besonderheiten?: string;
  quellen?: string[];
  status: 'aktiv' | 'auslaufend' | 'abgelaufen';
  letzteAktualisierung: string;
}

// ============================================================================
// A. EUROPÄISCHE FÖRDERPROGRAMME (EU)
// ============================================================================

export const EU_FOERDERPROGRAMME: Foerderprogramm[] = [
  {
    id: 'dep',
    name: 'Digital Europe Programme (DEP)',
    ebene: 'eu',
    zweck: 'Förderung digitaler Technologien: KI, Cybersicherheit, digitale Kompetenzen, E-Infrastrukturen, digitale Transformation von Betrieben/Verwaltungen. DEP ist das zentrale EU-Digitalisierungsprogramm mit einem Gesamtbudget von rund 8,2 Mrd. € für 2021–2027.',
    zielgruppen: ['KMU', 'Start-ups', 'Forschungseinrichtungen', 'Behörden', 'EDIHs (European Digital Innovation Hubs)'],
    foerderhoehe: 'Projektbezogen; anteilige Kofinanzierung häufig erforderlich (z. B. 50% bzw. für KMU 25%)',
    foerderart: 'zuschuss',
    fristenInfo: 'Antragstellung erfolgt nur zu konkreten Calls im EU Funding & Tender Portal. Wichtige Calls 2025/26: AI Continent (SO2) & Advanced Digital Skills (SO4) - Einreichung: 04.11.2025 – 03.03.2026',
    voraussetzungen: [
      'Projektvorschlag muss im Arbeitsprogramm des DEP thematisch passen',
      'Konsortien/Kooperationen häufig gefordert',
      'EU-Registrierung erforderlich (Organisationseintrag im Funding & Tender Portal)'
    ],
    antragsdauer: 'Entscheidungen nach Call-Deadline, meist 3–6 Monate (oft länger bei komplexen Projekten)',
    auszahlungsInfo: 'Nach Vertragsunterzeichnung, Leistungsnachweisen und Berichten. Konkrete Zeitrahmen variieren je nach Call.',
    besonderheiten: 'Keine nationale Vorabzuweisung – Bewerber konkurrieren direkt auf EU-Ebene.',
    quellen: ['EU Digital Europe – Struktur & Antragsmodus', 'EU Funding & Tender Portal'],
    status: 'aktiv',
    letzteAktualisierung: '2026-01'
  },
  {
    id: 'horizon-europe-cluster4',
    name: 'Horizon Europe – Cluster 4 „Digitalisierung, Industrie & Raumfahrt"',
    ebene: 'eu',
    zweck: 'Teil von Horizon Europe, dem größten EU-Forschungs- und Innovationsprogramm (~95,5 Mrd. € 2021–2027). Cluster 4 deckt digitale Technologien, AI, Datentechnologien sowie Digitalisierung in Industrie/Produkten ab.',
    zielgruppen: ['Forschungseinrichtungen', 'Große Unternehmen', 'KMU im F&E-Kontext', 'Hochschulen'],
    foerderhoehe: 'Bis zu 100% der förderfähigen Kosten in Forschungsprojekten; meist große Konsortialprojekte',
    foerderart: 'zuschuss',
    fristenInfo: 'Arbeitspaket-Calls laufen 2026; z. B. Ausschreibungen zu Web4.0-Architektur/virtuelle Welten mit Einreichung im Januar 2026',
    voraussetzungen: [
      'Projekt muss innovativen F&E-Charakter haben',
      'Internationale Konsortien oft gefordert',
      'EU-Registrierung erforderlich'
    ],
    antragsdauer: 'Antrag → Entscheidung meist 6–9+ Monate (Komplexität und Konsortienkoordination verlängert Prozess)',
    auszahlungsInfo: 'Abhängig von Projektfortschritt und EU-Vertragsbedingungen',
    quellen: ['EU Horizon Europe – Forschung & Ausschreibungsbudget'],
    status: 'aktiv',
    letzteAktualisierung: '2026-01'
  },
  {
    id: 'ngi-calls',
    name: 'NGI-Calls (Next Generation Internet)',
    ebene: 'eu',
    zweck: 'Förderung für offene Standards, Open Internet Stack – relevant für Entwickler/Innovationsprojekte mit Open-Source-Bezug',
    zielgruppen: ['Entwickler', 'Start-ups', 'Open-Source-Projekte', 'Forschungseinrichtungen'],
    foerderhoehe: 'Projektbezogen, variiert nach Call',
    foerderart: 'zuschuss',
    fristenInfo: 'Deadlines z. B. 01.02.2026 bis 15.04.2026',
    voraussetzungen: [
      'Open-Source oder offene Standards Bezug',
      'Innovative Lösungen für das Internet der Zukunft'
    ],
    antragsdauer: 'Variiert je nach Call',
    auszahlungsInfo: 'Nach Projektfortschritt und Meilensteinen',
    status: 'aktiv',
    letzteAktualisierung: '2026-01'
  }
];

// ============================================================================
// B. BUNDESWEITE FÖRDERPROGRAMME (DEUTSCHLAND)
// ============================================================================

export const BUNDESWEITE_FOERDERPROGRAMME: Foerderprogramm[] = [
  {
    id: 'bafa-digitalisierung',
    name: 'BAFA Digitalisierungsberatung',
    ebene: 'bundesweit',
    zweck: 'Förderung externer Beratungsleistungen zur Digitalisierung (Strategie, IT-Einführung, AI-Einsatz)',
    zielgruppen: ['KMU', 'Neugründungen', 'Junge Unternehmen'],
    foerderhoehe: 'Bis 80% in neuen Bundesländern, bis 50% im Westen; gedeckelt nach Bundesrichtlinie',
    foerderart: 'zuschuss',
    fristenInfo: 'Anträge laufend möglich bis 31.12.2026',
    voraussetzungen: [
      'Durchführung mit BAFA-zertifizierten Beratern',
      'Beratung darf vor Antragstellung nicht begonnen worden sein',
      'KMU-Kriterien müssen erfüllt sein'
    ],
    antragsdauer: 'Bearbeitung Bundesbehörde üblich innerhalb weniger Wochen',
    auszahlungsInfo: 'Nach Abschluss der Beratung und Einreichung der Unterlagen',
    status: 'aktiv',
    letzteAktualisierung: '2026-01'
  },
  {
    id: 'forschungszulage',
    name: 'Steuerliche Forschungszulage',
    ebene: 'bundesweit',
    zweck: 'Steuerliche Förderung von F&E, auch Softwareentwicklung im Digitalbereich',
    zielgruppen: ['Alle Unternehmen mit F&E-Aktivitäten', 'Softwareentwickler', 'Digitalunternehmen'],
    foerderhoehe: 'Steuerliche Gutschrift von bis zu 25% förderfähiger Ausgaben, bis zu mehreren Millionen EUR pro Jahr',
    foerderart: 'steuerhilfe',
    fristenInfo: 'Kann rückwirkend beantragt werden (meist für Vorjahre)',
    voraussetzungen: [
      'Nachweis von Forschungsprojekten über Bescheinigungsstelle',
      'Anschließend Antrag über ELSTER'
    ],
    antragsdauer: 'Bearbeitung Finanzamt teils mehrere Wochen bis Monate',
    auszahlungsInfo: 'Verrechnung mit Steuerschuld oder Auszahlung bei negativer Steuerlast',
    status: 'aktiv',
    letzteAktualisierung: '2026-01'
  }
];

// ============================================================================
// C. REGIONALE FÖRDERPROGRAMME (BEISPIEL THÜRINGEN)
// ============================================================================

export const REGIONALE_FOERDERPROGRAMME: Foerderprogramm[] = [
  {
    id: 'digitalbonus-thueringen',
    name: 'Digitalbonus Thüringen',
    ebene: 'regional',
    region: 'Thüringen',
    zweck: 'Unterstützung von KMU bei der Digitalisierung von Betriebsprozessen, Produkten und Dienstleistungen sowie bei der Verbesserung von Informations- und Datensicherheitslösungen. Gefördert werden Investitionen in Software, Hardware, IT-Sicherheitslösungen und externe Dienstleistungen.',
    zielgruppen: [
      'KMU der gewerblichen Wirtschaft',
      'Verarbeitendes Gewerbe',
      'Unternehmensnahe Dienstleistungen',
      'Baugewerbe',
      'Handwerk',
      'Handel',
      'Gastgewerbe',
      'Veranstaltungswirtschaft',
      'Kreativwirtschaftliche Freie Berufe'
    ],
    foerderhoehe: 'Bis zu 50% der förderfähigen Ausgaben, max. 15.000 EUR. Zuwendungsfähige Ausgaben: min. 5.000 EUR, max. 150.000 EUR',
    foerderart: 'zuschuss',
    fristenInfo: 'Laufend beantragbar. Projekt darf erst 1 Tag nach Antragseingang im Thüringer Förderportal begonnen werden. Abschluss innerhalb eines Jahres.',
    voraussetzungen: [
      'KMU gemäß EU-Definition',
      'Vorhaben muss in Thüringen durchgeführt werden',
      'Konzept mit Beschreibung des Digitalisierungsfortschritts erforderlich',
      'Gesamtfinanzierung muss gesichert sein',
      'Tragfähige Vollexistenz mit nachhaltigem wirtschaftlichen Erfolg',
      'De-minimis-Beihilfe (max. 2 Anträge pro Unternehmen)'
    ],
    antragsdauer: 'Bearbeitung durch TAB üblicherweise wenige Wochen',
    auszahlungsInfo: 'Nach Projektabschluss und Verwendungsnachweis',
    besonderheiten: 'Förderung über Thüringer Aufbaubank (TAB). Ansprechpartner: Gorkistraße 9, 99084 Erfurt, Tel: +49 361 7447-0',
    quellen: ['Thüringer Förderportal', 'TMWLLR Richtlinie Digitalbonus'],
    status: 'aktiv',
    letzteAktualisierung: '2026-02'
  },
  {
    id: 'esf-plus-thueringen',
    name: 'ESF+ Regionalförderung Thüringen',
    ebene: 'regional',
    region: 'Thüringen',
    zweck: 'Teil des European Social Fund Plus (ESF+) der EU, umgesetzt auf Landesebene zur Förderung von Aus-/Weiterbildung, digitalen Kompetenzen, Beschäftigungsmaßnahmen',
    zielgruppen: ['Breite Branchen', 'Digitalwirtschaft', 'KMU', 'Bildungsträger'],
    foerderhoehe: 'Unterschiedlich je Maßnahme; projektbezogene Richtlinien',
    foerderart: 'zuschuss',
    fristenInfo: 'Laufend bis 31.12.2027 im Rahmen des Programms; Anträge je nach Ausschreibung',
    voraussetzungen: [
      'Projekt muss Zielsetzungen von ESF+ erfüllen (z. B. Qualifizierung, Beschäftigung, Lernprozesse)',
      'Sitz oder Wirkung in Thüringen'
    ],
    antragsdauer: 'Variiert je nach Ausschreibung',
    auszahlungsInfo: 'Nach Projektfortschritt und Verwendungsnachweis',
    quellen: ['Thüringen ESF+ Regionalprogramm'],
    status: 'aktiv',
    letzteAktualisierung: '2026-01'
  },
  {
    id: 'thueringer-technologie',
    name: 'Regionale Technologie- und Innovationsförderung Thüringen',
    ebene: 'regional',
    region: 'Thüringen',
    zweck: 'Innovationsgutscheine, Technologieförderung über Thüringer Ministerien – themenspezifische Programme',
    zielgruppen: ['KMU', 'Technologieunternehmen', 'Innovationsprojekte'],
    foerderhoehe: 'Variiert je nach Programm und Maßnahme',
    foerderart: 'zuschuss',
    fristenInfo: 'Individuelle Recherche über Thüringer Förderportal erforderlich',
    voraussetzungen: [
      'Sitz in Thüringen',
      'Innovativer Charakter des Projekts'
    ],
    antragsdauer: 'Variiert je nach Programm',
    auszahlungsInfo: 'Nach Projektabschluss oder in Tranchen',
    status: 'aktiv',
    letzteAktualisierung: '2026-01'
  }
];

// ============================================================================
// AUSLAUFENDE PROGRAMME (zur Dokumentation)
// ============================================================================

export const AUSGELAUFENE_PROGRAMME: Foerderprogramm[] = [
  {
    id: 'go-digital',
    name: 'go-digital (BMWi)',
    ebene: 'bundesweit',
    zweck: 'Ehemaliges Programm zur Förderung von Digitalisierungsberatung',
    zielgruppen: ['KMU'],
    foerderhoehe: 'Bis 50% der Beratungskosten, max. 16.500 EUR',
    foerderart: 'zuschuss',
    fristenInfo: 'PROGRAMM AUSGELAUFEN',
    voraussetzungen: ['Nicht mehr anwendbar'],
    antragsdauer: 'Nicht mehr anwendbar',
    auszahlungsInfo: 'Nicht mehr anwendbar',
    besonderheiten: 'Das Programm go-digital wurde eingestellt und ist nicht mehr verfügbar. Alternative: BAFA Digitalisierungsberatung',
    status: 'abgelaufen',
    letzteAktualisierung: '2026-01'
  },
  {
    id: 'digital-jetzt',
    name: 'Digital Jetzt (BMWi)',
    ebene: 'bundesweit',
    zweck: 'Ehemaliges Programm zur Förderung der Digitalisierung von KMU',
    zielgruppen: ['KMU'],
    foerderhoehe: 'Bis 50% Zuschuss, max. 50.000 EUR',
    foerderart: 'zuschuss',
    fristenInfo: 'PROGRAMM AUSGELAUFEN seit 31.12.2023',
    voraussetzungen: ['Nicht mehr anwendbar'],
    antragsdauer: 'Nicht mehr anwendbar',
    auszahlungsInfo: 'Nicht mehr anwendbar',
    besonderheiten: 'Das Programm "Digital Jetzt" war bis zum 31. Dezember 2023 befristet und ist nicht mehr verfügbar. Alternative: Digitalbonus Thüringen (für Thüringer Unternehmen) oder BAFA Digitalisierungsberatung',
    status: 'abgelaufen',
    letzteAktualisierung: '2026-02'
  }
];

// ============================================================================
// ÜBERSICHT NACH FÖRDERFORM
// ============================================================================

export type FoerderformTyp = 'zuschuss' | 'kredit' | 'steuerhilfe';

export const FOERDERFORM_UEBERSICHT: Record<string, FoerderformTyp[]> = {
  'Digital Europe Programme': ['zuschuss'],
  'Horizon Europe': ['zuschuss'],
  'NGI/Open Calls': ['zuschuss'],
  'BAFA Digitalisierungsberatung': ['zuschuss'],
  'Steuerliche Forschungszulage': ['steuerhilfe']
};

// ============================================================================
// HELPER-FUNKTIONEN
// ============================================================================

/**
 * Ermittelt relevante Förderprogramme basierend auf Region
 * WICHTIG: Diese Funktion ist nur für interne Beratungsberichte!
 */
export function getFoerderprogrammeNachRegion(region?: string): Foerderprogramm[] {
  const alleProgramme = [
    ...EU_FOERDERPROGRAMME,
    ...BUNDESWEITE_FOERDERPROGRAMME,
    ...REGIONALE_FOERDERPROGRAMME.filter(p => 
      !region || p.region?.toLowerCase() === region.toLowerCase()
    )
  ];
  
  return alleProgramme.filter(p => p.status === 'aktiv');
}

/**
 * Generiert einen Förderhinweis-Text für Berichte
 * NICHT für öffentliche Anzeige gedacht!
 */
export function generiereIntererFoerderhinweis(region?: string): string {
  const programme = getFoerderprogrammeNachRegion(region);
  
  const euProgramme = programme.filter(p => p.ebene === 'eu');
  const bundesProgramme = programme.filter(p => p.ebene === 'bundesweit');
  const regionalProgramme = programme.filter(p => p.ebene === 'regional');
  
  let text = `Fördermöglichkeiten (Stand ${new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}):\n\n`;
  
  if (euProgramme.length > 0) {
    text += `EU-Ebene:\n`;
    euProgramme.forEach(p => {
      text += `• ${p.name}: ${p.foerderhoehe}\n`;
    });
    text += '\n';
  }
  
  if (bundesProgramme.length > 0) {
    text += `Bundesweit:\n`;
    bundesProgramme.forEach(p => {
      text += `• ${p.name}: ${p.foerderhoehe}\n`;
    });
    text += '\n';
  }
  
  if (regionalProgramme.length > 0) {
    text += `Regional${region ? ` (${region})` : ''}:\n`;
    regionalProgramme.forEach(p => {
      text += `• ${p.name}: ${p.foerderhoehe}\n`;
    });
    text += '\n';
  }
  
  text += `\nHinweis: Die konkreten Fördermöglichkeiten werden im Rahmen einer individuellen Förderberatung ermittelt. Die Förderlandschaft ist dynamisch und unterliegt regelmäßigen Änderungen.`;
  
  return text;
}

/**
 * Prüft ob ein Programm noch aktiv ist
 */
export function isProgrammAktiv(programmId: string): boolean {
  const alleProgramme = [
    ...EU_FOERDERPROGRAMME,
    ...BUNDESWEITE_FOERDERPROGRAMME,
    ...REGIONALE_FOERDERPROGRAMME,
    ...AUSGELAUFENE_PROGRAMME
  ];
  
  const programm = alleProgramme.find(p => p.id === programmId);
  return programm?.status === 'aktiv';
}

// ============================================================================
// WICHTIGER HINWEIS FÜR ENTWICKLER
// ============================================================================
// Diese Daten sind VERTRAULICH und nur für interne Beratungsberichte gedacht!
// - NICHT auf der öffentlichen Website anzeigen
// - Voice Agents dürfen diese Details NICHT preisgeben
// - Nur im Rahmen von Beratungsberichten verwenden
// - Bei Anfragen auf individuelle Förderberatung verweisen
// ============================================================================
