// Angebotsgenerator Types v4.0

export interface OfferFormData {
  // Unternehmensdaten
  company_name: string;
  industry: string;
  company_size: string;
  project_goal: string;
  contact_person: string;
  email: string;
  phone: string;

  // Leistungsmodule
  services_selected: string[];
  beratung_topics: string[];

  // Timing
  project_start_timing: string;
  project_deadline: string;

  // Website & Digitale Plattformen
  website_type: string;
  website_pages_count: string;
  website_cms: string;
  website_cms_other: string;
  website_migration_needed: string;
  website_migration_pages: string;
  domain_needed: string;
  hosting_needed: string;
  hosting_type: string;
  service_contract: string;
  service_minutes: string;
  website_features: string[];

  // Shop
  shop_needed: string;
  shop_products: string;
  shop_system: string;

  // Social Media
  social_platforms: string[];
  social_frequency: string;
  social_content: string;
  social_vor_ort: string;

  // SEO
  seo_package: string;

  // KI-Agenten
  ki_type: string;
  ki_branche: string;

  // Voicebots
  voice_type: string;
  voice_channel: string;
  voice_anwendungen: string[];

  // Prozessoptimierung
  prozess_type: string;

  // Beratung
  beratung_model: string;
  beratung_hours: string;
  foerder_check: string;

  // Zusätzliche Notizen
  additional_notes: string;
}

export const initialFormData: OfferFormData = {
  company_name: '',
  industry: '',
  company_size: '1-10',
  project_goal: '',
  contact_person: '',
  email: '',
  phone: '',
  services_selected: [],
  beratung_topics: [],
  project_start_timing: '',
  project_deadline: '',
  website_type: '',
  website_pages_count: '',
  website_cms: '',
  website_cms_other: '',
  website_migration_needed: '',
  website_migration_pages: '',
  domain_needed: '',
  hosting_needed: '',
  hosting_type: '',
  service_contract: '',
  service_minutes: '',
  website_features: [],
  shop_needed: '',
  shop_products: '',
  shop_system: '',
  social_platforms: [],
  social_frequency: '',
  social_content: '',
  social_vor_ort: '',
  seo_package: '',
  ki_type: '',
  ki_branche: '',
  voice_type: '',
  voice_channel: '',
  voice_anwendungen: [],
  prozess_type: '',
  beratung_model: '',
  beratung_hours: '',
  foerder_check: '',
  additional_notes: ''
};

// Konstanten für Auswahloptionen
export const SERVICE_OPTIONS = [
  'Website & Digitale Plattformen',
  'Social Media Marketing',
  'SEO & Sichtbarkeit',
  'KI-Agenten & Automation',
  'Voicebots / Sprachassistenz',
  'Prozessoptimierung & Digitalstrategie',
  'Beratung & Schulung'
];

export const WEBSITE_FEATURES = [
  'Lead-/Vertriebsfokus',
  'Konfigurator',
  'ERP-Anbindung',
  'Blog/News-Bereich',
  'Mehrsprachigkeit',
  'Online-Terminbuchung',
  'Mitgliederbereich'
];

export const SOCIAL_PLATFORMS = ['LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'X'];

export const CMS_SYSTEMS = ['WordPress', 'Jimdo', 'Wix', 'Webflow', 'Typo3', 'Squarespace', 'Duda', 'Shopify', 'Andere'];

export const VOICEBOT_ANWENDUNGEN = [
  'Mieteranfragen (Hausverwaltung)',
  'Besichtigungstermine (Immobilienbüros)',
  'Schadensmeldungen (Versicherungen)',
  'Zählerablesung (Ablesedienste)',
  'Vorsorgeuntersuchungen (Arztpraxen)',
  'Terminerinnerungen (Werkstatt, Therapeuten)',
  'Abholbenachrichtigungen (Retail, Services)',
  'Bestellstatus',
  'Terminvereinbarung',
  'Reklamation',
  'FAQ & Support'
];

export const BERATUNG_TOPICS = [
  'Digitalstrategie',
  'KI-Einsatz & Automatisierung',
  'Prozessanalyse',
  'Tool- & Anbieterbewertung',
  'Schulungen Mitarbeiter',
  'Schulungen Kunden'
];

export const INDUSTRIES = [
  'Handwerk',
  'Einzelhandel',
  'Gastronomie & Hotellerie',
  'Gesundheitswesen',
  'IT & Technologie',
  'Beratung & Dienstleistung',
  'Produktion & Industrie',
  'Immobilien',
  'Bildung & Schulung',
  'Öffentliche Verwaltung / Kommune',
  'Vereine & Verbände',
  'Sonstiges',
];

export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 Mitarbeitende' },
  { value: '11-50', label: '11-50 Mitarbeitende' },
  { value: '51-250', label: '51-250 Mitarbeitende' },
  { value: '>250', label: '>250 Mitarbeitende' },
];

// Legacy exports for backwards compatibility
// Legacy constants for backwards compatibility
export const PROJECT_GOALS = [
  'Wachstum',
  'Effizienzsteigerung',
  'Automatisierung',
  'Marketing & Sichtbarkeit',
  'Prozessoptimierung',
];

export const SERVICES = [
  'Website',
  'Webshop',
  'SEO',
  'Social Media Marketing',
  'KI-Agenten / Automation',
  'Voicebots / Sprachassistenz',
  'Prozessoptimierung / Digitalstrategie',
];

export const WEBSITE_GOALS = [
  'Image',
  'Leads',
  'Information',
  'Recruiting',
  'Verkauf',
];

export const SOCIAL_GOALS = [
  'Reichweite',
  'Leads',
  'Employer Branding',
  'Markenaufbau',
];

export const AI_USE_CASES = [
  'Vertriebs-Qualifizierung',
  'Interne Workflows',
  'Marketing-Automation',
  'HR / Onboarding',
  'Prozessanalyse',
];

export const EXISTING_SYSTEMS = [
  'CRM',
  'ERP',
  'E-Mail',
  'Kalender',
  'Ticketsystem',
];

export const AI_GOALS = [
  'Entlastung',
  'Automatisierung',
  'Geschwindigkeit',
  'Entscheidungsunterstützung',
];

export const VOICEBOT_USE_CASES = [
  'Kundenservice / Support-Hotline',
  'Terminvereinbarung / Vorgangssteuerung',
  'Vertriebs-Qualifizierung',
  'Self-Order / Bestellannahme',
  'Bürger- & Service-Hotline',
  'HR-Onboarding',
];

export const PROCESS_ISSUES = [
  'manuell',
  'fehleranfällig',
  'zeitintensiv',
  'unübersichtlich',
];

export const OPTIMIZATION_GOALS = [
  'Zeitersparnis',
  'Kostenreduktion',
  'Transparenz',
  'Skalierbarkeit',
];

export interface KlarheitsCheckData extends OfferFormData {
  role?: string;
  project_goals?: string[];
  project_goal_other?: string;
  main_challenge?: string;
  project_start?: string;
  project_end?: string;
  fixed_deadline?: string;
  budget_range?: string;
  services_needed?: string[];
  existing_website?: string;
  website_url?: string;
  existing_cms?: string;
  existing_cms_other?: string;
  website_takeover_needed?: string;
  additional_pages_count?: string;
  website_goals?: string[];
  content_creation?: string;
  required_features?: string[];
  platforms?: string[];
  social_goals?: string[];
  posting_frequency?: string;
  posting_frequency_other?: string;
  content_provider?: string;
  ai_use_cases?: string[];
  existing_systems?: string[];
  ai_goals?: string[];
  gdpr_status?: string;
  voicebot_use_cases?: string[];
  voicebot_languages?: string;
  automation_level?: string;
  current_issues?: string[];
  documentation_available?: string;
  optimization_goals?: string[];
  decision_maker?: string;
  stakeholders?: string;
  communication_preference?: string;
}
