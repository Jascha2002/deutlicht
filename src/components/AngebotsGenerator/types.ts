export interface KlarheitsCheckData {
  // Step 1: Unternehmensgrundlagen
  company_name: string;
  contact_person: string;
  role: string;
  email: string;
  phone: string;
  industry: string;
  company_size: string;

  // Step 2: Projektanlass
  project_goals: string[];
  project_goal_other: string;
  main_challenge: string;

  // Step 3: Zeit & Rahmen
  project_start: string;
  project_end: string;
  fixed_deadline: string;
  budget_range: string;

  // Step 4: Leistungsbereiche
  services_needed: string[];

  // Conditional: Website
  existing_website: string;
  website_url: string;
  website_goals: string[];
  content_creation: string;
  required_features: string[];

  // Conditional: Social Media
  platforms: string[];
  social_goals: string[];
  posting_frequency: string;
  posting_frequency_other: string;
  content_provider: string;

  // Conditional: KI-Agenten
  ai_use_cases: string[];
  existing_systems: string[];
  ai_goals: string[];
  gdpr_status: string;

  // Conditional: Voicebots
  voicebot_use_cases: string[];
  voicebot_languages: string;
  automation_level: string;

  // Conditional: Prozessoptimierung
  current_issues: string[];
  documentation_available: string;
  optimization_goals: string[];

  // Final Step: Zusammenarbeit
  decision_maker: string;
  stakeholders: string;
  communication_preference: string;
  additional_notes: string;
}

export const initialFormData: KlarheitsCheckData = {
  company_name: '',
  contact_person: '',
  role: '',
  email: '',
  phone: '',
  industry: '',
  company_size: '',
  project_goals: [],
  project_goal_other: '',
  main_challenge: '',
  project_start: '',
  project_end: '',
  fixed_deadline: '',
  budget_range: '',
  services_needed: [],
  existing_website: '',
  website_url: '',
  website_goals: [],
  content_creation: '',
  required_features: [],
  platforms: [],
  social_goals: [],
  posting_frequency: '',
  posting_frequency_other: '',
  content_provider: '',
  ai_use_cases: [],
  existing_systems: [],
  ai_goals: [],
  gdpr_status: '',
  voicebot_use_cases: [],
  voicebot_languages: '',
  automation_level: '',
  current_issues: [],
  documentation_available: '',
  optimization_goals: [],
  decision_maker: '',
  stakeholders: '',
  communication_preference: '',
  additional_notes: '',
};

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
  { value: '1-10', label: '1–10 Mitarbeiter' },
  { value: '11-50', label: '11–50 Mitarbeiter' },
  { value: '51-250', label: '51–250 Mitarbeiter' },
  { value: '>250', label: 'Mehr als 250 Mitarbeiter' },
];

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

export const WEBSITE_FEATURES = [
  'Kontaktformular',
  'Terminbuchung',
  'Mehrsprachigkeit',
  'CRM-Anbindung',
  'ERP-Anbindung',
  'Konfigurator',
];

export const SOCIAL_PLATFORMS = [
  'LinkedIn',
  'Facebook',
  'Instagram',
  'X',
  'TikTok',
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
