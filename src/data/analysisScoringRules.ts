// Bewertungs-Logik für die Digitalisierungs-Analyse

// Typen für Analyse-Daten
export interface OnlineData {
  website_vorhanden?: string;
  website_responsive?: string;
  website_https?: string;
  website_aktualisierung?: string;
  website_ladezeit?: string;
  seo_aktiv_betrieben?: string;
}

export interface SystemeData {
  crm_vorhanden?: string;
  erp_vorhanden?: string;
  dms_vorhanden?: string;
  crm_integration_email?: boolean;
  erp_integration_crm?: boolean;
}

export interface ProzesseData {
  auftragserfassung?: string;
  auftragsbearbeitung_medienbruch?: boolean;
  rechnungsstellung?: string;
  dokumente_vorlagen?: string;
  vertrieb_angebotserstellung?: string;
}

export interface DatenData {
  backup_vorhanden?: string;
  backup_frequenz?: string;
  backup_automatisiert?: boolean;
  firewall_vorhanden?: boolean;
  zwei_faktor_auth?: string;
  daten_ordnerstruktur?: string;
}

// Bewertungsstufen
export type MaturityLevel = 'kritisch' | 'ausbaufaehig' | 'reif';

export interface ScoringResult {
  level: MaturityLevel;
  score: number; // 0-100
  details: string[];
}

// =============================================
// SCORING RULES
// =============================================

export const SCORING_RULES = {
  // Online-Auftritt Bewertung
  online: {
    kritisch: (data: OnlineData): boolean => {
      return !data.website_vorhanden || data.website_vorhanden === 'Nein' ||
             data.website_responsive === 'Nein' ||
             data.website_https === 'Nein';
    },
    ausbaufaehig: (data: OnlineData): boolean => {
      return data.website_aktualisierung === 'Seltener' ||
             data.website_aktualisierung === 'Nie' ||
             data.seo_aktiv_betrieben === 'Nein' ||
             data.website_ladezeit === 'langsam';
    },
    reif: (data: OnlineData): boolean => {
      return data.website_vorhanden === 'Ja' &&
             data.website_responsive === 'Ja' &&
             data.website_https === 'Ja' &&
             (data.website_aktualisierung === 'Wöchentlich' || 
              data.website_aktualisierung === 'Täglich') &&
             data.seo_aktiv_betrieben === 'Ja';
    }
  },
  
  // Systeme Bewertung
  systeme: {
    kritisch: (data: SystemeData): boolean => {
      return (data.crm_vorhanden === 'Nein' || !data.crm_vorhanden) &&
             (data.erp_vorhanden === 'Nein' || !data.erp_vorhanden) &&
             (data.dms_vorhanden === 'Nein' || !data.dms_vorhanden);
    },
    ausbaufaehig: (data: SystemeData): boolean => {
      const hasCRM = data.crm_vorhanden === 'Ja';
      const hasERP = data.erp_vorhanden === 'Ja';
      const hasDMS = data.dms_vorhanden === 'Ja';
      const count = [hasCRM, hasERP, hasDMS].filter(Boolean).length;
      return count === 1 || count === 2;
    },
    reif: (data: SystemeData): boolean => {
      return data.crm_vorhanden === 'Ja' &&
             data.erp_vorhanden === 'Ja' &&
             data.dms_vorhanden === 'Ja' &&
             data.crm_integration_email === true &&
             data.erp_integration_crm === true;
    }
  },
  
  // Prozesse Bewertung
  prozesse: {
    kritisch: (data: ProzesseData): boolean => {
      return data.auftragserfassung === 'papier' ||
             data.auftragsbearbeitung_medienbruch === true ||
             data.rechnungsstellung === 'Manuell' ||
             !data.dokumente_vorlagen ||
             data.dokumente_vorlagen === 'keine';
    },
    ausbaufaehig: (data: ProzesseData): boolean => {
      return data.vertrieb_angebotserstellung === 'Teilautomatisiert (Vorlagen)' ||
             data.rechnungsstellung === 'Halbautomatisch' ||
             data.dokumente_vorlagen === 'Teilweise';
    },
    reif: (data: ProzesseData): boolean => {
      return data.vertrieb_angebotserstellung === 'Vollautomatisch (CRM/ERP)' &&
             data.rechnungsstellung === 'Vollautomatisch' &&
             data.dokumente_vorlagen === 'Vorhanden' &&
             data.auftragsbearbeitung_medienbruch !== true;
    }
  },
  
  // Daten & Sicherheit Bewertung
  daten: {
    kritisch: (data: DatenData): boolean => {
      return !data.backup_vorhanden ||
             data.backup_vorhanden === 'Nein' ||
             data.firewall_vorhanden !== true ||
             data.zwei_faktor_auth === 'nirgends' ||
             data.daten_ordnerstruktur === 'chaotisch';
    },
    ausbaufaehig: (data: DatenData): boolean => {
      return data.backup_vorhanden === 'Ja' &&
             (data.backup_frequenz === 'Wöchentlich' || 
              data.backup_frequenz === 'Monatlich') ||
             data.zwei_faktor_auth === 'Teilweise' ||
             data.daten_ordnerstruktur === 'teilweise';
    },
    reif: (data: DatenData): boolean => {
      return data.backup_vorhanden === 'Ja' &&
             data.backup_frequenz === 'Täglich' &&
             data.backup_automatisiert === true &&
             data.firewall_vorhanden === true &&
             data.zwei_faktor_auth === 'ueberall' &&
             data.daten_ordnerstruktur === 'klar';
    }
  }
};

// =============================================
// SCORING FUNCTIONS
// =============================================

export const evaluateOnline = (data: OnlineData): ScoringResult => {
  const details: string[] = [];
  let score = 50;
  
  if (SCORING_RULES.online.kritisch(data)) {
    if (!data.website_vorhanden || data.website_vorhanden === 'Nein') {
      details.push('Keine Website vorhanden - kritischer Handlungsbedarf');
      score -= 30;
    }
    if (data.website_responsive === 'Nein') {
      details.push('Website nicht mobil-optimiert');
      score -= 15;
    }
    if (data.website_https === 'Nein') {
      details.push('Keine HTTPS-Verschlüsselung - Sicherheitsrisiko');
      score -= 20;
    }
    return { level: 'kritisch', score: Math.max(0, score), details };
  }
  
  if (SCORING_RULES.online.reif(data)) {
    details.push('Website-Präsenz vollständig ausgereift');
    details.push('SEO aktiv betrieben');
    details.push('Regelmäßige Aktualisierung');
    return { level: 'reif', score: 90, details };
  }
  
  // Ausbaufähig
  if (data.website_aktualisierung === 'Seltener' || data.website_aktualisierung === 'Nie') {
    details.push('Website wird selten aktualisiert');
    score -= 10;
  }
  if (data.seo_aktiv_betrieben === 'Nein') {
    details.push('SEO wird nicht aktiv betrieben');
    score -= 10;
  }
  
  return { level: 'ausbaufaehig', score, details };
};

export const evaluateSysteme = (data: SystemeData): ScoringResult => {
  const details: string[] = [];
  let score = 50;
  
  if (SCORING_RULES.systeme.kritisch(data)) {
    details.push('Keine zentralen Systeme (CRM, ERP, DMS) vorhanden');
    details.push('Dringende Digitalisierung erforderlich');
    return { level: 'kritisch', score: 20, details };
  }
  
  if (SCORING_RULES.systeme.reif(data)) {
    details.push('Vollständige Systemlandschaft vorhanden');
    details.push('Systeme sind miteinander integriert');
    return { level: 'reif', score: 95, details };
  }
  
  // Ausbaufähig
  const hasCRM = data.crm_vorhanden === 'Ja';
  const hasERP = data.erp_vorhanden === 'Ja';
  const hasDMS = data.dms_vorhanden === 'Ja';
  
  if (hasCRM) {
    details.push('CRM-System vorhanden');
    score += 15;
  } else {
    details.push('Kein CRM-System - Kundendaten dezentral');
  }
  
  if (hasERP) {
    details.push('ERP-System vorhanden');
    score += 15;
  } else {
    details.push('Kein ERP-System');
  }
  
  if (hasDMS) {
    details.push('DMS vorhanden');
    score += 10;
  } else {
    details.push('Kein Dokumentenmanagement');
  }
  
  return { level: 'ausbaufaehig', score, details };
};

export const evaluateProzesse = (data: ProzesseData): ScoringResult => {
  const details: string[] = [];
  let score = 50;
  
  if (SCORING_RULES.prozesse.kritisch(data)) {
    if (data.auftragserfassung === 'papier') {
      details.push('Auftragserfassung auf Papier - Digitalisierung dringend nötig');
      score -= 25;
    }
    if (data.auftragsbearbeitung_medienbruch) {
      details.push('Medienbrüche in der Auftragsbearbeitung');
      score -= 15;
    }
    if (data.rechnungsstellung === 'Manuell') {
      details.push('Manuelle Rechnungsstellung - hohes Fehlerpotenzial');
      score -= 10;
    }
    return { level: 'kritisch', score: Math.max(0, score), details };
  }
  
  if (SCORING_RULES.prozesse.reif(data)) {
    details.push('Prozesse vollständig automatisiert');
    details.push('Keine Medienbrüche');
    details.push('Standardisierte Dokumentenvorlagen');
    return { level: 'reif', score: 95, details };
  }
  
  // Ausbaufähig
  if (data.vertrieb_angebotserstellung === 'Teilautomatisiert (Vorlagen)') {
    details.push('Angebotserstellung teilweise automatisiert');
    score += 10;
  }
  if (data.rechnungsstellung === 'Halbautomatisch') {
    details.push('Rechnungsstellung halbautomatisch');
    score += 10;
  }
  
  return { level: 'ausbaufaehig', score, details };
};

export const evaluateDaten = (data: DatenData): ScoringResult => {
  const details: string[] = [];
  let score = 50;
  
  if (SCORING_RULES.daten.kritisch(data)) {
    if (!data.backup_vorhanden || data.backup_vorhanden === 'Nein') {
      details.push('KRITISCH: Kein Backup vorhanden - Datenverlustrisiko!');
      score -= 40;
    }
    if (!data.firewall_vorhanden) {
      details.push('Keine Firewall - Sicherheitsrisiko');
      score -= 20;
    }
    if (data.zwei_faktor_auth === 'nirgends') {
      details.push('Keine Zwei-Faktor-Authentifizierung');
      score -= 15;
    }
    return { level: 'kritisch', score: Math.max(0, score), details };
  }
  
  if (SCORING_RULES.daten.reif(data)) {
    details.push('Datensicherheit auf hohem Niveau');
    details.push('Automatische tägliche Backups');
    details.push('2FA überall aktiviert');
    return { level: 'reif', score: 95, details };
  }
  
  // Ausbaufähig
  if (data.backup_vorhanden === 'Ja') {
    details.push('Backup vorhanden');
    score += 15;
  }
  if (data.firewall_vorhanden) {
    details.push('Firewall aktiv');
    score += 10;
  }
  
  return { level: 'ausbaufaehig', score, details };
};

// =============================================
// GESAMTBEWERTUNG
// =============================================

export interface GesamtbewertungResult {
  digitalisierungsgrad: number; // 0-100
  gesamtLevel: MaturityLevel;
  bereiche: {
    online: ScoringResult;
    systeme: ScoringResult;
    prozesse: ScoringResult;
    daten: ScoringResult;
  };
  prioritaeten: string[];
  empfehlungen: string[];
}

export const berechneGesamtbewertung = (
  online: OnlineData,
  systeme: SystemeData,
  prozesse: ProzesseData,
  daten: DatenData
): GesamtbewertungResult => {
  const onlineResult = evaluateOnline(online);
  const systemeResult = evaluateSysteme(systeme);
  const prozesseResult = evaluateProzesse(prozesse);
  const datenResult = evaluateDaten(daten);
  
  // Gewichteter Durchschnitt
  const digitalisierungsgrad = Math.round(
    (onlineResult.score * 0.2) +
    (systemeResult.score * 0.3) +
    (prozesseResult.score * 0.3) +
    (datenResult.score * 0.2)
  );
  
  // Gesamtlevel bestimmen
  const levels = [onlineResult.level, systemeResult.level, prozesseResult.level, datenResult.level];
  const kritischCount = levels.filter(l => l === 'kritisch').length;
  const reifCount = levels.filter(l => l === 'reif').length;
  
  let gesamtLevel: MaturityLevel;
  if (kritischCount >= 2) {
    gesamtLevel = 'kritisch';
  } else if (reifCount >= 3) {
    gesamtLevel = 'reif';
  } else {
    gesamtLevel = 'ausbaufaehig';
  }
  
  // Prioritäten ableiten
  const prioritaeten: string[] = [];
  if (onlineResult.level === 'kritisch') prioritaeten.push('Online-Auftritt modernisieren');
  if (systemeResult.level === 'kritisch') prioritaeten.push('Systemlandschaft aufbauen');
  if (prozesseResult.level === 'kritisch') prioritaeten.push('Prozesse digitalisieren');
  if (datenResult.level === 'kritisch') prioritaeten.push('Datensicherheit erhöhen');
  
  // Empfehlungen
  const empfehlungen: string[] = [];
  if (digitalisierungsgrad < 40) {
    empfehlungen.push('Grundlegende Digitalisierungsstrategie entwickeln');
    empfehlungen.push('Quick-Wins identifizieren und umsetzen');
  } else if (digitalisierungsgrad < 70) {
    empfehlungen.push('Systemintegration vorantreiben');
    empfehlungen.push('Automatisierungspotenziale ausschöpfen');
  } else {
    empfehlungen.push('KI-Potenziale evaluieren');
    empfehlungen.push('Prozessoptimierung auf nächstes Level bringen');
  }
  
  return {
    digitalisierungsgrad,
    gesamtLevel,
    bereiche: {
      online: onlineResult,
      systeme: systemeResult,
      prozesse: prozesseResult,
      daten: datenResult
    },
    prioritaeten,
    empfehlungen
  };
};
