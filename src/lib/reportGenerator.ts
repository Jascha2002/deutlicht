// ============================================================================
// TEIL 4: Report-Generator - Vollständiger Beratungsbericht
// ============================================================================

import type { GesamtAnalyse, BereichsAnalyse, Empfehlung } from './analysisEngine';

// Types
export interface ClientStammdaten {
  unternehmensname: string;
  rechtsform?: string;
  branche?: string;
  branche_sonstiges?: string;
  gruendungsjahr?: number;
  standorte?: string;
  hauptsitz_plz?: string;
  hauptsitz_ort?: string;
  mitarbeiterzahl?: number;
  mitarbeiterzahl_kategorie?: string;
  jahresumsatz?: string;
  jahresumsatz_kategorie?: string;
  zielgruppen_b2b?: boolean;
  zielgruppen_b2c?: boolean;
  zielgruppen_beschreibung?: string;
  geschaeftsmodell?: string;
  ansprechpartner_name?: string;
  ansprechpartner_position?: string;
  ansprechpartner_email?: string;
  ansprechpartner_telefon?: string;
}

export interface ClientOnline {
  website_vorhanden?: string;
  website_url?: string;
  website_cms?: string;
  website_hosting?: string;
  website_responsive?: string;
  website_https?: string;
  website_ladezeit?: string;
  website_aktualisierung?: string;
  website_aktualisierung_wer?: string;
  website_mehrsprachig?: boolean;
  website_barrierefreiheit?: string;
  seo_aktiv_betrieben?: string;
  seo_google_my_business?: boolean;
  seo_keywords_definiert?: boolean;
  seo_ranking_zufriedenheit?: number;
  shop_vorhanden?: string;
  shop_system?: string;
  shop_produkte_anzahl?: number;
  shop_erp_anbindung?: boolean;
  buchungssystem_vorhanden?: boolean;
  buchungssystem_typ?: string;
  online_zusatz?: string;
}

export interface ClientSysteme {
  crm_vorhanden?: string;
  crm_system?: string;
  crm_nutzer_anzahl?: number;
  crm_datenpflege?: string;
  crm_zufriedenheit?: number;
  crm_integration_email?: boolean;
  crm_integration_telefonie?: boolean;
  erp_vorhanden?: string;
  erp_system?: string;
  erp_module?: string[];
  erp_integration_crm?: boolean;
  erp_integration_shop?: boolean;
  erp_zufriedenheit?: number;
  buchhaltung_system?: string;
  buchhaltung_belege_digital?: string;
  buchhaltung_steuerberater_zugriff?: boolean;
  dms_vorhanden?: string;
  dms_system?: string;
  dms_versionierung?: boolean;
  dms_volltextsuche?: boolean;
  dms_berechtigungskonzept?: string;
  pm_tool_vorhanden?: boolean;
  pm_tool?: string;
  zeiterfassung_vorhanden?: boolean;
  zeiterfassung_system?: string;
  email_system?: string;
  chat_tool?: string;
  videokonferenz?: string;
  branchensoftware?: string[];
  branchensoftware_details?: string;
  systeme_zusatz?: string;
}

export interface ClientProzesse {
  vertrieb_leadgewinnung?: string[];
  vertrieb_angebotserstellung?: string;
  vertrieb_angebotserstellung_tool?: string;
  vertrieb_angebotserstellung_dauer?: string;
  vertrieb_nachverfolgung?: string;
  vertrieb_erfolgsquote?: string;
  vertrieb_crm_nutzung?: string;
  auftragseingang_kanal?: string[];
  auftragserfassung?: string;
  auftragsbearbeitung_system?: string;
  auftragsbearbeitung_medienbruch?: boolean;
  auftragsstatus_tracking?: string;
  kundenkommunikation?: string;
  rechnungsstellung?: string;
  rechnungsstellung_tool?: string;
  rechnungsversand?: string;
  rechnungsstellung_dauer?: string;
  dokumente_vorlagen?: string;
  dokumente_freigabe?: string;
  dokumente_ablage?: string;
  dokumente_suche?: string;
  service_kanal?: string[];
  service_ticket_system?: boolean;
  service_ticket_tool?: string;
  service_reaktionszeit?: string;
  service_wissensdatenbank?: boolean;
  meetings_frequenz?: string;
  meetings_protokolle?: string;
  entscheidungsprozesse?: string;
  prozesse_zusatz?: string;
}

export interface ClientDaten {
  daten_ablage_ort?: string[];
  daten_cloud_anbieter?: string;
  daten_server_standort?: string;
  daten_ordnerstruktur?: string;
  daten_namenskonvention?: string;
  daten_dubletten?: string;
  backup_vorhanden?: string;
  backup_frequenz?: string;
  backup_speicherort?: string;
  backup_getestet?: string;
  backup_automatisiert?: boolean;
  firewall_vorhanden?: boolean;
  antivirus_vorhanden?: boolean;
  vpn_vorhanden?: boolean;
  zwei_faktor_auth?: string;
  passwort_manager?: string;
  passwort_richtlinie?: string;
  dsgvo_verzeichnis_vorhanden?: boolean;
  dsgvo_auftragsverarbeiter_vertraege?: boolean;
  dsgvo_loeschkonzept?: string;
  dsgvo_datenschutzbeauftragter?: string;
  zugriffskontrolle?: string;
  externe_zugriffe?: string;
  mitarbeiter_schulung_it_security?: string;
  daten_zusatz?: string;
}

export interface ClientSocial {
  kanaele_aktiv?: string[];
  linkedin_follower?: number;
  linkedin_frequenz?: string;
  facebook_follower?: number;
  facebook_frequenz?: string;
  instagram_follower?: number;
  instagram_frequenz?: string;
  content_redaktionsplan?: boolean;
  content_ersteller?: string;
  content_budget_monatlich?: string;
  newsletter_vorhanden?: boolean;
  newsletter_tool?: string;
  newsletter_abonnenten?: number;
  newsletter_frequenz?: string;
  newsletter_oeffnungsrate?: string;
  online_werbung_aktiv?: boolean;
  werbung_google_ads?: boolean;
  werbung_facebook_ads?: boolean;
  werbung_linkedin_ads?: boolean;
  werbung_budget_monatlich?: string;
  social_zusatz?: string;
}

export interface ClientReporting {
  kennzahlen_erfasst?: boolean;
  kennzahlen_liste?: string[];
  dashboard_vorhanden?: boolean;
  dashboard_tool?: string;
  reporting_frequenz?: string;
  reporting_automatisiert?: string;
  datenqualitaet?: string;
  auswertungen_basis?: string;
  reporting_zusatz?: string;
}

export interface ClientSchulung {
  onboarding_prozess?: string;
  onboarding_dokumentiert?: boolean;
  onboarding_dauer?: string;
  arbeitsanweisungen_vorhanden?: boolean;
  arbeitsanweisungen_aktuell?: boolean;
  arbeitsanweisungen_format?: string;
  wissensdatenbank_vorhanden?: boolean;
  wissensdatenbank_tool?: string;
  schulungen_regelmaessig?: boolean;
  schulungen_intern_extern?: string;
  schulung_zusatz?: string;
}

export interface ClientZiele {
  digitalisierung_prioritaet?: number;
  budget_verfuegbar?: string;
  budget_hoehe?: string;
  zeitrahmen?: string;
  schmerzpunkte?: string[];
  schmerzpunkte_details?: string;
  ziele_konkret?: string[];
  ziele_details?: string;
  foerderung_interesse?: boolean;
  foerderung_beratung_benoetigt?: boolean;
  foerderung_bereits_beantragt?: boolean;
  foerderung_programme?: string;
  wettbewerb_digitalisierung?: string;
  ziele_zusatz?: string;
}

export interface FullClientData {
  stammdaten: ClientStammdaten;
  online: ClientOnline;
  systeme: ClientSysteme;
  prozesse: ClientProzesse;
  daten: ClientDaten;
  social: ClientSocial;
  reporting: ClientReporting;
  schulung: ClientSchulung;
  ziele: ClientZiele;
}

export interface Bericht {
  deckblatt: string;
  managementSummary: string;
  unternehmensprofil: string;
  istAnalyse: string;
  handlungsempfehlungen: string;
  roadmap: string;
  anhang: string | null;
}

export type ReportVersion = 'berater' | 'kunde';

// ============================================================================
// Haupt-Report-Generator-Funktion
// ============================================================================

export function generateBeratungsbericht(
  clientData: FullClientData, 
  analysis: GesamtAnalyse, 
  version: ReportVersion = 'berater'
): string {
  const today = new Date().toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const bericht: Bericht = {
    deckblatt: generateDeckblatt(clientData, today),
    managementSummary: generateManagementSummary(clientData, analysis),
    unternehmensprofil: generateUnternehmensprofil(clientData),
    istAnalyse: generateIstAnalyse(clientData, analysis),
    handlungsempfehlungen: generateHandlungsempfehlungen(analysis),
    roadmap: generateRoadmap(analysis),
    anhang: version === 'berater' ? generateAnhang(clientData, analysis) : null
  };
  
  return formatReport(bericht, version);
}

// ============================================================================
// 1. Deckblatt
// ============================================================================

function generateDeckblatt(clientData: FullClientData, datum: string): string {
  return `
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║                 DIGITALE UNTERNEHMENSANALYSE                      ║
║                 UND HANDLUNGSEMPFEHLUNGEN                         ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝


${clientData.stammdaten.unternehmensname}
${clientData.stammdaten.branche || ''}

Stand: ${datum}


═══════════════════════════════════════════════════════════════════

Erstellt durch:
DeutLicht - Digitalisierungsberatung

Kontakt:
E-Mail: info@deutlicht.de
Website: www.deutlicht.de

═══════════════════════════════════════════════════════════════════
`;
}

// ============================================================================
// 2. Management Summary
// ============================================================================

function generateManagementSummary(clientData: FullClientData, analysis: GesamtAnalyse): string {
  const topEmpfehlungen = analysis.empfehlungen
    .filter(e => e.prioritaet === 'hoch')
    .slice(0, 5);
  
  const kritischeBereiche = Object.entries(analysis.bewertungen)
    .filter(([, val]) => val === 'kritisch')
    .map(([key]) => key);
  
  const s = clientData.stammdaten;
  
  return `
═══════════════════════════════════════════════════════════════════
                         MANAGEMENT SUMMARY
═══════════════════════════════════════════════════════════════════

KURZPROFIL DES UNTERNEHMENS

${s.unternehmensname} ist ein ${s.rechtsform || 'Unternehmen'} 
in der Branche ${s.branche || '[Branche]'} mit Sitz in ${s.hauptsitz_ort || '[Standort]'}.

Das Unternehmen beschäftigt derzeit ca. ${s.mitarbeiterzahl || '[Anzahl]'} Mitarbeiter 
an ${s.standorte || 'einem Standort'}.

Geschäftsmodell: ${s.geschaeftsmodell || 'Keine detaillierte Beschreibung vorhanden.'}


WICHTIGSTE HERAUSFORDERUNGEN

Die Analyse zeigt Handlungsbedarf in folgenden Bereichen:

${analysis.schwaechen.slice(0, 8).map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

${kritischeBereiche.length > 0 ? `
KRITISCHE BEREICHE (sofortiger Handlungsbedarf):
${kritischeBereiche.map(b => `  • ${b.toUpperCase()}`).join('\n')}
` : ''}


ZENTRALE DIGITALISIERUNGSPOTENZIALE

Durch gezielte Maßnahmen in den identifizierten Handlungsfeldern lassen sich 
voraussichtlich folgende Verbesserungen erzielen:

  • Zeitersparnis: 20-40% durch Prozessautomatisierung
  • Fehlerreduktion: bis zu 80% durch digitale Workflows
  • Transparenz: Echtzeit-Übersicht über alle Prozesse
  • Skalierbarkeit: Wachstum ohne proportionale Personalaufstockung
  • Kundenzufriedenheit: schnellere Reaktionszeiten, weniger Fehler


PRIORISIERTE MASSNAHMEN MIT GRÖSSTEM HEBEL

Die folgenden ${topEmpfehlungen.length} Maßnahmen versprechen den größten Nutzen:

${topEmpfehlungen.map((e, i) => `
${i + 1}. ${e.titel}
   Bereich: ${e.bereich}
   Nutzen: ${e.nutzen}
   Zeitrahmen: ${e.zeitraum}
`).join('\n')}


ZUSAMMENFASSUNG

Die vorliegende Roadmap priorisiert schnell wirksame Sofort-Maßnahmen (0-3 Monate) 
sowie mittel- und langfristige Projekte (bis 24 Monate). Der Bericht dient als 
Grundlage für interne Entscheidungen und kann zur Beantragung von Fördermitteln 
herangezogen werden. Die konkreten Förderprogramme werden regional ermittelt.

Gesamtbewertung Digitalisierungsgrad: ${analysis.gesamtscore}/100 Punkte

═══════════════════════════════════════════════════════════════════
`;
}

// ============================================================================
// 3. Unternehmensprofil
// ============================================================================

function generateUnternehmensprofil(clientData: FullClientData): string {
  const s = clientData.stammdaten;
  
  let zielgruppen = '';
  if (s.zielgruppen_b2b || s.zielgruppen_b2c) {
    zielgruppen = [
      s.zielgruppen_b2b ? 'B2B' : '',
      s.zielgruppen_b2c ? 'B2C' : ''
    ].filter(Boolean).join(' & ');
  }
  
  return `
═══════════════════════════════════════════════════════════════════
                       UNTERNEHMENSPROFIL
═══════════════════════════════════════════════════════════════════

Unternehmensname:     ${s.unternehmensname}
Rechtsform:           ${s.rechtsform || 'k.A.'}
Branche:              ${s.branche}${s.branche_sonstiges ? ` (${s.branche_sonstiges})` : ''}
Gründungsjahr:        ${s.gruendungsjahr || 'k.A.'}

Standorte:            ${s.standorte || 'k.A.'}
Hauptsitz:            ${s.hauptsitz_plz || ''} ${s.hauptsitz_ort || 'k.A.'}

Mitarbeiterzahl:      ${s.mitarbeiterzahl || 'k.A.'} (${s.mitarbeiterzahl_kategorie || 'k.A.'})
Jahresumsatz:         ${s.jahresumsatz_kategorie || 'k.A.'}

Zielgruppen:          ${zielgruppen || 'k.A.'}
                      ${s.zielgruppen_beschreibung || ''}


GESCHÄFTSMODELL

${s.geschaeftsmodell || 'Keine detaillierte Beschreibung vorhanden.'}


ANSPRECHPARTNER

Name:                 ${s.ansprechpartner_name || 'k.A.'}
Position:             ${s.ansprechpartner_position || 'k.A.'}
E-Mail:               ${s.ansprechpartner_email || 'k.A.'}
Telefon:              ${s.ansprechpartner_telefon || 'k.A.'}

═══════════════════════════════════════════════════════════════════
`;
}

// ============================================================================
// 4. IST-Analyse nach Handlungsfeldern
// ============================================================================

function generateIstAnalyse(clientData: FullClientData, analysis: GesamtAnalyse): string {
  let output = `
═══════════════════════════════════════════════════════════════════
              IST-ANALYSE NACH HANDLUNGSFELDERN
═══════════════════════════════════════════════════════════════════
`;

  // 4.1 Online-Auftritt
  output += generateOnlineAnalyse(clientData.online, analysis.bereiche.online);
  
  // 4.2 Systeme
  output += generateSystemeAnalyse(clientData.systeme, analysis.bereiche.systeme);
  
  // 4.3 Prozesse
  output += generateProzesseAnalyse(clientData.prozesse, analysis.bereiche.prozesse);
  
  // 4.4 Daten & Sicherheit
  output += generateDatenAnalyse(clientData.daten, analysis.bereiche.daten);
  
  // 4.5 Social Media
  output += generateSocialAnalyse(clientData.social, analysis.bereiche.social);
  
  // 4.6 Reporting
  output += generateReportingAnalyse(clientData.reporting, analysis.bereiche.reporting);
  
  // 4.7 Schulung
  output += generateSchulungAnalyse(clientData.schulung, analysis.bereiche.schulung);
  
  // 4.8 Ziele & Schmerzpunkte
  output += generateZieleAnalyse(clientData.ziele);
  
  return output;
}

function generateBewertungBlock(bewertung: BereichsAnalyse): string {
  const bewertungLabel = bewertung.bewertung.toUpperCase();
  let statusIcon = '';
  
  if (bewertung.bewertung === 'kritisch') {
    statusIcon = '⛔ KRITISCH - Sofortiger Handlungsbedarf!';
  } else if (bewertung.bewertung === 'ausbaufaehig') {
    statusIcon = '⚠️  AUSBAUFÄHIG - Mittelfristiger Handlungsbedarf';
  } else {
    statusIcon = '✅ REIF - Gut aufgestellt';
  }
  
  return `

BEWERTUNG

Stärken:
${bewertung.staerken.length > 0 ? bewertung.staerken.map(s => `  ✓ ${s}`).join('\n') : '  (keine identifiziert)'}

Schwächen/Potenziale:
${bewertung.schwaechen.length > 0 ? bewertung.schwaechen.map(s => `  ⚠ ${s}`).join('\n') : '  (keine identifiziert)'}

Gesamtbewertung: ${bewertungLabel} (${bewertung.score}/100 Punkte)

${statusIcon}
`;
}

function generateOnlineAnalyse(data: ClientOnline, bewertung: BereichsAnalyse): string {
  return `

───────────────────────────────────────────────────────────────────
4.1  ONLINE-AUFTRITT & KOMMUNIKATION
───────────────────────────────────────────────────────────────────

STATUS

Website:              ${data.website_vorhanden || 'k.A.'}
${data.website_url ? `URL:                  ${data.website_url}` : ''}
CMS:                  ${data.website_cms || 'k.A.'}
Hosting:              ${data.website_hosting || 'k.A.'}
Responsive:           ${data.website_responsive || 'k.A.'}
HTTPS:                ${data.website_https || 'k.A.'}
Ladezeit:             ${data.website_ladezeit || 'k.A.'}

Aktualisierung:       ${data.website_aktualisierung || 'k.A.'}
Aktualisierung durch: ${data.website_aktualisierung_wer || 'k.A.'}
Mehrsprachig:         ${data.website_mehrsprachig ? 'Ja' : 'Nein'}

SEO:                  ${data.seo_aktiv_betrieben || 'k.A.'}
Google My Business:   ${data.seo_google_my_business ? 'Ja' : 'Nein'}

Online-Shop:          ${data.shop_vorhanden || 'k.A.'}
${data.shop_vorhanden === 'ja' ? `Shop-System:          ${data.shop_system || 'k.A.'}
Produkte:             ${data.shop_produkte_anzahl || 'k.A.'}
ERP-Anbindung:        ${data.shop_erp_anbindung ? 'Ja' : 'Nein'}` : ''}

Buchungssystem:       ${data.buchungssystem_vorhanden ? 'Vorhanden' : 'Nicht vorhanden'}

${data.online_zusatz ? `
Zusatzinformationen:
${data.online_zusatz}` : ''}
${generateBewertungBlock(bewertung)}`;
}

function generateSystemeAnalyse(data: ClientSysteme, bewertung: BereichsAnalyse): string {
  return `

───────────────────────────────────────────────────────────────────
4.2  SYSTEME & SOFTWARELANDSCHAFT
───────────────────────────────────────────────────────────────────

STATUS

CRM-System:           ${data.crm_vorhanden || 'k.A.'}
${data.crm_vorhanden === 'ja' ? `CRM-Software:         ${data.crm_system || 'k.A.'}
CRM-Nutzer:           ${data.crm_nutzer_anzahl || 'k.A.'}
CRM-Datenpflege:      ${data.crm_datenpflege || 'k.A.'}
CRM-Zufriedenheit:    ${data.crm_zufriedenheit || 'k.A.'}/5` : ''}

ERP/Warenwirtschaft:  ${data.erp_vorhanden || 'k.A.'}
${data.erp_vorhanden === 'ja' ? `ERP-System:           ${data.erp_system || 'k.A.'}
ERP-Module:           ${data.erp_module?.join(', ') || 'k.A.'}
ERP-CRM-Integration:  ${data.erp_integration_crm ? 'Ja' : 'Nein'}
ERP-Shop-Integration: ${data.erp_integration_shop ? 'Ja' : 'Nein'}
ERP-Zufriedenheit:    ${data.erp_zufriedenheit || 'k.A.'}/5` : ''}

Buchhaltung:          ${data.buchhaltung_system || 'k.A.'}
Digitale Belege:      ${data.buchhaltung_belege_digital || 'k.A.'}
Steuerberater-Zugriff: ${data.buchhaltung_steuerberater_zugriff ? 'Ja' : 'Nein'}

DMS:                  ${data.dms_vorhanden || 'k.A.'}
${data.dms_vorhanden === 'ja' ? `DMS-System:           ${data.dms_system || 'k.A.'}
Versionierung:        ${data.dms_versionierung ? 'Ja' : 'Nein'}
Volltextsuche:        ${data.dms_volltextsuche ? 'Ja' : 'Nein'}
Berechtigungen:       ${data.dms_berechtigungskonzept || 'k.A.'}` : ''}

Projektmanagement:    ${data.pm_tool_vorhanden ? data.pm_tool || 'Vorhanden' : 'Nicht vorhanden'}
Zeiterfassung:        ${data.zeiterfassung_vorhanden ? data.zeiterfassung_system || 'Vorhanden' : 'Nicht vorhanden'}

E-Mail:               ${data.email_system || 'k.A.'}
Chat/Kommunikation:   ${data.chat_tool || 'k.A.'}
Videokonferenz:       ${data.videokonferenz || 'k.A.'}

${data.branchensoftware?.length ? `
Branchensoftware:     ${data.branchensoftware.join(', ')}
${data.branchensoftware_details || ''}` : ''}

${data.systeme_zusatz ? `
Zusatzinformationen:
${data.systeme_zusatz}` : ''}
${generateBewertungBlock(bewertung)}`;
}

function generateProzesseAnalyse(data: ClientProzesse, bewertung: BereichsAnalyse): string {
  return `

───────────────────────────────────────────────────────────────────
4.3  PROZESSE & WORKFLOWS
───────────────────────────────────────────────────────────────────

STATUS - VERTRIEB

Leadgewinnung:        ${data.vertrieb_leadgewinnung?.join(', ') || 'k.A.'}
Angebotserstellung:   ${data.vertrieb_angebotserstellung || 'k.A.'}
${data.vertrieb_angebotserstellung_tool ? `Tool:                 ${data.vertrieb_angebotserstellung_tool}` : ''}
Dauer pro Angebot:    ${data.vertrieb_angebotserstellung_dauer || 'k.A.'}
Nachverfolgung:       ${data.vertrieb_nachverfolgung || 'k.A.'}
Erfolgsquote:         ${data.vertrieb_erfolgsquote || 'k.A.'}


STATUS - AUFTRAGSABWICKLUNG

Auftragseingang:      ${data.auftragseingang_kanal?.join(', ') || 'k.A.'}
Auftragserfassung:    ${data.auftragserfassung || 'k.A.'}
Bearbeitungssystem:   ${data.auftragsbearbeitung_system || 'k.A.'}
Medienbrüche:         ${data.auftragsbearbeitung_medienbruch ? 'Ja (problematisch!)' : 'Nein'}
Status-Tracking:      ${data.auftragsstatus_tracking || 'k.A.'}


STATUS - RECHNUNGSSTELLUNG

Rechnungsstellung:    ${data.rechnungsstellung || 'k.A.'}
${data.rechnungsstellung_tool ? `Tool:                 ${data.rechnungsstellung_tool}` : ''}
Versand:              ${data.rechnungsversand || 'k.A.'}
Dauer:                ${data.rechnungsstellung_dauer || 'k.A.'}


STATUS - DOKUMENTENWORKFLOW

Vorlagen:             ${data.dokumente_vorlagen || 'k.A.'}
Freigabeprozess:      ${data.dokumente_freigabe || 'k.A.'}
Ablage:               ${data.dokumente_ablage || 'k.A.'}
Suche:                ${data.dokumente_suche || 'k.A.'}


STATUS - SERVICE/SUPPORT

Service-Kanäle:       ${data.service_kanal?.join(', ') || 'k.A.'}
Ticket-System:        ${data.service_ticket_system ? `Ja (${data.service_ticket_tool || 'k.A.'})` : 'Nein'}
Reaktionszeit:        ${data.service_reaktionszeit || 'k.A.'}
Wissensdatenbank:     ${data.service_wissensdatenbank ? 'Ja' : 'Nein'}

${data.prozesse_zusatz ? `
Zusatzinformationen:
${data.prozesse_zusatz}` : ''}
${generateBewertungBlock(bewertung)}`;
}

function generateDatenAnalyse(data: ClientDaten, bewertung: BereichsAnalyse): string {
  return `

───────────────────────────────────────────────────────────────────
4.4  DATEN, SICHERHEIT & COMPLIANCE
───────────────────────────────────────────────────────────────────

STATUS - DATENABLAGE

Ablageorte:           ${data.daten_ablage_ort?.join(', ') || 'k.A.'}
${data.daten_cloud_anbieter ? `Cloud-Anbieter:       ${data.daten_cloud_anbieter}` : ''}
Server-Standort:      ${data.daten_server_standort || 'k.A.'}
Ordnerstruktur:       ${data.daten_ordnerstruktur || 'k.A.'}
Namenskonvention:     ${data.daten_namenskonvention || 'k.A.'}
Dubletten:            ${data.daten_dubletten || 'k.A.'}


STATUS - BACKUP & SICHERHEIT

Backup vorhanden:     ${data.backup_vorhanden || 'k.A.'}
${data.backup_vorhanden === 'ja' ? `Backup-Frequenz:      ${data.backup_frequenz || 'k.A.'}
Backup-Speicherort:   ${data.backup_speicherort || 'k.A.'}
Backup-Tests:         ${data.backup_getestet || 'k.A.'}
Automatisiert:        ${data.backup_automatisiert ? 'Ja' : 'Nein'}` : ''}

Firewall:             ${data.firewall_vorhanden ? 'Ja' : 'Nein'}
Antivirus:            ${data.antivirus_vorhanden ? 'Ja' : 'Nein'}
VPN:                  ${data.vpn_vorhanden ? 'Ja' : 'Nein'}
2-Faktor-Auth:        ${data.zwei_faktor_auth || 'k.A.'}
Passwort-Manager:     ${data.passwort_manager || 'k.A.'}
Passwort-Richtlinie:  ${data.passwort_richtlinie || 'k.A.'}


STATUS - DSGVO

Verzeichnis:          ${data.dsgvo_verzeichnis_vorhanden ? 'Vorhanden' : 'Fehlt'}
AV-Verträge:          ${data.dsgvo_auftragsverarbeiter_vertraege ? 'Vorhanden' : 'Fehlen'}
Löschkonzept:         ${data.dsgvo_loeschkonzept || 'k.A.'}
DSB:                  ${data.dsgvo_datenschutzbeauftragter || 'k.A.'}


STATUS - ZUGRIFFE

Zugriffskontrolle:    ${data.zugriffskontrolle || 'k.A.'}
Externe Zugriffe:     ${data.externe_zugriffe || 'k.A.'}
IT-Security-Schulung: ${data.mitarbeiter_schulung_it_security || 'k.A.'}

${data.daten_zusatz ? `
Zusatzinformationen:
${data.daten_zusatz}` : ''}
${generateBewertungBlock(bewertung)}`;
}

function generateSocialAnalyse(data: ClientSocial, bewertung: BereichsAnalyse): string {
  return `

───────────────────────────────────────────────────────────────────
4.5  SOCIAL MEDIA & MARKETING
───────────────────────────────────────────────────────────────────

STATUS - KANÄLE

Aktive Kanäle:        ${data.kanaele_aktiv?.join(', ') || 'k.A.'}

${data.kanaele_aktiv?.includes('LinkedIn') ? `LinkedIn:
  Follower:           ${data.linkedin_follower || 'k.A.'}
  Frequenz:           ${data.linkedin_frequenz || 'k.A.'}` : ''}

${data.kanaele_aktiv?.includes('Facebook') ? `Facebook:
  Follower:           ${data.facebook_follower || 'k.A.'}
  Frequenz:           ${data.facebook_frequenz || 'k.A.'}` : ''}

${data.kanaele_aktiv?.includes('Instagram') ? `Instagram:
  Follower:           ${data.instagram_follower || 'k.A.'}
  Frequenz:           ${data.instagram_frequenz || 'k.A.'}` : ''}

Redaktionsplan:       ${data.content_redaktionsplan ? 'Vorhanden' : 'Nicht vorhanden'}
Content-Ersteller:    ${data.content_ersteller || 'k.A.'}
Budget (monatlich):   ${data.content_budget_monatlich || 'k.A.'}


STATUS - NEWSLETTER

Newsletter:           ${data.newsletter_vorhanden ? 'Vorhanden' : 'Nicht vorhanden'}
${data.newsletter_vorhanden ? `Tool:                 ${data.newsletter_tool || 'k.A.'}
Abonnenten:           ${data.newsletter_abonnenten || 'k.A.'}
Frequenz:             ${data.newsletter_frequenz || 'k.A.'}
Öffnungsrate:         ${data.newsletter_oeffnungsrate || 'k.A.'}` : ''}


STATUS - ONLINE-WERBUNG

Werbung aktiv:        ${data.online_werbung_aktiv ? 'Ja' : 'Nein'}
${data.online_werbung_aktiv ? `Google Ads:           ${data.werbung_google_ads ? 'Ja' : 'Nein'}
Facebook Ads:         ${data.werbung_facebook_ads ? 'Ja' : 'Nein'}
LinkedIn Ads:         ${data.werbung_linkedin_ads ? 'Ja' : 'Nein'}
Budget (monatlich):   ${data.werbung_budget_monatlich || 'k.A.'}` : ''}

${data.social_zusatz ? `
Zusatzinformationen:
${data.social_zusatz}` : ''}
${generateBewertungBlock(bewertung)}`;
}

function generateReportingAnalyse(data: ClientReporting, bewertung: BereichsAnalyse): string {
  return `

───────────────────────────────────────────────────────────────────
4.6  REPORTING & KENNZAHLEN
───────────────────────────────────────────────────────────────────

STATUS

Kennzahlen erfasst:   ${data.kennzahlen_erfasst ? 'Ja' : 'Nein'}
${data.kennzahlen_erfasst ? `Kennzahlen:           ${data.kennzahlen_liste?.join(', ') || 'k.A.'}` : ''}

Dashboard vorhanden:  ${data.dashboard_vorhanden ? 'Ja' : 'Nein'}
${data.dashboard_vorhanden ? `Dashboard-Tool:       ${data.dashboard_tool || 'k.A.'}` : ''}

Reporting-Frequenz:   ${data.reporting_frequenz || 'k.A.'}
Automatisiert:        ${data.reporting_automatisiert || 'k.A.'}
Datenqualität:        ${data.datenqualitaet || 'k.A.'}
Auswertungsbasis:     ${data.auswertungen_basis || 'k.A.'}

${data.reporting_zusatz ? `
Zusatzinformationen:
${data.reporting_zusatz}` : ''}
${generateBewertungBlock(bewertung)}`;
}

function generateSchulungAnalyse(data: ClientSchulung, bewertung: BereichsAnalyse): string {
  return `

───────────────────────────────────────────────────────────────────
4.7  SCHULUNG & WISSENSMANAGEMENT
───────────────────────────────────────────────────────────────────

STATUS - ONBOARDING

Onboarding-Prozess:   ${data.onboarding_prozess || 'k.A.'}
Dokumentiert:         ${data.onboarding_dokumentiert ? 'Ja' : 'Nein'}
Dauer:                ${data.onboarding_dauer || 'k.A.'}


STATUS - ARBEITSANWEISUNGEN

Vorhanden:            ${data.arbeitsanweisungen_vorhanden ? 'Ja' : 'Nein'}
Aktuell:              ${data.arbeitsanweisungen_aktuell ? 'Ja' : 'Nein'}
Format:               ${data.arbeitsanweisungen_format || 'k.A.'}


STATUS - WISSENSDATENBANK

Vorhanden:            ${data.wissensdatenbank_vorhanden ? 'Ja' : 'Nein'}
${data.wissensdatenbank_vorhanden ? `Tool:                 ${data.wissensdatenbank_tool || 'k.A.'}` : ''}


STATUS - SCHULUNGEN

Regelmäßig:           ${data.schulungen_regelmaessig ? 'Ja' : 'Nein'}
Durchführung:         ${data.schulungen_intern_extern || 'k.A.'}

${data.schulung_zusatz ? `
Zusatzinformationen:
${data.schulung_zusatz}` : ''}
${generateBewertungBlock(bewertung)}`;
}

function generateZieleAnalyse(data: ClientZiele): string {
  return `

───────────────────────────────────────────────────────────────────
4.8  ZIELE & SCHMERZPUNKTE
───────────────────────────────────────────────────────────────────

DIGITALISIERUNGSPRIORITÄTEN

Priorität:            ${data.digitalisierung_prioritaet || 'k.A.'}/5
Budget verfügbar:     ${data.budget_verfuegbar || 'k.A.'}
${data.budget_verfuegbar === 'ja' ? `Budget-Höhe:          ${data.budget_hoehe || 'k.A.'}` : ''}
Zeitrahmen:           ${data.zeitrahmen || 'k.A.'}


IDENTIFIZIERTE SCHMERZPUNKTE

${data.schmerzpunkte?.length ? data.schmerzpunkte.map(s => `  • ${s}`).join('\n') : '  (keine angegeben)'}

${data.schmerzpunkte_details ? `
Details:
${data.schmerzpunkte_details}` : ''}


KONKRETE ZIELE

${data.ziele_konkret?.length ? data.ziele_konkret.map(z => `  • ${z}`).join('\n') : '  (keine angegeben)'}

${data.ziele_details ? `
Details:
${data.ziele_details}` : ''}


FÖRDERUNG

Interesse:            ${data.foerderung_interesse ? 'Ja' : 'Nein'}
Beratung benötigt:    ${data.foerderung_beratung_benoetigt ? 'Ja' : 'Nein'}
Bereits beantragt:    ${data.foerderung_bereits_beantragt ? 'Ja' : 'Nein'}
${data.foerderung_programme ? `Programme:            ${data.foerderung_programme}` : ''}

Wettbewerb Digitalisierung: ${data.wettbewerb_digitalisierung || 'k.A.'}

${data.ziele_zusatz ? `
Zusatzinformationen:
${data.ziele_zusatz}` : ''}
`;
}

// ============================================================================
// 5. Handlungsempfehlungen
// ============================================================================

function generateHandlungsempfehlungen(analysis: GesamtAnalyse): string {
  const empfehlungen = analysis.empfehlungen;
  
  let output = `

═══════════════════════════════════════════════════════════════════
                    HANDLUNGSEMPFEHLUNGEN
═══════════════════════════════════════════════════════════════════

Im Folgenden werden ${empfehlungen.length} konkrete Maßnahmen zur Digitalisierung 
und Prozessoptimierung dargestellt. Die Maßnahmen sind nach Bereichen gruppiert 
und mit Prioritäten versehen.

`;

  empfehlungen.forEach((e, i) => {
    let foerderText = '';
    if (e.foerderrelevant === 'ja') {
      foerderText = `✓ Diese Maßnahme ist förderfähig.
  Maßnahme unterstützt Digitalisierung und ist grundsätzlich förderfähig im Rahmen regionaler und bundesweiter Förderprogramme.`;
    } else if (e.foerderrelevant === 'teilweise') {
      foerderText = `⚬ Teilweise förderfähig (Einzelfallprüfung empfohlen)`;
    } else {
      foerderText = `✗ Nicht förderfähig`;
    }

    output += `
───────────────────────────────────────────────────────────────────
MASSNAHME M${i + 1}: ${e.titel}
───────────────────────────────────────────────────────────────────

Bereich:              ${e.bereich}
Priorität:            ${e.prioritaet.toUpperCase()}
Aufwand:              ${e.aufwand}
Geschätzte Kosten:    ${e.kosten || 'individuell'}
Zeitrahmen:           ${e.zeitraum}

BESCHREIBUNG
${e.beschreibung}

NUTZEN
${e.nutzen}

FÖRDERRELEVANZ
${foerderText}

`;
  });
  
  return output;
}

// ============================================================================
// 6. Roadmap
// ============================================================================

function generateRoadmap(analysis: GesamtAnalyse): string {
  const sofort = analysis.empfehlungen.filter(e => e.zeitraum === 'sofort');
  const mittel = analysis.empfehlungen.filter(e => e.zeitraum === 'mittel');
  const lang = analysis.empfehlungen.filter(e => e.zeitraum === 'langfristig');
  
  const formatEmpfehlung = (e: Empfehlung, i: number): string => {
    const nutzenKurz = e.nutzen.length > 120 ? e.nutzen.substring(0, 120) + '...' : e.nutzen;
    return `
${i + 1}. ${e.titel}
   Bereich: ${e.bereich}
   Priorität: ${e.prioritaet}
   Kurz-Nutzen: ${nutzenKurz}
`;
  };
  
  return `

═══════════════════════════════════════════════════════════════════
                      UMSETZUNGS-ROADMAP
═══════════════════════════════════════════════════════════════════

Die Maßnahmen sind in drei Zeiträume eingeteilt. Es empfiehlt sich, mit den 
Sofort-Maßnahmen zu beginnen, da diese oft die Grundlage für weiterführende 
Projekte bilden.


┌─────────────────────────────────────────────────────────────────┐
│  SOFORT-MASSNAHMEN (0-3 Monate) - ${sofort.length} Maßnahmen                     │
└─────────────────────────────────────────────────────────────────┘

${sofort.length > 0 ? sofort.map((e, i) => formatEmpfehlung(e, i)).join('') : 'Keine Sofort-Maßnahmen identifiziert.'}


┌─────────────────────────────────────────────────────────────────┐
│  NÄCHSTE SCHRITTE (3-12 Monate) - ${mittel.length} Maßnahmen                  │
└─────────────────────────────────────────────────────────────────┘

${mittel.length > 0 ? mittel.map((e, i) => formatEmpfehlung(e, i)).join('') : 'Keine mittelfristigen Maßnahmen identifiziert.'}


┌─────────────────────────────────────────────────────────────────┐
│  LANGFRISTIGE THEMEN (12+ Monate) - ${lang.length} Maßnahmen                 │
└─────────────────────────────────────────────────────────────────┘

${lang.length > 0 ? lang.map((e, i) => formatEmpfehlung(e, i)).join('') : 'Keine langfristigen Maßnahmen identifiziert.'}


EMPFOHLENE UMSETZUNGSREIHENFOLGE

1. Zunächst Basis schaffen: Backup, Sicherheit, DMS
2. Dann Prozesse digitalisieren: CRM, ERP, Workflows
3. Anschließend Optimierung: Integration, Automatisierung
4. Parallel: Online-Präsenz und Marketing ausbauen

═══════════════════════════════════════════════════════════════════
`;
}

// ============================================================================
// 7. Anhang (nur Berater-Version)
// ============================================================================

function generateAnhang(clientData: FullClientData, analysis: GesamtAnalyse): string {
  return `

═══════════════════════════════════════════════════════════════════
                           ANHANG
                    (nur für Berater)
═══════════════════════════════════════════════════════════════════

SCORING-DETAILS

Gesamtscore:          ${analysis.gesamtscore}/100 Punkte

Bereichs-Scores:
${Object.entries(analysis.bereiche).map(([key, val]) => 
  `  • ${key.charAt(0).toUpperCase() + key.slice(1)}: ${val.score}/100 (${val.bewertung})`
).join('\n')}


ROHDATEN-ZUSAMMENFASSUNG

Identifizierte Stärken: ${analysis.staerken.length}
Identifizierte Schwächen: ${analysis.schwaechen.length}
Generierte Empfehlungen: ${analysis.empfehlungen.length}

Förderfähige Maßnahmen:
  • Vollständig: ${analysis.empfehlungen.filter(e => e.foerderrelevant === 'ja').length}
  • Teilweise: ${analysis.empfehlungen.filter(e => e.foerderrelevant === 'teilweise').length}
  • Nicht förderfähig: ${analysis.empfehlungen.filter(e => e.foerderrelevant === 'nein').length}


KONTAKTDATEN KUNDE

${clientData.stammdaten.ansprechpartner_name || 'k.A.'}
${clientData.stammdaten.ansprechpartner_position || ''}
${clientData.stammdaten.ansprechpartner_email || ''}
${clientData.stammdaten.ansprechpartner_telefon || ''}

═══════════════════════════════════════════════════════════════════
`;
}

// ============================================================================
// 8. Format-Funktion
// ============================================================================

function formatReport(bericht: Bericht, version: ReportVersion): string {
  let output = bericht.deckblatt;
  output += '\n\n' + bericht.managementSummary;
  output += '\n\n' + bericht.unternehmensprofil;
  output += '\n\n' + bericht.istAnalyse;
  output += '\n\n' + bericht.handlungsempfehlungen;
  output += '\n\n' + bericht.roadmap;
  
  if (version === 'berater' && bericht.anhang) {
    output += '\n\n' + bericht.anhang;
  }
  
  output += `

═══════════════════════════════════════════════════════════════════
                     ENDE DES BERICHTS
═══════════════════════════════════════════════════════════════════

Dieser Bericht wurde erstellt durch:
DeutLicht - Digitalisierungsberatung

© ${new Date().getFullYear()} DeutLicht. Alle Rechte vorbehalten.
`;
  
  return output;
}

// ============================================================================
// Export-Hilfsfunktionen
// ============================================================================

/**
 * Erstellt einen Bericht im Markdown-Format für bessere Formatierung
 */
export function generateBeratungsberichtMarkdown(
  clientData: FullClientData, 
  analysis: GesamtAnalyse, 
  version: ReportVersion = 'berater'
): string {
  const plainText = generateBeratungsbericht(clientData, analysis, version);
  
  // Konvertiere ASCII-Boxen zu Markdown-Headers
  return plainText
    .replace(/═{3,}/g, '---')
    .replace(/─{3,}/g, '')
    .replace(/╔═+╗/g, '')
    .replace(/╚═+╝/g, '')
    .replace(/║/g, '')
    .replace(/┌─+┐/g, '')
    .replace(/└─+┘/g, '')
    .replace(/│/g, '');
}

/**
 * Erstellt eine JSON-Struktur des Berichts für API-Nutzung
 */
export function generateBeratungsberichtJSON(
  clientData: FullClientData, 
  analysis: GesamtAnalyse, 
  version: ReportVersion = 'berater'
): object {
  const today = new Date().toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    meta: {
      erstelltAm: today,
      version,
      unternehmen: clientData.stammdaten.unternehmensname
    },
    gesamtscore: analysis.gesamtscore,
    bewertungen: analysis.bewertungen,
    staerken: analysis.staerken,
    schwaechen: analysis.schwaechen,
    empfehlungen: analysis.empfehlungen,
    bereiche: analysis.bereiche,
    clientData: version === 'berater' ? clientData : undefined
  };
}
