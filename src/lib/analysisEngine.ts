// Analyse-Engine & Empfehlungs-Generator für die Digitalisierungs-Analyse

// =============================================
// TYPEN
// =============================================

export interface Empfehlung {
  id: string;
  titel: string;
  bereich: string;
  beschreibung: string;
  nutzen: string;
  aufwand: 'klein' | 'mittel' | 'mittel-groß' | 'groß';
  kosten: string;
  prioritaet: 'niedrig' | 'mittel' | 'hoch';
  zeitraum: 'sofort' | 'mittel' | 'langfristig';
  foerderrelevant: 'ja' | 'nein' | 'teilweise';
  foerderbgruendung?: string;
}

export interface BereichsAnalyse {
  name: string;
  label: string;
  bewertung: 'kritisch' | 'ausbaufaehig' | 'reif';
  score: number;
  staerken: string[];
  schwaechen: string[];
  empfehlungen: Empfehlung[];
}

export interface GesamtAnalyse {
  bereiche: {
    online: BereichsAnalyse;
    systeme: BereichsAnalyse;
    prozesse: BereichsAnalyse;
    daten: BereichsAnalyse;
    social: BereichsAnalyse;
    reporting: BereichsAnalyse;
    schulung: BereichsAnalyse;
  };
  staerken: string[];
  schwaechen: string[];
  empfehlungen: Empfehlung[];
  bewertungen: Record<string, string>;
  gesamtscore: number;
}

// Client-Daten Interfaces
export interface StammdatenData {
  unternehmensname?: string;
  branche?: string;
  mitarbeiterzahl?: number;
}

export interface OnlineData {
  website_vorhanden?: string;
  website_url?: string;
  website_cms?: string;
  website_responsive?: string;
  website_https?: string;
  website_ladezeit?: string;
  website_aktualisierung?: string;
  seo_aktiv_betrieben?: string;
  shop_vorhanden?: string;
  shop_erp_anbindung?: boolean;
  buchungssystem_vorhanden?: boolean;
}

export interface SystemeData {
  crm_vorhanden?: string;
  crm_system?: string;
  crm_datenpflege?: string;
  crm_integration_email?: boolean;
  erp_vorhanden?: string;
  erp_system?: string;
  erp_integration_crm?: boolean;
  erp_integration_shop?: boolean;
  dms_vorhanden?: string;
  dms_system?: string;
  pm_tool_vorhanden?: boolean;
  zeiterfassung_vorhanden?: boolean;
}

export interface ProzesseData {
  vertrieb_angebotserstellung?: string;
  vertrieb_nachverfolgung?: string;
  auftragserfassung?: string;
  auftragsbearbeitung_medienbruch?: boolean;
  rechnungsstellung?: string;
  dokumente_vorlagen?: string;
  dokumente_ablage?: string;
  service_ticket_system?: boolean;
}

export interface DatenData {
  backup_vorhanden?: string;
  backup_frequenz?: string;
  backup_automatisiert?: boolean;
  backup_getestet?: string;
  firewall_vorhanden?: boolean;
  antivirus_vorhanden?: boolean;
  zwei_faktor_auth?: string;
  passwort_manager?: string;
  daten_ordnerstruktur?: string;
  dsgvo_verzeichnis_vorhanden?: boolean;
}

export interface SocialData {
  kanaele_aktiv?: string[];
  content_ersteller?: string;
  content_redaktionsplan?: boolean;
  newsletter_vorhanden?: boolean;
  newsletter_tool?: string;
  online_werbung_aktiv?: boolean;
}

export interface ReportingData {
  kennzahlen_erfasst?: boolean;
  dashboard_vorhanden?: boolean;
  reporting_frequenz?: string;
  reporting_automatisiert?: string;
  datenqualitaet?: string;
}

export interface SchulungData {
  onboarding_prozess?: string;
  onboarding_dokumentiert?: boolean;
  arbeitsanweisungen_vorhanden?: boolean;
  wissensdatenbank_vorhanden?: boolean;
  schulungen_regelmaessig?: boolean;
}

export interface ClientData {
  stammdaten: StammdatenData;
  online: OnlineData;
  systeme: SystemeData;
  prozesse: ProzesseData;
  daten: DatenData;
  social: SocialData;
  reporting: ReportingData;
  schulung: SchulungData;
}

// =============================================
// ANALYSE-FUNKTIONEN
// =============================================

function createBaseResult(name: string, label: string): BereichsAnalyse {
  return {
    name,
    label,
    bewertung: 'ausbaufaehig',
    score: 50,
    staerken: [],
    schwaechen: [],
    empfehlungen: []
  };
}

function finalBewertung(result: BereichsAnalyse): BereichsAnalyse {
  if (result.score >= 70) result.bewertung = 'reif';
  else if (result.score >= 40) result.bewertung = 'ausbaufaehig';
  else result.bewertung = 'kritisch';
  return result;
}

// === ONLINE-AUFTRITT ===
export function analyzeOnline(data: OnlineData, stammdaten?: StammdatenData): BereichsAnalyse {
  const result = createBaseResult('online', 'Online-Auftritt');

  // Website vorhanden?
  if (!data.website_vorhanden || data.website_vorhanden === 'Nein') {
    result.schwaechen.push('Keine Website vorhanden');
    result.score -= 30;
    result.bewertung = 'kritisch';
    result.empfehlungen.push({
      id: 'web_01',
      titel: 'Professionelle Website erstellen',
      bereich: 'Online-Auftritt',
      beschreibung: 'Moderne, responsive Website mit Content Management System (CMS) erstellen. Fokus auf Benutzerfreundlichkeit, schnelle Ladezeiten und Mobiloptimierung.',
      nutzen: 'Erhöhte Sichtbarkeit im Internet, professioneller Außenauftritt, Neukundengewinnung rund um die Uhr, Vertrauensbildung bei potenziellen Kunden.',
      aufwand: 'mittel',
      kosten: '2.000 - 8.000 €',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'ja',
      foerderbgruendung: 'Digitale Präsenz ist förderfähig im Rahmen von "Digitalisierung KMU" und "go-digital".'
    });
  } else {
    result.staerken.push('Website vorhanden');
    result.score += 10;
  }

  // Responsiveness
  if (data.website_responsive === 'Nein') {
    result.schwaechen.push('Website nicht mobiloptimiert');
    result.score -= 15;
    result.empfehlungen.push({
      id: 'web_02',
      titel: 'Website mobiloptimiert gestalten',
      bereich: 'Online-Auftritt',
      beschreibung: 'Website für mobile Endgeräte (Smartphones, Tablets) optimieren. Responsive Design implementieren.',
      nutzen: 'Über 60% der Website-Besucher nutzen mobile Geräte. Bessere Nutzererfahrung, höhere Conversion-Rate, besseres Google-Ranking.',
      aufwand: 'mittel',
      kosten: '1.500 - 3.000 €',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'ja'
    });
  } else if (data.website_responsive === 'Ja') {
    result.staerken.push('Website ist mobiloptimiert');
    result.score += 10;
  }

  // HTTPS
  if (data.website_https === 'Nein') {
    result.schwaechen.push('Website nicht SSL-verschlüsselt');
    result.score -= 10;
    result.bewertung = 'kritisch';
    result.empfehlungen.push({
      id: 'web_03',
      titel: 'SSL-Zertifikat einrichten (HTTPS)',
      bereich: 'Online-Auftritt',
      beschreibung: 'SSL-Zertifikat für die Website einrichten, um verschlüsselte Verbindungen zu ermöglichen.',
      nutzen: 'Sicherheit für Besucher, Vertrauensbildung, besseres Google-Ranking (HTTPS ist Ranking-Faktor), Vermeidung von Browser-Warnungen.',
      aufwand: 'klein',
      kosten: '0 - 200 €/Jahr',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  } else if (data.website_https === 'Ja') {
    result.staerken.push('Website ist SSL-verschlüsselt (HTTPS)');
    result.score += 5;
  }

  // Ladezeit
  if (data.website_ladezeit === 'langsam') {
    result.schwaechen.push('Website lädt langsam');
    result.score -= 10;
    result.empfehlungen.push({
      id: 'web_04',
      titel: 'Website-Performance optimieren',
      bereich: 'Online-Auftritt',
      beschreibung: 'Ladezeiten durch Bildoptimierung, Caching, CDN und Code-Optimierung verbessern.',
      nutzen: 'Bessere Nutzererfahrung, geringere Absprungrate, besseres Google-Ranking. Jede Sekunde Ladezeit kostet ca. 7% Conversion.',
      aufwand: 'mittel',
      kosten: '500 - 2.000 €',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'teilweise'
    });
  }

  // Aktualisierung
  if (data.website_aktualisierung === 'Seltener' || data.website_aktualisierung === 'Nie') {
    result.schwaechen.push('Website wird nicht regelmäßig aktualisiert');
    result.score -= 8;
    result.empfehlungen.push({
      id: 'web_05',
      titel: 'Redaktionsplan für Website etablieren',
      bereich: 'Online-Auftritt',
      beschreibung: 'Regelmäßige Content-Updates planen und umsetzen. Blog, News oder FAQ-Bereich einrichten.',
      nutzen: 'Besseres Google-Ranking durch frischen Content, mehr Besucherinteraktionen, Expertenstatus aufbauen.',
      aufwand: 'klein',
      kosten: 'laufende Personalkosten',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'nein'
    });
  }

  // SEO
  if (data.seo_aktiv_betrieben === 'Nein' || !data.seo_aktiv_betrieben) {
    result.schwaechen.push('Kein aktives SEO betrieben');
    result.score -= 10;
    result.empfehlungen.push({
      id: 'web_06',
      titel: 'SEO-Strategie entwickeln und umsetzen',
      bereich: 'Online-Auftritt',
      beschreibung: 'Keyword-Recherche, On-Page-Optimierung, technisches SEO, Backlink-Aufbau. Google My Business optimieren.',
      nutzen: 'Höhere Sichtbarkeit in Suchmaschinen, mehr organischer Traffic, Reduktion von Werbekosten, nachhaltige Kundengewinnung.',
      aufwand: 'mittel-groß',
      kosten: '500 - 2.000 €/Monat',
      prioritaet: 'hoch',
      zeitraum: 'mittel',
      foerderrelevant: 'ja'
    });
  } else if (data.seo_aktiv_betrieben === 'Ja') {
    result.staerken.push('SEO wird aktiv betrieben');
    result.score += 10;
  }

  // Online-Shop
  if (data.shop_vorhanden === 'Ja') {
    result.staerken.push('Online-Shop vorhanden');
    result.score += 15;

    if (!data.shop_erp_anbindung) {
      result.schwaechen.push('Shop nicht an ERP angebunden');
      result.score -= 8;
      result.empfehlungen.push({
        id: 'web_07',
        titel: 'Shop-ERP-Integration herstellen',
        bereich: 'Online-Auftritt',
        beschreibung: 'Automatische Synchronisation von Beständen, Preisen und Bestellungen zwischen Shop und ERP/Warenwirtschaft.',
        nutzen: 'Keine manuelle Doppelerfassung, Echtzeit-Bestandsübersicht, weniger Fehler, schnellere Auftragsabwicklung.',
        aufwand: 'mittel-groß',
        kosten: '2.000 - 10.000 €',
        prioritaet: 'hoch',
        zeitraum: 'mittel',
        foerderrelevant: 'ja'
      });
    }
  } else if (data.shop_vorhanden === 'Geplant') {
    result.empfehlungen.push({
      id: 'web_08',
      titel: 'Online-Shop realisieren',
      bereich: 'Online-Auftritt',
      beschreibung: 'Professionellen Online-Shop auf Basis moderner Shop-Software (z.B. Shopify, WooCommerce, Shopware) aufbauen.',
      nutzen: 'Zusätzlicher Vertriebskanal, 24/7-Verkauf, Reichweitenerweiterung, Skalierbarkeit, Wettbewerbsfähigkeit.',
      aufwand: 'groß',
      kosten: '5.000 - 30.000 €',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'ja'
    });
  }

  // Buchungssystem
  const dienstleistungsBranchen = ['Dienstleistung', 'Gesundheitswesen', 'Beratung', 'Bildung & Schulung'];
  if (!data.buchungssystem_vorhanden && stammdaten?.branche && dienstleistungsBranchen.includes(stammdaten.branche)) {
    result.empfehlungen.push({
      id: 'web_09',
      titel: 'Online-Buchungssystem einführen',
      bereich: 'Online-Auftritt',
      beschreibung: 'Tool für Online-Terminbuchung (z.B. Calendly, SimplyBook) integrieren.',
      nutzen: 'Kunden können selbst Termine buchen, Reduktion von Telefon-Ping-Pong, weniger No-Shows durch automatische Erinnerungen.',
      aufwand: 'klein',
      kosten: '10 - 50 €/Monat',
      prioritaet: 'mittel',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  }

  return finalBewertung(result);
}

// === SYSTEME ===
export function analyzeSysteme(data: SystemeData): BereichsAnalyse {
  const result = createBaseResult('systeme', 'Systeme & Software');

  // CRM
  if (!data.crm_vorhanden || data.crm_vorhanden === 'Nein') {
    result.schwaechen.push('Kein CRM-System im Einsatz');
    result.score -= 20;
    result.bewertung = 'kritisch';
    result.empfehlungen.push({
      id: 'sys_01',
      titel: 'CRM-System einführen',
      bereich: 'Systeme',
      beschreibung: 'Professionelles Customer Relationship Management System zur zentralen Verwaltung von Kundenkontakten, Angeboten, Projekten und Kommunikation einführen (z.B. HubSpot, Pipedrive, Zoho).',
      nutzen: 'Zentrale Datenhaltung, keine verstreuten Excel-Listen, bessere Nachverfolgung von Leads, automatische Erinnerungen, Team-Transparenz, höhere Abschlussquoten.',
      aufwand: 'mittel',
      kosten: '20 - 100 €/Monat pro Nutzer',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'ja'
    });
  } else if (data.crm_system === 'Excel/Tabellen') {
    result.schwaechen.push('CRM wird über Excel geführt');
    result.score -= 15;
    result.empfehlungen.push({
      id: 'sys_02',
      titel: 'Von Excel auf professionelles CRM migrieren',
      bereich: 'Systeme',
      beschreibung: 'Bestehende Excel-Tabellen in ein professionelles CRM-System überführen.',
      nutzen: 'Weniger Fehler, automatische Workflows, bessere Auswertungen, Multi-User-Fähigkeit, mobile Nutzung.',
      aufwand: 'mittel',
      kosten: '1.000 - 3.000 € Einrichtung + lfd. Kosten',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'ja'
    });
  } else {
    result.staerken.push('CRM-System vorhanden');
    result.score += 15;

    if (data.crm_datenpflege === 'Mangelhaft' || data.crm_datenpflege === 'Ungenügend') {
      result.schwaechen.push('CRM-Datenqualität mangelhaft');
      result.score -= 8;
      result.empfehlungen.push({
        id: 'sys_03',
        titel: 'CRM-Datenpflege-Prozess etablieren',
        bereich: 'Systeme',
        beschreibung: 'Regeln für Datenpflege definieren, Schulungen durchführen, regelmäßige Datenbereinigung einplanen.',
        nutzen: 'Verlässliche Daten für Entscheidungen, bessere Auswertungen, effizientere Arbeit.',
        aufwand: 'klein',
        kosten: 'interne Arbeitszeit',
        prioritaet: 'mittel',
        zeitraum: 'sofort',
        foerderrelevant: 'nein'
      });
    }
  }

  // ERP
  if (!data.erp_vorhanden || data.erp_vorhanden === 'Nein') {
    result.schwaechen.push('Kein ERP-System vorhanden');
    result.score -= 15;
    result.empfehlungen.push({
      id: 'sys_04',
      titel: 'ERP/Warenwirtschaft einführen',
      bereich: 'Systeme',
      beschreibung: 'Enterprise Resource Planning System zur Steuerung von Auftragsabwicklung, Lager, Einkauf, eventuell Produktion einführen.',
      nutzen: 'Durchgängige Prozesse von Angebot bis Rechnung, Echtzeit-Bestandsübersicht, weniger Fehler, automatisierte Workflows.',
      aufwand: 'groß',
      kosten: '5.000 - 50.000 € je nach Umfang',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'ja'
    });
  } else {
    result.staerken.push('ERP/Warenwirtschaft vorhanden');
    result.score += 15;

    if (!data.erp_integration_crm) {
      result.schwaechen.push('ERP und CRM nicht integriert');
      result.score -= 10;
      result.empfehlungen.push({
        id: 'sys_05',
        titel: 'CRM-ERP-Integration herstellen',
        bereich: 'Systeme',
        beschreibung: 'Schnittstelle zwischen CRM und ERP aufbauen, sodass Daten automatisch synchronisiert werden.',
        nutzen: 'Keine Doppelerfassung, weniger Fehler, durchgängiger Datenfluss vom Lead bis zur Rechnung.',
        aufwand: 'mittel-groß',
        kosten: '2.000 - 15.000 €',
        prioritaet: 'hoch',
        zeitraum: 'mittel',
        foerderrelevant: 'ja'
      });
    }
  }

  // DMS
  if (!data.dms_vorhanden || data.dms_vorhanden === 'Nein') {
    result.schwaechen.push('Kein Dokumentenmanagementsystem (DMS)');
    result.score -= 15;
    result.empfehlungen.push({
      id: 'sys_06',
      titel: 'Dokumentenmanagementsystem (DMS) einführen',
      bereich: 'Systeme',
      beschreibung: 'Zentrale, strukturierte Ablage aller Dokumente mit Versionierung, Suche und Berechtigungen (z.B. SharePoint, Nextcloud, DocuWare).',
      nutzen: 'Weniger Suchzeit, revisionssichere Ablage, Versionskontrolle, Zugriffsschutz, ortsunabhängiger Zugriff.',
      aufwand: 'mittel',
      kosten: '1.000 - 10.000 € + lfd. Kosten',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'ja'
    });
  } else {
    result.staerken.push('DMS vorhanden');
    result.score += 10;
  }

  // Projektmanagement
  if (!data.pm_tool_vorhanden) {
    result.empfehlungen.push({
      id: 'sys_07',
      titel: 'Projektmanagement-Tool einführen',
      bereich: 'Systeme',
      beschreibung: 'Tool zur strukturierten Projektverwaltung (z.B. Asana, Trello, Monday.com) einführen.',
      nutzen: 'Bessere Übersicht über Projekte, klare Verantwortlichkeiten, Termintreue, Team-Kollaboration.',
      aufwand: 'klein',
      kosten: '10 - 30 €/Monat pro Nutzer',
      prioritaet: 'mittel',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  }

  // Zeiterfassung
  if (!data.zeiterfassung_vorhanden) {
    result.empfehlungen.push({
      id: 'sys_08',
      titel: 'Digitale Zeiterfassung einführen',
      bereich: 'Systeme',
      beschreibung: 'Tool zur digitalen Erfassung von Arbeitszeiten (z.B. Clockodo, Toggl) einführen.',
      nutzen: 'Transparenz über Arbeitszeiten, Grundlage für Projektabrechnung, gesetzliche Pflicht zur Zeiterfassung.',
      aufwand: 'klein',
      kosten: '5 - 15 €/Monat pro Nutzer',
      prioritaet: 'mittel',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  }

  return finalBewertung(result);
}

// === PROZESSE ===
export function analyzeProzesse(data: ProzesseData): BereichsAnalyse {
  const result = createBaseResult('prozesse', 'Prozesse & Workflows');

  // Angebotserstellung
  if (data.vertrieb_angebotserstellung === 'Komplett manuell') {
    result.schwaechen.push('Angebote werden komplett manuell erstellt');
    result.score -= 12;
    result.empfehlungen.push({
      id: 'proz_01',
      titel: 'Angebotserstellung automatisieren',
      bereich: 'Prozesse',
      beschreibung: 'Angebotsvorlagen erstellen, Produktkatalog pflegen, automatische Preisberechnung implementieren.',
      nutzen: 'Zeitersparnis pro Angebot: 30-60 Minuten, weniger Fehler, professionelles Erscheinungsbild, schnellere Reaktionszeit.',
      aufwand: 'mittel',
      kosten: '2.000 - 5.000 €',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'ja'
    });
  } else if (data.vertrieb_angebotserstellung === 'Vollautomatisch (CRM/ERP)') {
    result.staerken.push('Automatisierte Angebotserstellung');
    result.score += 10;
  }

  // Medienbrüche
  if (data.auftragsbearbeitung_medienbruch) {
    result.schwaechen.push('Medienbrüche in der Auftragsabwicklung');
    result.score -= 15;
    result.bewertung = 'kritisch';
    result.empfehlungen.push({
      id: 'proz_02',
      titel: 'Durchgängige digitale Prozesse schaffen',
      bereich: 'Prozesse',
      beschreibung: 'Medienbrüche (z.B. Ausdrucken, Abtippen, Fax) eliminieren. Digitale Durchgängigkeit von Anfrage bis Rechnung sicherstellen.',
      nutzen: 'Massive Zeitersparnis, weniger Fehler durch manuelle Übertragung, schnellere Durchlaufzeiten.',
      aufwand: 'groß',
      kosten: 'abhängig von Systemlandschaft',
      prioritaet: 'hoch',
      zeitraum: 'mittel',
      foerderrelevant: 'ja'
    });
  } else {
    result.staerken.push('Keine Medienbrüche in der Auftragsabwicklung');
    result.score += 10;
  }

  // Rechnungsstellung
  if (data.rechnungsstellung === 'Manuell') {
    result.schwaechen.push('Manuelle Rechnungserstellung');
    result.score -= 10;
    result.empfehlungen.push({
      id: 'proz_03',
      titel: 'Rechnungsstellung automatisieren',
      bereich: 'Prozesse',
      beschreibung: 'Automatische Rechnungserstellung aus ERP/CRM-Daten, optimalerweise per Knopfdruck oder vollautomatisch.',
      nutzen: 'Zeitersparnis, schnellerer Geldeingang, weniger Fehler, besserer Cash-Flow.',
      aufwand: 'klein',
      kosten: '500 - 3.000 €',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'ja'
    });
  } else if (data.rechnungsstellung === 'Vollautomatisch') {
    result.staerken.push('Vollautomatische Rechnungsstellung');
    result.score += 10;
  }

  // Dokumentenvorlagen
  if (!data.dokumente_vorlagen || data.dokumente_vorlagen === 'keine') {
    result.schwaechen.push('Keine standardisierten Dokumentenvorlagen');
    result.score -= 8;
    result.empfehlungen.push({
      id: 'proz_04',
      titel: 'Dokumentenvorlagen standardisieren',
      bereich: 'Prozesse',
      beschreibung: 'Professionelle Vorlagen für Angebote, Rechnungen, Verträge, Protokolle erstellen und im System hinterlegen.',
      nutzen: 'Professionelles Erscheinungsbild, Zeitersparnis, Corporate Identity einhalten.',
      aufwand: 'klein',
      kosten: '500 - 2.000 €',
      prioritaet: 'mittel',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  } else if (data.dokumente_vorlagen === 'Vorhanden') {
    result.staerken.push('Standardisierte Dokumentenvorlagen vorhanden');
    result.score += 5;
  }

  // Service/Support Ticket-System
  if (!data.service_ticket_system) {
    result.empfehlungen.push({
      id: 'proz_05',
      titel: 'Ticket-System für Service einführen',
      bereich: 'Prozesse',
      beschreibung: 'Support-Ticket-System einführen zur strukturierten Bearbeitung von Kundenanfragen.',
      nutzen: 'Keine Anfrage geht verloren, Nachvollziehbarkeit, SLA-Einhaltung, Kundenzufriedenheit steigt.',
      aufwand: 'klein',
      kosten: '10 - 100 €/Monat',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'nein'
    });
  } else {
    result.staerken.push('Ticket-System für Service vorhanden');
    result.score += 5;
  }

  // Dokumentenablage
  if (data.dokumente_ablage === 'chaotisch') {
    result.schwaechen.push('Dokumentenablage ist chaotisch');
    result.score -= 10;
    result.empfehlungen.push({
      id: 'proz_06',
      titel: 'Ordnerstruktur und Namenskonventionen einführen',
      bereich: 'Prozesse',
      beschreibung: 'Klare Ordnerstruktur definieren, Namenskonventionen festlegen, Team schulen.',
      nutzen: 'Schnelleres Finden von Dokumenten, weniger Frustration, bessere Zusammenarbeit.',
      aufwand: 'klein',
      kosten: 'interne Arbeitszeit',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  }

  return finalBewertung(result);
}

// === DATEN & SICHERHEIT ===
export function analyzeDaten(data: DatenData): BereichsAnalyse {
  const result = createBaseResult('daten', 'Daten & Sicherheit');

  // Backup
  if (!data.backup_vorhanden || data.backup_vorhanden === 'Nein') {
    result.schwaechen.push('KRITISCH: Kein Backup vorhanden');
    result.score -= 25;
    result.bewertung = 'kritisch';
    result.empfehlungen.push({
      id: 'dat_01',
      titel: 'Backup-Strategie implementieren (SOFORT!)',
      bereich: 'Daten & Sicherheit',
      beschreibung: 'Automatisierte, tägliche Backups aller geschäftskritischen Daten einrichten. Mindestens 3-2-1-Regel: 3 Kopien, 2 verschiedene Medien, 1 extern.',
      nutzen: 'Schutz vor Datenverlust durch Hardware-Defekt, Ransomware, Feuer, Diebstahl. Existenzsicherung des Unternehmens.',
      aufwand: 'klein',
      kosten: '50 - 300 €/Monat',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'ja'
    });
  } else if (data.backup_frequenz !== 'Täglich') {
    result.schwaechen.push('Backup nicht täglich');
    result.score -= 10;
    result.empfehlungen.push({
      id: 'dat_02',
      titel: 'Backup-Frequenz auf täglich erhöhen',
      bereich: 'Daten & Sicherheit',
      beschreibung: 'Tägliche automatische Backups einrichten statt wöchentlich/monatlich.',
      nutzen: 'Maximal 1 Tag Datenverlust statt Wochen. Bei Ransomware-Angriff kritisch.',
      aufwand: 'klein',
      kosten: 'keine/geringe Mehrkosten',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  } else {
    result.staerken.push('Tägliche Backups vorhanden');
    result.score += 15;
    
    if (data.backup_automatisiert) {
      result.staerken.push('Backups sind automatisiert');
      result.score += 5;
    }
  }

  // Backup-Test
  if (data.backup_getestet === 'Nie' || data.backup_getestet === 'nie') {
    result.schwaechen.push('Backup-Wiederherstellung nie getestet');
    result.empfehlungen.push({
      id: 'dat_02b',
      titel: 'Backup-Wiederherstellung testen',
      bereich: 'Daten & Sicherheit',
      beschreibung: 'Regelmäßig (mind. 1x pro Quartal) prüfen, ob Backups tatsächlich wiederhergestellt werden können.',
      nutzen: 'Ein Backup ist nur nützlich, wenn es auch funktioniert. Viele Unternehmen merken erst im Notfall, dass ihre Backups defekt sind.',
      aufwand: 'klein',
      kosten: 'interne Arbeitszeit',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  }

  // 2FA
  if (data.zwei_faktor_auth === 'nirgends' || !data.zwei_faktor_auth) {
    result.schwaechen.push('Keine Zwei-Faktor-Authentifizierung');
    result.score -= 12;
    result.empfehlungen.push({
      id: 'dat_03',
      titel: 'Zwei-Faktor-Authentifizierung einführen',
      bereich: 'Daten & Sicherheit',
      beschreibung: '2FA/MFA für alle kritischen Systeme aktivieren (E-Mail, Cloud, CRM, Banking).',
      nutzen: 'Schutz vor Passwort-Diebstahl, Reduzierung von Hacking-Risiken um 99%.',
      aufwand: 'klein',
      kosten: 'meist kostenlos',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  } else if (data.zwei_faktor_auth === 'Teilweise') {
    result.schwaechen.push('2FA nur teilweise aktiviert');
    result.score -= 5;
  } else {
    result.staerken.push('Zwei-Faktor-Authentifizierung aktiviert');
    result.score += 10;
  }

  // Firewall
  if (!data.firewall_vorhanden) {
    result.schwaechen.push('Keine Firewall vorhanden');
    result.score -= 10;
    result.empfehlungen.push({
      id: 'dat_04',
      titel: 'Firewall einrichten',
      bereich: 'Daten & Sicherheit',
      beschreibung: 'Hardware- oder Software-Firewall zum Schutz des Netzwerks einrichten.',
      nutzen: 'Schutz vor unberechtigten Zugriffen, Angriffen aus dem Internet.',
      aufwand: 'klein',
      kosten: '200 - 1.000 € + lfd. Kosten',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'teilweise'
    });
  } else {
    result.staerken.push('Firewall vorhanden');
    result.score += 5;
  }

  // Antivirus
  if (!data.antivirus_vorhanden) {
    result.schwaechen.push('Kein Antivirus-Schutz');
    result.score -= 8;
    result.empfehlungen.push({
      id: 'dat_05',
      titel: 'Antivirus/Endpoint-Protection einführen',
      bereich: 'Daten & Sicherheit',
      beschreibung: 'Professionelle Antivirus-Lösung auf allen Geräten installieren.',
      nutzen: 'Schutz vor Malware, Ransomware, Viren.',
      aufwand: 'klein',
      kosten: '3 - 10 €/Monat pro Gerät',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  } else {
    result.staerken.push('Antivirus-Schutz vorhanden');
    result.score += 5;
  }

  // Passwort-Manager
  if (!data.passwort_manager || data.passwort_manager === 'keiner') {
    result.empfehlungen.push({
      id: 'dat_06',
      titel: 'Passwort-Manager einführen',
      bereich: 'Daten & Sicherheit',
      beschreibung: 'Team-Passwort-Manager (z.B. 1Password, Bitwarden) für sichere Passwort-Verwaltung einführen.',
      nutzen: 'Sichere, einzigartige Passwörter für jeden Dienst, sicheres Teilen von Zugängen im Team.',
      aufwand: 'klein',
      kosten: '3 - 8 €/Monat pro Nutzer',
      prioritaet: 'mittel',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  }

  // DSGVO
  if (!data.dsgvo_verzeichnis_vorhanden) {
    result.schwaechen.push('DSGVO-Verzeichnis fehlt');
    result.empfehlungen.push({
      id: 'dat_07',
      titel: 'DSGVO-Verarbeitungsverzeichnis erstellen',
      bereich: 'Daten & Sicherheit',
      beschreibung: 'Gesetzlich vorgeschriebenes Verzeichnis aller Datenverarbeitungstätigkeiten erstellen.',
      nutzen: 'Rechtliche Pflicht erfüllen, Bußgelder vermeiden, Transparenz über Datenverarbeitung.',
      aufwand: 'mittel',
      kosten: '500 - 2.000 €',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      foerderrelevant: 'teilweise'
    });
  }

  return finalBewertung(result);
}

// === SOCIAL MEDIA ===
export function analyzeSocial(data: SocialData): BereichsAnalyse {
  const result = createBaseResult('social', 'Social Media & Marketing');

  const activeChannels = data.kanaele_aktiv || [];
  
  if (activeChannels.length === 0) {
    result.schwaechen.push('Keine Social-Media-Präsenz');
    result.score -= 15;
    result.empfehlungen.push({
      id: 'soc_01',
      titel: 'Social-Media-Strategie entwickeln',
      bereich: 'Social Media',
      beschreibung: 'Relevante Kanäle identifizieren und Präsenz aufbauen (z.B. LinkedIn für B2B, Instagram für B2C).',
      nutzen: 'Reichweite, Markenbekanntheit, Kundengewinnung, Employer Branding.',
      aufwand: 'mittel',
      kosten: 'Zeit + ggf. Agenturkosten',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'teilweise'
    });
  } else {
    result.staerken.push(`${activeChannels.length} Social-Media-Kanäle aktiv`);
    result.score += Math.min(activeChannels.length * 5, 15);
  }

  if (!data.content_redaktionsplan) {
    result.schwaechen.push('Kein Content-Redaktionsplan');
    result.empfehlungen.push({
      id: 'soc_02',
      titel: 'Content-Redaktionsplan erstellen',
      bereich: 'Social Media',
      beschreibung: 'Regelmäßige Planung von Inhalten für Social Media und Website.',
      nutzen: 'Konstante Präsenz, bessere Qualität, weniger Stress, messbare Ergebnisse.',
      aufwand: 'klein',
      kosten: 'interne Arbeitszeit',
      prioritaet: 'mittel',
      zeitraum: 'sofort',
      foerderrelevant: 'nein'
    });
  } else {
    result.staerken.push('Content-Redaktionsplan vorhanden');
    result.score += 10;
  }

  if (!data.newsletter_vorhanden) {
    result.empfehlungen.push({
      id: 'soc_03',
      titel: 'Newsletter-Marketing aufbauen',
      bereich: 'Social Media',
      beschreibung: 'E-Mail-Marketing mit Newsletter-Tool (z.B. Mailchimp, Brevo) aufbauen.',
      nutzen: 'Direkter Kundenkontakt, hohe Conversion-Rate, Kundenbindung, geringe Kosten.',
      aufwand: 'klein',
      kosten: '0 - 50 €/Monat',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'nein'
    });
  } else {
    result.staerken.push('Newsletter-Marketing vorhanden');
    result.score += 10;
  }

  return finalBewertung(result);
}

// === REPORTING ===
export function analyzeReporting(data: ReportingData): BereichsAnalyse {
  const result = createBaseResult('reporting', 'Reporting & KPIs');

  if (!data.kennzahlen_erfasst) {
    result.schwaechen.push('Keine Kennzahlen werden erfasst');
    result.score -= 15;
    result.empfehlungen.push({
      id: 'rep_01',
      titel: 'KPI-System definieren',
      bereich: 'Reporting',
      beschreibung: 'Relevante Kennzahlen für das Unternehmen definieren und regelmäßig erheben.',
      nutzen: 'Datenbasierte Entscheidungen, Früherkennung von Problemen, Erfolgsmessung.',
      aufwand: 'mittel',
      kosten: 'interne Arbeitszeit + ggf. Tools',
      prioritaet: 'hoch',
      zeitraum: 'mittel',
      foerderrelevant: 'ja'
    });
  } else {
    result.staerken.push('Kennzahlen werden erfasst');
    result.score += 10;
  }

  if (!data.dashboard_vorhanden) {
    result.empfehlungen.push({
      id: 'rep_02',
      titel: 'Dashboard für Unternehmenskennzahlen einrichten',
      bereich: 'Reporting',
      beschreibung: 'Zentrales Dashboard zur Visualisierung wichtiger KPIs einrichten.',
      nutzen: 'Schneller Überblick, frühzeitiges Erkennen von Trends, bessere Kommunikation.',
      aufwand: 'mittel',
      kosten: '500 - 5.000 €',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'ja'
    });
  } else {
    result.staerken.push('Dashboard vorhanden');
    result.score += 10;
  }

  if (data.datenqualitaet === 'Mangelhaft' || data.datenqualitaet === 'Ungenügend') {
    result.schwaechen.push('Datenqualität mangelhaft');
    result.score -= 10;
    result.empfehlungen.push({
      id: 'rep_03',
      titel: 'Datenqualität verbessern',
      bereich: 'Reporting',
      beschreibung: 'Datenerfassungsprozesse standardisieren, Validierungsregeln einführen, regelmäßige Datenbereinigung.',
      nutzen: 'Verlässliche Daten für Entscheidungen, weniger Fehler, Vertrauen in Zahlen.',
      aufwand: 'mittel',
      kosten: 'interne Arbeitszeit',
      prioritaet: 'hoch',
      zeitraum: 'mittel',
      foerderrelevant: 'nein'
    });
  }

  return finalBewertung(result);
}

// === SCHULUNG ===
export function analyzeSchulung(data: SchulungData): BereichsAnalyse {
  const result = createBaseResult('schulung', 'Schulung & Wissen');

  if (!data.onboarding_prozess || data.onboarding_prozess === 'Fehlt') {
    result.schwaechen.push('Kein strukturierter Onboarding-Prozess');
    result.score -= 12;
    result.empfehlungen.push({
      id: 'sch_01',
      titel: 'Onboarding-Prozess etablieren',
      bereich: 'Schulung',
      beschreibung: 'Strukturierten Einarbeitungsplan für neue Mitarbeiter erstellen.',
      nutzen: 'Schnellere Produktivität, weniger Fehler, höhere Zufriedenheit, geringere Fluktuation.',
      aufwand: 'mittel',
      kosten: 'interne Arbeitszeit',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'teilweise'
    });
  } else {
    result.staerken.push('Strukturierter Onboarding-Prozess vorhanden');
    result.score += 10;
  }

  if (!data.arbeitsanweisungen_vorhanden) {
    result.schwaechen.push('Keine dokumentierten Arbeitsanweisungen');
    result.empfehlungen.push({
      id: 'sch_02',
      titel: 'Arbeitsanweisungen dokumentieren',
      bereich: 'Schulung',
      beschreibung: 'Wichtige Prozesse und Abläufe schriftlich dokumentieren.',
      nutzen: 'Weniger Abhängigkeit von Einzelpersonen, schnellere Einarbeitung, Qualitätssicherung.',
      aufwand: 'mittel',
      kosten: 'interne Arbeitszeit',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'nein'
    });
  } else {
    result.staerken.push('Arbeitsanweisungen dokumentiert');
    result.score += 8;
  }

  if (!data.wissensdatenbank_vorhanden) {
    result.empfehlungen.push({
      id: 'sch_03',
      titel: 'Wissensdatenbank aufbauen',
      bereich: 'Schulung',
      beschreibung: 'Zentrales Wiki oder Wissensmanagementsystem für Unternehmenswissen aufbauen.',
      nutzen: 'Wissen geht nicht verloren, schnellere Antworten, Self-Service für Mitarbeiter.',
      aufwand: 'mittel',
      kosten: '10 - 100 €/Monat',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'ja'
    });
  } else {
    result.staerken.push('Wissensdatenbank vorhanden');
    result.score += 10;
  }

  if (!data.schulungen_regelmaessig) {
    result.schwaechen.push('Keine regelmäßigen Schulungen');
    result.empfehlungen.push({
      id: 'sch_04',
      titel: 'Schulungsprogramm etablieren',
      bereich: 'Schulung',
      beschreibung: 'Regelmäßige interne oder externe Schulungen für Mitarbeiter anbieten.',
      nutzen: 'Aktuelle Kompetenzen, Mitarbeitermotivation, Wettbewerbsfähigkeit.',
      aufwand: 'mittel',
      kosten: 'variabel',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      foerderrelevant: 'ja'
    });
  } else {
    result.staerken.push('Regelmäßige Schulungen');
    result.score += 10;
  }

  return finalBewertung(result);
}

// =============================================
// HAUPT-ANALYSE-FUNKTION
// =============================================

export function analyzeClientData(clientData: ClientData): GesamtAnalyse {
  const analysis: GesamtAnalyse = {
    bereiche: {
      online: analyzeOnline(clientData.online, clientData.stammdaten),
      systeme: analyzeSysteme(clientData.systeme),
      prozesse: analyzeProzesse(clientData.prozesse),
      daten: analyzeDaten(clientData.daten),
      social: analyzeSocial(clientData.social),
      reporting: analyzeReporting(clientData.reporting),
      schulung: analyzeSchulung(clientData.schulung)
    },
    staerken: [],
    schwaechen: [],
    empfehlungen: [],
    bewertungen: {},
    gesamtscore: 0
  };

  // Stärken, Schwächen & Empfehlungen sammeln
  Object.values(analysis.bereiche).forEach(bereich => {
    analysis.staerken.push(...bereich.staerken);
    analysis.schwaechen.push(...bereich.schwaechen);
    analysis.empfehlungen.push(...bereich.empfehlungen);
    analysis.bewertungen[bereich.name] = bereich.bewertung;
  });

  // Gesamtscore berechnen (gewichteter Durchschnitt)
  const scores = Object.values(analysis.bereiche).map(b => b.score);
  analysis.gesamtscore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  // Empfehlungen nach Priorität sortieren
  analysis.empfehlungen.sort((a, b) => {
    const priorityOrder = { hoch: 0, mittel: 1, niedrig: 2 };
    return priorityOrder[a.prioritaet] - priorityOrder[b.prioritaet];
  });

  return analysis;
}

// =============================================
// HELPER FUNKTIONEN
// =============================================

export function getBereichLabel(bereich: string): string {
  const labels: Record<string, string> = {
    online: 'Online-Auftritt',
    systeme: 'Systeme & Software',
    prozesse: 'Prozesse & Workflows',
    daten: 'Daten & Sicherheit',
    social: 'Social Media & Marketing',
    reporting: 'Reporting & KPIs',
    schulung: 'Schulung & Wissen'
  };
  return labels[bereich] || bereich;
}

export function getBewertungColor(bewertung: string): string {
  const colors: Record<string, string> = {
    kritisch: 'text-red-600',
    ausbaufaehig: 'text-yellow-600',
    reif: 'text-green-600'
  };
  return colors[bewertung] || 'text-gray-600';
}

export function getBewertungBgColor(bewertung: string): string {
  const colors: Record<string, string> = {
    kritisch: 'bg-red-100',
    ausbaufaehig: 'bg-yellow-100',
    reif: 'bg-green-100'
  };
  return colors[bewertung] || 'bg-gray-100';
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

export function getFoerderrelevantLabel(value: string): string {
  const labels: Record<string, string> = {
    ja: 'Förderfähig',
    nein: 'Nicht förderfähig',
    teilweise: 'Teilweise förderfähig'
  };
  return labels[value] || value;
}
