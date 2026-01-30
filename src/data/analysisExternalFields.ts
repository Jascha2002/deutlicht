// ============================================================================
// EXTERNE ANALYSE-FELDER
// Für manuelle Eingabe von SEO-Analysen, Keyword-Daten, Wettbewerber-Infos
// ============================================================================

export interface ExterneAnalyse {
  // Website-Analyse
  website_check_durchgefuehrt?: boolean;
  website_check_datum?: string;
  website_check_tool?: string; // z.B. XOVI, Sistrix, SEMrush
  
  // Keyword-Analyse
  keywords?: KeywordAnalyse[];
  keyword_analyse_notizen?: string;
  
  // Wettbewerber
  wettbewerber?: WettbewerberAnalyse[];
  wettbewerber_notizen?: string;
  
  // Page Speed
  pagespeed_desktop?: 'gut' | 'mittel' | 'schlecht';
  pagespeed_desktop_score?: number;
  pagespeed_mobile?: 'gut' | 'mittel' | 'schlecht';
  pagespeed_mobile_score?: number;
  
  // Backlinks
  backlinks_anzahl?: number;
  backlinks_qualitaet?: 'gut' | 'mittel' | 'schlecht' | 'toxisch';
  backlinks_notizen?: string;
  
  // Social Media Wettbewerber
  social_wettbewerber_analyse?: SocialWettbewerberAnalyse[];
  
  // Sichtbarkeits-Index
  sichtbarkeit_index?: number;
  sichtbarkeit_tool?: string;
  sichtbarkeit_trend?: 'steigend' | 'stabil' | 'fallend';
  
  // Google My Business
  gmb_vorhanden?: boolean;
  gmb_bewertungen_anzahl?: number;
  gmb_bewertungen_durchschnitt?: number;
  gmb_vollstaendig?: boolean;
  gmb_notizen?: string;
  
  // Listings
  listings_check?: boolean;
  listings_konsistenz?: 'konsistent' | 'inkonsistent' | 'unvollstaendig';
  listings_portale?: string[];
  listings_notizen?: string;
  
  // Videomarketing
  videomarketing_vorhanden?: boolean;
  youtube_kanal?: boolean;
  youtube_abonnenten?: number;
  youtube_videos_anzahl?: number;
  video_qualitaet?: 'professionell' | 'semi-professionell' | 'amateurhaft';
  video_notizen?: string;
  
  // SWOT aus externer Analyse
  swot_staerken?: string;
  swot_schwaechen?: string;
  swot_chancen?: string;
  swot_risiken?: string;
  
  // Screenshots & Anhänge (URLs zu Storage)
  anhaenge?: AnalyseAnhang[];
  
  // Freitext für zusätzliche Analysen
  zusaetzliche_analysen?: string;
}

export interface KeywordAnalyse {
  keyword: string;
  suchvolumen_monatlich?: number;
  wettbewerb_anzahl?: number;
  aktuelle_position?: number;
  schwierigkeit?: 'niedrig' | 'mittel' | 'hoch';
  notiz?: string;
}

export interface WettbewerberAnalyse {
  name: string;
  website?: string;
  sichtbarkeit_index?: number;
  staerken?: string;
  schwaechen?: string;
  differenzierung?: string; // Was macht uns anders/besser?
}

export interface SocialWettbewerberAnalyse {
  name: string;
  plattform: 'LinkedIn' | 'Facebook' | 'Instagram' | 'Twitter' | 'TikTok' | 'YouTube';
  follower?: number;
  posting_frequenz?: string;
  engagement?: 'hoch' | 'mittel' | 'niedrig';
  notiz?: string;
}

export interface AnalyseAnhang {
  typ: 'screenshot' | 'report' | 'dokument';
  titel: string;
  beschreibung?: string;
  url?: string; // Link zu Storage oder extern
  datum?: string;
}

// ============================================================================
// DROPDOWN-OPTIONEN FÜR EXTERNE ANALYSEN
// ============================================================================

export const EXTERNE_ANALYSE_OPTIONS = {
  analyse_tools: [
    'XOVI',
    'Sistrix',
    'SEMrush',
    'Ahrefs',
    'Screaming Frog',
    'Google Search Console',
    'Google Analytics',
    'Ubersuggest',
    'Moz',
    'Sonstiges'
  ],
  
  pagespeed_bewertung: [
    { value: 'gut', label: 'Gut (grün)', minScore: 90 },
    { value: 'mittel', label: 'Mittel (gelb)', minScore: 50 },
    { value: 'schlecht', label: 'Schlecht (rot)', minScore: 0 }
  ],
  
  backlink_qualitaet: [
    { value: 'gut', label: 'Gut - Hochwertige, themenrelevante Links' },
    { value: 'mittel', label: 'Mittel - Gemischte Qualität' },
    { value: 'schlecht', label: 'Schlecht - Wenige oder minderwertige Links' },
    { value: 'toxisch', label: 'Toxisch - Potenziell schädliche Links vorhanden' }
  ],
  
  listings_portale: [
    'Google My Business',
    'Bing Places',
    'Apple Maps',
    'Yelp',
    'Das Örtliche',
    'Gelbe Seiten',
    '11880',
    'Branchenbuch',
    'Facebook',
    'Cylex',
    'Hotfrog',
    'Yalwa'
  ],
  
  keyword_schwierigkeit: [
    { value: 'niedrig', label: 'Niedrig - Wenig Wettbewerb' },
    { value: 'mittel', label: 'Mittel - Moderater Wettbewerb' },
    { value: 'hoch', label: 'Hoch - Starker Wettbewerb' }
  ],
  
  social_plattformen: ['LinkedIn', 'Facebook', 'Instagram', 'Twitter', 'TikTok', 'YouTube'],
  
  engagement_bewertung: [
    { value: 'hoch', label: 'Hoch - Viele Likes, Kommentare, Shares' },
    { value: 'mittel', label: 'Mittel - Mäßige Interaktion' },
    { value: 'niedrig', label: 'Niedrig - Kaum Interaktion' }
  ]
};

// ============================================================================
// HELPER FÜR REPORT-GENERIERUNG
// ============================================================================

export function formatKeywordTabelle(keywords: KeywordAnalyse[]): string {
  if (!keywords || keywords.length === 0) return '(Keine Keywords erfasst)';
  
  let tabelle = `
| Keyword | Suchvolumen/Monat | Wettbewerber | Position |
| ------- | ----------------- | ------------ | -------- |
`;
  
  keywords.forEach(kw => {
    tabelle += `| ${kw.keyword} | ${kw.suchvolumen_monatlich || '-'} | ${kw.wettbewerb_anzahl || '-'} | ${kw.aktuelle_position || '-'} |\n`;
  });
  
  return tabelle;
}

export function formatWettbewerberTabelle(wettbewerber: WettbewerberAnalyse[]): string {
  if (!wettbewerber || wettbewerber.length === 0) return '(Keine Wettbewerber erfasst)';
  
  let output = '';
  wettbewerber.forEach((w, i) => {
    output += `
${i + 1}. ${w.name}
   Website: ${w.website || '-'}
   Sichtbarkeits-Index: ${w.sichtbarkeit_index || '-'}
   Stärken: ${w.staerken || '-'}
   Schwächen: ${w.schwaechen || '-'}
   Unsere Differenzierung: ${w.differenzierung || '-'}
`;
  });
  
  return output;
}

export function formatSWOT(externeAnalyse: ExterneAnalyse): string {
  if (!externeAnalyse.swot_staerken && !externeAnalyse.swot_schwaechen && 
      !externeAnalyse.swot_chancen && !externeAnalyse.swot_risiken) {
    return '';
  }
  
  return `
SWOT-ANALYSE

STÄRKEN (Strengths)
${externeAnalyse.swot_staerken || '(nicht erfasst)'}

SCHWÄCHEN (Weaknesses)
${externeAnalyse.swot_schwaechen || '(nicht erfasst)'}

CHANCEN (Opportunities)
${externeAnalyse.swot_chancen || '(nicht erfasst)'}

RISIKEN (Threats)
${externeAnalyse.swot_risiken || '(nicht erfasst)'}
`;
}

export function formatGMBAnalyse(externeAnalyse: ExterneAnalyse): string {
  if (!externeAnalyse.gmb_vorhanden) return '';
  
  return `
GOOGLE MY BUSINESS ANALYSE

Profil vorhanden: ${externeAnalyse.gmb_vorhanden ? 'Ja' : 'Nein'}
Bewertungen: ${externeAnalyse.gmb_bewertungen_anzahl || '-'} (⌀ ${externeAnalyse.gmb_bewertungen_durchschnitt || '-'} Sterne)
Vollständigkeit: ${externeAnalyse.gmb_vollstaendig ? 'Vollständig' : 'Unvollständig'}
${externeAnalyse.gmb_notizen ? `\nNotizen: ${externeAnalyse.gmb_notizen}` : ''}
`;
}
