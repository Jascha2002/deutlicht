// ============================================================================
// WISSENSDATENBANK FÜR BERATUNGSBERICHTE
// Textbausteine und Empfehlungslogik basierend auf Praxis-Berichten
// ============================================================================

// ============================================================================
// EMPFEHLUNGSMATRIX - Logische Entscheidungsregeln
// ============================================================================

export interface EmpfehlungsRegel {
  id: string;
  bedingung: string;
  trigger: (data: any) => boolean;
  empfehlung: {
    titel: string;
    beschreibung: string;
    nutzen: string;
    prioritaet: 'hoch' | 'mittel' | 'niedrig';
    zeitraum: 'sofort' | 'mittel' | 'langfristig';
    kosten: string;
    foerderrelevant: boolean;
  };
}

export const EMPFEHLUNGSMATRIX: EmpfehlungsRegel[] = [
  // ============ WEBSITE & ONLINE ============
  {
    id: 'web_keine_website',
    bedingung: 'Keine Website vorhanden',
    trigger: (data) => !data.online?.website_vorhanden || data.online?.website_vorhanden === 'Nein',
    empfehlung: {
      titel: 'Professionelle Website erstellen',
      beschreibung: 'Entwicklung einer modernen, responsiven Website mit professionellem CMS. Fokus auf Benutzerfreundlichkeit, SEO-Optimierung und Conversion-Orientierung.',
      nutzen: 'Erhöhte Sichtbarkeit im Internet, professioneller Außenauftritt, Neukundengewinnung rund um die Uhr, Vertrauensbildung bei potenziellen Kunden.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '3.000 - 15.000 €',
      foerderrelevant: true
    }
  },
  {
    id: 'web_nicht_responsive',
    bedingung: 'Website nicht mobiloptimiert',
    trigger: (data) => data.online?.website_responsive === 'Nein',
    empfehlung: {
      titel: 'Website für mobile Endgeräte optimieren',
      beschreibung: 'Umstellung auf Responsive Design. Über 60% der Website-Besucher nutzen mobile Geräte. Google bevorzugt mobile-first Indexierung.',
      nutzen: 'Bessere Nutzererfahrung, höhere Conversion-Rate, besseres Google-Ranking, geringere Absprungrate.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '1.500 - 5.000 €',
      foerderrelevant: true
    }
  },
  {
    id: 'web_kein_ssl',
    bedingung: 'Keine HTTPS-Verschlüsselung',
    trigger: (data) => data.online?.website_https === 'Nein',
    empfehlung: {
      titel: 'SSL-Zertifikat einrichten (HTTPS)',
      beschreibung: 'SSL-Zertifikat für verschlüsselte Datenübertragung. Browser warnen aktiv vor unsicheren Seiten.',
      nutzen: 'Sicherheit für Besucher, Vertrauensbildung, besseres Google-Ranking, Vermeidung von Browser-Warnungen.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '0 - 200 €/Jahr',
      foerderrelevant: false
    }
  },
  {
    id: 'web_langsam',
    bedingung: 'Website lädt langsam',
    trigger: (data) => data.online?.website_ladezeit === 'langsam' || data.online?.website_ladezeit === 'sehr langsam',
    empfehlung: {
      titel: 'Website-Performance optimieren',
      beschreibung: 'Optimierung durch Bildkomprimierung, Caching, Code-Minifizierung und ggf. CDN-Einsatz. Jede Sekunde Ladezeit kostet ca. 7% Conversion.',
      nutzen: 'Bessere Nutzererfahrung, geringere Absprungrate, besseres Google-Ranking, höhere Conversion-Rate.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: '500 - 3.000 €',
      foerderrelevant: true
    }
  },
  {
    id: 'web_kein_seo',
    bedingung: 'Kein aktives SEO',
    trigger: (data) => data.online?.seo_aktiv_betrieben === 'Nein' || !data.online?.seo_aktiv_betrieben,
    empfehlung: {
      titel: 'SEO-Strategie entwickeln und umsetzen',
      beschreibung: 'Keyword-Recherche, On-Page-Optimierung, technisches SEO, Backlink-Aufbau. Google My Business optimieren und lokale SEO stärken.',
      nutzen: 'Höhere Sichtbarkeit in Suchmaschinen, mehr organischer Traffic, nachhaltige Kundengewinnung ohne laufende Werbekosten.',
      prioritaet: 'hoch',
      zeitraum: 'mittel',
      kosten: '500 - 2.500 €/Monat',
      foerderrelevant: true
    }
  },
  {
    id: 'web_keine_updates',
    bedingung: 'Website wird selten aktualisiert',
    trigger: (data) => data.online?.website_aktualisierung === 'Seltener' || data.online?.website_aktualisierung === 'Nie',
    empfehlung: {
      titel: 'Content-Strategie und Redaktionsplan etablieren',
      beschreibung: 'Regelmäßige Content-Updates planen. Blog, News oder FAQ-Bereich einrichten. Frischer Content verbessert SEO-Rankings.',
      nutzen: 'Besseres Google-Ranking durch frischen Content, mehr Besucherinteraktionen, Expertenstatus aufbauen.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: 'Interne Arbeitszeit + ggf. Agentur',
      foerderrelevant: false
    }
  },
  
  // ============ SYSTEME ============
  {
    id: 'sys_kein_crm',
    bedingung: 'Kein CRM-System',
    trigger: (data) => !data.systeme?.crm_vorhanden || data.systeme?.crm_vorhanden === 'Nein',
    empfehlung: {
      titel: 'CRM-System einführen',
      beschreibung: 'Professionelles Customer Relationship Management zur zentralen Verwaltung von Kundenkontakten, Angeboten und Kommunikation. Beispiele: HubSpot, Pipedrive, Odoo.',
      nutzen: 'Zentrale Datenhaltung, bessere Nachverfolgung, automatische Erinnerungen, Team-Transparenz, höhere Abschlussquoten.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '20 - 100 €/Monat pro Nutzer',
      foerderrelevant: true
    }
  },
  {
    id: 'sys_excel_crm',
    bedingung: 'CRM über Excel',
    trigger: (data) => data.systeme?.crm_system === 'Excel/Tabellen',
    empfehlung: {
      titel: 'Von Excel auf professionelles CRM migrieren',
      beschreibung: 'Excel-Listen in strukturiertes CRM überführen. Automatisierung von Prozessen, Multi-User-Fähigkeit, mobile Nutzung.',
      nutzen: 'Weniger Fehler, automatische Workflows, bessere Auswertungen, Skalierbarkeit.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '1.500 - 5.000 € Einrichtung + lfd. Kosten',
      foerderrelevant: true
    }
  },
  {
    id: 'sys_kein_erp',
    bedingung: 'Kein ERP-System',
    trigger: (data) => !data.systeme?.erp_vorhanden || data.systeme?.erp_vorhanden === 'Nein',
    empfehlung: {
      titel: 'ERP/Warenwirtschaft evaluieren',
      beschreibung: 'Enterprise Resource Planning zur Steuerung von Auftragsabwicklung, Lager, Einkauf. Durchgängige Prozesse von Angebot bis Rechnung.',
      nutzen: 'Echtzeit-Bestandsübersicht, weniger Fehler, automatisierte Workflows, bessere Skalierbarkeit.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: '5.000 - 50.000 € je nach Umfang',
      foerderrelevant: true
    }
  },
  {
    id: 'sys_keine_integration',
    bedingung: 'Keine CRM-ERP-Integration',
    trigger: (data) => data.systeme?.crm_vorhanden === 'Ja' && data.systeme?.erp_vorhanden === 'Ja' && !data.systeme?.erp_integration_crm,
    empfehlung: {
      titel: 'CRM-ERP-Integration herstellen',
      beschreibung: 'Schnittstelle für automatischen Datenaustausch. Kundendaten, Angebote und Aufträge fließen nahtlos.',
      nutzen: 'Keine Doppelerfassung, weniger Fehler, durchgängiger Datenfluss vom Lead bis zur Rechnung.',
      prioritaet: 'hoch',
      zeitraum: 'mittel',
      kosten: '3.000 - 15.000 €',
      foerderrelevant: true
    }
  },
  {
    id: 'sys_kein_dms',
    bedingung: 'Kein Dokumentenmanagement',
    trigger: (data) => !data.systeme?.dms_vorhanden || data.systeme?.dms_vorhanden === 'Nein',
    empfehlung: {
      titel: 'Dokumentenmanagementsystem (DMS) einführen',
      beschreibung: 'Zentrale, strukturierte Ablage aller Dokumente mit Versionierung, Suche und Berechtigungen. Beispiele: SharePoint, Nextcloud, DocuWare.',
      nutzen: 'Weniger Suchzeit, revisionssichere Ablage, Versionskontrolle, ortsunabhängiger Zugriff.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '1.500 - 10.000 € + lfd. Kosten',
      foerderrelevant: true
    }
  },

  // ============ PROZESSE ============
  {
    id: 'proz_medienbrueche',
    bedingung: 'Medienbrüche in Prozessen',
    trigger: (data) => data.prozesse?.auftragsbearbeitung_medienbruch === true,
    empfehlung: {
      titel: 'Medienbrüche eliminieren',
      beschreibung: 'Durchgängige digitale Prozesse etablieren. Papierbasierte Übergaben durch digitale Workflows ersetzen.',
      nutzen: 'Weniger Fehler, schnellere Bearbeitung, bessere Nachvollziehbarkeit, Kosteneinsparung.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: 'Abhängig von Komplexität',
      foerderrelevant: true
    }
  },
  {
    id: 'proz_manuelle_rechnung',
    bedingung: 'Manuelle Rechnungsstellung',
    trigger: (data) => data.prozesse?.rechnungsstellung === 'Manuell',
    empfehlung: {
      titel: 'Rechnungsstellung automatisieren',
      beschreibung: 'Digitale Rechnungserstellung mit Vorlagen, automatischer Datenübernahme aus Aufträgen. E-Rechnung (XRechnung) für B2G vorbereiten.',
      nutzen: 'Schnellere Rechnungsstellung, weniger Fehler, besserer Cashflow, gesetzeskonform.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '500 - 3.000 €',
      foerderrelevant: true
    }
  },
  {
    id: 'proz_kein_ticket',
    bedingung: 'Kein Ticket-System',
    trigger: (data) => data.prozesse?.service_ticket_system === false && data.prozesse?.service_kanal?.length > 0,
    empfehlung: {
      titel: 'Ticket-System für Service einführen',
      beschreibung: 'Strukturierte Erfassung und Bearbeitung von Kundenanfragen. Nachvollziehbarkeit, SLA-Überwachung, Wissensdatenbank.',
      nutzen: 'Keine verlorenen Anfragen, bessere Reaktionszeiten, Kundenzufriedenheit, Auswertbarkeit.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: '20 - 80 €/Monat pro Agent',
      foerderrelevant: true
    }
  },

  // ============ DATEN & SICHERHEIT ============
  {
    id: 'dat_kein_backup',
    bedingung: 'Kein Backup',
    trigger: (data) => !data.daten?.backup_vorhanden || data.daten?.backup_vorhanden === 'Nein',
    empfehlung: {
      titel: 'KRITISCH: Backup-Strategie implementieren',
      beschreibung: 'Automatisierte, tägliche Backups mit 3-2-1-Regel (3 Kopien, 2 Medien, 1 extern). Regelmäßige Wiederherstellungstests.',
      nutzen: 'Schutz vor Datenverlust, Business Continuity, Compliance-Anforderungen erfüllt.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '50 - 500 €/Monat',
      foerderrelevant: true
    }
  },
  {
    id: 'dat_kein_2fa',
    bedingung: 'Keine Zwei-Faktor-Authentifizierung',
    trigger: (data) => data.daten?.zwei_faktor_auth === 'nirgends' || !data.daten?.zwei_faktor_auth,
    empfehlung: {
      titel: 'Zwei-Faktor-Authentifizierung einführen',
      beschreibung: '2FA für alle geschäftskritischen Systeme aktivieren. Authenticator-Apps oder Hardware-Token nutzen.',
      nutzen: 'Erheblich höhere Sicherheit gegen Account-Übernahmen, Compliance, Versicherungsanforderungen.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: 'Meist kostenlos oder minimal',
      foerderrelevant: false
    }
  },
  {
    id: 'dat_keine_firewall',
    bedingung: 'Keine Firewall',
    trigger: (data) => data.daten?.firewall_vorhanden === false,
    empfehlung: {
      titel: 'Firewall-Schutz implementieren',
      beschreibung: 'Next-Generation Firewall mit Intrusion Detection. Netzwerk-Segmentierung für sensible Bereiche.',
      nutzen: 'Schutz vor Angriffen, Malware-Abwehr, Compliance, Versicherungsschutz.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '500 - 5.000 € + lfd. Kosten',
      foerderrelevant: true
    }
  },
  {
    id: 'dat_chaos_ordner',
    bedingung: 'Chaotische Ordnerstruktur',
    trigger: (data) => data.daten?.daten_ordnerstruktur === 'chaotisch',
    empfehlung: {
      titel: 'Ordnerstruktur und Namenskonventionen definieren',
      beschreibung: 'Einheitliche Verzeichnisstruktur, Benennungsregeln und Zugriffsrechte. Dokumentation und Schulung der Mitarbeiter.',
      nutzen: 'Schnelleres Finden von Dokumenten, weniger Duplikate, bessere Zusammenarbeit.',
      prioritaet: 'mittel',
      zeitraum: 'sofort',
      kosten: 'Interne Arbeitszeit',
      foerderrelevant: false
    }
  },
  {
    id: 'dat_keine_dsgvo',
    bedingung: 'Kein DSGVO-Verzeichnis',
    trigger: (data) => data.daten?.dsgvo_verzeichnis_vorhanden === false,
    empfehlung: {
      titel: 'DSGVO-Verarbeitungsverzeichnis erstellen',
      beschreibung: 'Dokumentation aller Verarbeitungstätigkeiten nach Art. 30 DSGVO. Auftragsverarbeiter-Verträge prüfen.',
      nutzen: 'Gesetzeskonformität, Bußgeldvermeidung, Vertrauensbildung bei Kunden.',
      prioritaet: 'hoch',
      zeitraum: 'sofort',
      kosten: '500 - 3.000 € (extern) oder intern',
      foerderrelevant: false
    }
  },

  // ============ SOCIAL MEDIA & MARKETING ============
  {
    id: 'soc_keine_kanaele',
    bedingung: 'Keine Social-Media-Präsenz',
    trigger: (data) => !data.social?.kanaele_aktiv || data.social?.kanaele_aktiv?.length === 0,
    empfehlung: {
      titel: 'Social-Media-Strategie entwickeln',
      beschreibung: 'Relevante Kanäle identifizieren (LinkedIn für B2B, Instagram/Facebook für B2C). Profil-Aufbau und Content-Strategie.',
      nutzen: 'Reichweite, Markenbekanntheit, direkter Kundenkontakt, Recruiting-Potenzial.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: 'Interne Zeit + ggf. 500-2.000 €/Monat Agentur',
      foerderrelevant: false
    }
  },
  {
    id: 'soc_kein_redaktionsplan',
    bedingung: 'Kein Redaktionsplan',
    trigger: (data) => data.social?.kanaele_aktiv?.length > 0 && !data.social?.content_redaktionsplan,
    empfehlung: {
      titel: 'Redaktionsplan für Social Media einführen',
      beschreibung: 'Strukturierter Content-Kalender mit Themen, Formaten und Verantwortlichkeiten. Regelmäßige Veröffentlichungen sicherstellen.',
      nutzen: 'Konsistente Präsenz, bessere Planung, Qualitätssteigerung, Zeiteinsparung.',
      prioritaet: 'mittel',
      zeitraum: 'sofort',
      kosten: 'Interne Arbeitszeit',
      foerderrelevant: false
    }
  },
  {
    id: 'soc_kein_newsletter',
    bedingung: 'Kein Newsletter',
    trigger: (data) => data.social?.newsletter_vorhanden === false,
    empfehlung: {
      titel: 'E-Mail-Marketing / Newsletter aufbauen',
      beschreibung: 'Aufbau einer eigenen E-Mail-Liste. Regelmäßige Newsletter mit Mehrwert. Tools: Mailchimp, Brevo, CleverReach.',
      nutzen: 'Direkter Kundenkontakt, hoher ROI, unabhängig von Algorithmen, Kundenbindung.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: '0 - 100 €/Monat je nach Listengröße',
      foerderrelevant: false
    }
  },

  // ============ SCHULUNG & WISSEN ============
  {
    id: 'sch_keine_doku',
    bedingung: 'Keine Prozessdokumentation',
    trigger: (data) => data.schulung?.arbeitsanweisungen_vorhanden === false,
    empfehlung: {
      titel: 'Prozessdokumentation erstellen',
      beschreibung: 'Wichtige Arbeitsabläufe dokumentieren. Schritt-für-Schritt-Anleitungen, Videos oder Wiki aufbauen.',
      nutzen: 'Einarbeitung neuer Mitarbeiter, Qualitätssicherung, Wissenserhalt bei Fluktuation.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: 'Interne Arbeitszeit',
      foerderrelevant: true
    }
  },
  {
    id: 'sch_keine_wissensdatenbank',
    bedingung: 'Keine Wissensdatenbank',
    trigger: (data) => data.schulung?.wissensdatenbank_vorhanden === false,
    empfehlung: {
      titel: 'Interne Wissensdatenbank aufbauen',
      beschreibung: 'Zentrales Wiki oder Knowledge-Base für Unternehmenswissen. Tools: Notion, Confluence, SharePoint.',
      nutzen: 'Schneller Zugriff auf Wissen, weniger Nachfragen, Onboarding-Beschleunigung.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: '0 - 50 €/Monat pro Nutzer',
      foerderrelevant: true
    }
  },

  // ============ SPEZIELLE SITUATIONEN ============
  {
    id: 'spec_videomarketing',
    bedingung: 'Kein Videomarketing',
    trigger: (data) => data.externeAnalysen?.videomarketing_vorhanden === false && data.ziele?.ziele_konkret?.includes('Neukundengewinnung'),
    empfehlung: {
      titel: 'Videomarketing-Strategie entwickeln',
      beschreibung: 'Professionelle Videos für Imagefilm, Produktpräsentation oder Recruiting. YouTube-Präsenz aufbauen.',
      nutzen: 'Höhere Aufmerksamkeit, emotionale Ansprache, bessere Conversion, SEO-Vorteile.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: '2.000 - 15.000 € pro Video',
      foerderrelevant: true
    }
  },
  {
    id: 'spec_ki_potenzial',
    bedingung: 'KI-Automatisierungspotenzial',
    trigger: (data) => (data.prozesse?.auftragsbearbeitung_medienbruch || data.prozesse?.rechnungsstellung === 'Manuell') && data.ziele?.budget_verfuegbar === 'Ja',
    empfehlung: {
      titel: 'KI-Automatisierungspotenziale evaluieren',
      beschreibung: 'Analyse repetitiver Prozesse auf KI-Automatisierungspotenzial. Dokumentenverarbeitung, Kundenservice, Datenanalyse.',
      nutzen: 'Erhebliche Effizienzsteigerung, Fehlerreduktion, Mitarbeiterentlastung, Wettbewerbsvorteil.',
      prioritaet: 'mittel',
      zeitraum: 'mittel',
      kosten: 'Abhängig von Use Case',
      foerderrelevant: true
    }
  }
];

// ============================================================================
// TEXTBAUSTEINE FÜR BERATUNGSBERICHTE
// ============================================================================

export const TEXTBAUSTEINE = {
  // Einleitungen nach Beratungsart
  auftragserteilung: {
    standard: (firma: string, ansprechpartner: string, datum: string, berater: string) => `
Das Unternehmen ${firma}${ansprechpartner ? `, ${ansprechpartner},` : ''} erteilte am ${datum} der DeutLicht - Digitalisierungsberatung den Auftrag zur Durchführung einer umfassenden Digitalisierungsanalyse. Die Beratung erfolgte auf Seiten des Auftragnehmers durch ${berater}.`,
    
    foerderung: (firma: string, foerderprogramm: string) => `
Die Beratung erfolgt im Rahmen des Förderprogramms "${foerderprogramm}" und beinhaltet eine umfassende Analyse der digitalen Reife sowie die Entwicklung konkreter Handlungsempfehlungen.`
  },

  // Methodik-Beschreibungen
  methodik: {
    analyse: [
      'Digitale Standortbestimmung mit strukturiertem Fragebogen',
      'Vor-Ort oder Online-Gespräch mit der Geschäftsführung zur Ist-Situation und den Zielen',
      'Untersuchung der bestehenden Systemlandschaft',
      'Analyse der Prozesse und Workflows'
    ],
    onlineAnalyse: [
      'Keyword-Recherche und Wettbewerbsanalyse',
      'Technische Website-Analyse (Performance, SEO, Mobile)',
      'Überprüfung der Online-Sichtbarkeit',
      'Auffindbarkeits-Check der Standortdaten (Google My Business, Portale)'
    ],
    konzept: [
      'Definition der Digitalisierungsstrategie mit Fokus auf Kernprozesse',
      'Positionierung mit Blick auf Kunden und Wettbewerb',
      'Zielgruppe und User Personas',
      'Priorisierung der Handlungsfelder',
      'Erstellung eines Maßnahmenplans mit Zeitachse'
    ],
    umsetzung: [
      'Steuerung und Controlling der definierten Maßnahmen',
      'Begleitung bei der Auswahl und Implementierung von Systemen',
      'Schulung und Change Management',
      'Follow-Up zu den definierten Maßnahmen'
    ]
  },

  // Bewertungstexte
  bewertungen: {
    kritisch: {
      titel: 'KRITISCHER HANDLUNGSBEDARF',
      beschreibung: 'In diesem Bereich besteht dringender Handlungsbedarf. Die identifizierten Schwachstellen gefährden die Wettbewerbsfähigkeit und/oder bergen erhebliche Risiken.',
      icon: '⛔'
    },
    ausbaufaehig: {
      titel: 'AUSBAUFÄHIG - MITTELFRISTIGER HANDLUNGSBEDARF',
      beschreibung: 'Grundlegende Strukturen sind vorhanden, jedoch mit deutlichem Optimierungspotenzial. Gezielte Maßnahmen können die Effizienz erheblich steigern.',
      icon: '⚠️'
    },
    reif: {
      titel: 'GUT AUFGESTELLT',
      beschreibung: 'Dieser Bereich ist bereits gut digitalisiert. Fokus auf kontinuierliche Verbesserung und Innovation.',
      icon: '✅'
    }
  },

  // Marktanalyse-Bausteine
  marktanalyse: {
    wettbewerbsumfeld: (branche: string) => `
Die Verschärfung des Wettbewerbs ist sowohl lokal im Einzugsgebiet des Unternehmens als auch online im Web zu beobachten. In einem solchen zunehmend kompetitiven Umfeld stellt die Gewinnung von Neukunden und damit der Ausbau der Kundenstruktur eine wachsende Herausforderung dar.

Da sich Interessenten zunehmend über das Internet über bestehende Angebote informieren, wird die Entwicklung einer adäquaten digitalen Strategie für Unternehmen in der Branche ${branche} immer relevanter.`,

    digitalisierungsbedeutung: `
Um die Wettbewerbsfähigkeit langfristig zu sichern, ist es notwendig, ein umfassendes Digitalisierungskonzept zu entwickeln. Dies umfasst sowohl die interne Prozessoptimierung als auch die externe Präsenz und Kundengewinnung.`
  },

  // Fördermittel-Texte
  foerderung: {
    hinweis: (foerderfaehig: number, gesamt: number) => `
Von den ${gesamt} empfohlenen Maßnahmen sind ${foerderfaehig} grundsätzlich förderfähig. Je nach Bundesland und aktueller Förderlandschaft können Programme wie "go-digital", "Digital Jetzt" oder landesspezifische Förderprogramme in Anspruch genommen werden.

Wir empfehlen eine Förderberatung, um die optimalen Fördermöglichkeiten für Ihr Unternehmen zu identifizieren.`,
    
    bafa: `
Diese Maßnahmen können im Rahmen der BAFA-Förderung "Förderung unternehmerischen Know-hows" bezuschusst werden. Die Förderquote beträgt je nach Region und Unternehmensalter zwischen 50% und 80% der Beratungskosten.`,

    goDigital: `
Im Rahmen des Förderprogramms "go-digital" des BMWi werden bis zu 50% der Beratungskosten für autorisierte Beratungsunternehmen übernommen. Die Fördersumme beträgt maximal 16.500 Euro.`
  },

  // Schlussformulierungen
  abschluss: {
    zusammenfassung: (score: number) => {
      if (score >= 70) {
        return `Das Unternehmen weist mit einem Digitalisierungsgrad von ${score}/100 Punkten bereits eine solide digitale Basis auf. Die identifizierten Optimierungspotenziale können gezielt adressiert werden, um die Wettbewerbsposition weiter zu stärken.`;
      } else if (score >= 40) {
        return `Mit einem Digitalisierungsgrad von ${score}/100 Punkten besteht signifikantes Potenzial zur digitalen Transformation. Die priorisierten Maßnahmen sollten zeitnah umgesetzt werden, um die Wettbewerbsfähigkeit zu sichern und auszubauen.`;
      } else {
        return `Der aktuelle Digitalisierungsgrad von ${score}/100 Punkten zeigt erheblichen Nachholbedarf. Die identifizierten kritischen Handlungsfelder sollten mit höchster Priorität adressiert werden, um Risiken zu minimieren und die Grundlagen für weiteres Wachstum zu schaffen.`;
      }
    },
    
    naechsteSchritte: `
Als nächste Schritte empfehlen wir:

1. Priorisierung der Maßnahmen im Führungskreis
2. Definition von Verantwortlichkeiten und Zeitrahmen
3. Prüfung der Fördermöglichkeiten
4. Kick-off für die ersten Quick-Win-Maßnahmen
5. Regelmäßige Review-Termine zur Fortschrittskontrolle

Wir stehen Ihnen gerne für die Begleitung der Umsetzung zur Verfügung.`
  }
};

// ============================================================================
// CHECKLISTEN FÜR WEBSITE-ANALYSE (wie in BAFA-Berichten)
// ============================================================================

export interface ChecklistItem {
  frage: string;
  kategorie: string;
  antwort: boolean | string | null;
  gewichtung: 'kritisch' | 'wichtig' | 'optional';
}

export const WEBSITE_CHECKLISTE: ChecklistItem[] = [
  // Technik
  { frage: 'Ist ein professionelles, intuitiv bedienbares CMS vorhanden?', kategorie: 'Technik', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Responsivität: PC', kategorie: 'Technik', antwort: null, gewichtung: 'kritisch' },
  { frage: 'Responsivität: Tablet', kategorie: 'Technik', antwort: null, gewichtung: 'kritisch' },
  { frage: 'Responsivität: Mobile', kategorie: 'Technik', antwort: null, gewichtung: 'kritisch' },
  { frage: 'Page Speed Desktop: gut/grün', kategorie: 'Technik', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Page Speed Mobile: gut/grün', kategorie: 'Technik', antwort: null, gewichtung: 'wichtig' },
  
  // Security
  { frage: 'Hat die Seite ein SSL-Zertifikat?', kategorie: 'Security', antwort: null, gewichtung: 'kritisch' },
  { frage: 'Ist ein Website-Tracking eingerichtet (z.B. Google Analytics)?', kategorie: 'Security', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Ist ein Conversion-Tracking eingerichtet?', kategorie: 'Security', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Ist eine Sitemap vorhanden und indexiert?', kategorie: 'SEO', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Entspricht die Website der DSGVO?', kategorie: 'Security', antwort: null, gewichtung: 'kritisch' },
  { frage: 'Sind Backlinks vorhanden und werden gepflegt?', kategorie: 'SEO', antwort: null, gewichtung: 'optional' },
  
  // Inhalte
  { frage: 'Ist die Website logisch und leicht verständlich aufgebaut?', kategorie: 'Inhalte', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Ist eine Zielpersonenansprache erkennbar?', kategorie: 'Inhalte', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Sind Aussagen von Testimonials vorhanden?', kategorie: 'Inhalte', antwort: null, gewichtung: 'optional' },
  { frage: 'Wird Premium-Content angeboten (Whitepapers, Case-Studies)?', kategorie: 'Inhalte', antwort: null, gewichtung: 'optional' },
  { frage: 'Wird ein Newsletter angeboten?', kategorie: 'Inhalte', antwort: null, gewichtung: 'optional' },
  { frage: 'Bietet die Website Inhalte für die Awareness-Stage?', kategorie: 'Inhalte', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Inhalte für Consideration-Stage vorhanden?', kategorie: 'Inhalte', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Inhalte für Decision-Stage vorhanden?', kategorie: 'Inhalte', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Conversion-Möglichkeiten vorhanden (Kontakt, Kauf)?', kategorie: 'Conversion', antwort: null, gewichtung: 'kritisch' },
  
  // Features
  { frage: 'Video auf Startseite', kategorie: 'Features', antwort: null, gewichtung: 'optional' },
  { frage: 'Google Maps Einbindung', kategorie: 'Features', antwort: null, gewichtung: 'optional' },
  { frage: 'Click-to-Call vorhanden', kategorie: 'Features', antwort: null, gewichtung: 'wichtig' },
  { frage: 'Social Media Links vorhanden', kategorie: 'Features', antwort: null, gewichtung: 'optional' },
  { frage: 'News/Blog vorhanden', kategorie: 'Features', antwort: null, gewichtung: 'optional' }
];

// ============================================================================
// HELPER-FUNKTIONEN
// ============================================================================

export function getAnwendbareEmpfehlungen(formData: any): EmpfehlungsRegel[] {
  return EMPFEHLUNGSMATRIX.filter(regel => {
    try {
      return regel.trigger(formData);
    } catch {
      return false;
    }
  });
}

export function sortiereEmpfehlungenNachPrioritaet(empfehlungen: EmpfehlungsRegel[]): EmpfehlungsRegel[] {
  const prioritaetRang: Record<string, number> = { hoch: 3, mittel: 2, niedrig: 1 };
  return [...empfehlungen].sort((a, b) => 
    prioritaetRang[b.empfehlung.prioritaet] - prioritaetRang[a.empfehlung.prioritaet]
  );
}

export function zaehleFoerderfaehige(empfehlungen: EmpfehlungsRegel[]): number {
  return empfehlungen.filter(e => e.empfehlung.foerderrelevant).length;
}
