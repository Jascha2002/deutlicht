export interface OfferFormData {
  // Company data
  company_name: string;
  company_street: string;
  company_zip: string;
  company_city: string;
  industry: string;
  industry_other: string;
  company_size: '1-10' | '11-50' | '51-250' | '>250';
  contact_person: string;
  
  // Contact data
  customer_email: string;
  customer_phone: string;
  project_start_timing: string;
  project_deadline: string;
  
  // Services
  services_selected: string[];
  
  // Website
  website_type: string;
  website_pages_count: string;
  website_features: string[];
  domain_needed: string;
  hosting_needed: string;
  hosting_type: string;
  service_contract: string;
  service_minutes: string;
  
  // Social Media
  social_platforms: string[];
  social_frequency: string;
  social_content: string;
  social_vor_ort: string;
  
  // SEO
  seo_package: string;
  
  // AI
  ki_type: string;
  ki_branche: string;
  
  // Voicebot
  voice_type: string;
  voice_anwendung: string;
  
  // Process optimization
  prozess_type: string;
  
  // Consulting
  beratung_model: string;
  beratung_hours: string;
}

export const initialFormData: OfferFormData = {
  company_name: '',
  company_street: '',
  company_zip: '',
  company_city: '',
  industry: '',
  industry_other: '',
  company_size: '1-10',
  contact_person: '',
  customer_email: '',
  customer_phone: '',
  project_start_timing: '',
  project_deadline: '',
  services_selected: [],
  website_type: '',
  website_pages_count: '',
  website_features: [],
  domain_needed: '',
  hosting_needed: '',
  hosting_type: '',
  service_contract: '',
  service_minutes: '',
  social_platforms: [],
  social_frequency: '',
  social_content: '',
  social_vor_ort: '',
  seo_package: '',
  ki_type: '',
  ki_branche: '',
  voice_type: '',
  voice_anwendung: '',
  prozess_type: '',
  beratung_model: '',
  beratung_hours: '',
};

export const SERVICES = [
  { id: 'website', label: 'Website & Digitale Plattformen', icon: '🌐' },
  { id: 'social', label: 'Social Media Marketing', icon: '📱' },
  { id: 'seo', label: 'SEO & Sichtbarkeit', icon: '🔍' },
  { id: 'ki', label: 'KI-Agenten & Automation', icon: '🤖' },
  { id: 'voice', label: 'Voicebots / Sprachassistenz', icon: '🎙️' },
  { id: 'prozess', label: 'Prozessoptimierung & Digitalstrategie', icon: '⚙️' },
  { id: 'beratung', label: 'Beratung & Schulung', icon: '💡' },
] as const;

export const WEBSITE_FEATURES = [
  'Lead-/Vertriebsfokus',
  'Konfigurator',
  'ERP-Anbindung',
  'Blog',
  'Mehrsprachigkeit',
  'Terminbuchung',
  'Mitgliederbereich',
] as const;

export const SOCIAL_PLATFORMS = ['LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'X'] as const;

export const INDUSTRIES = [
  'Handwerk',
  'Einzelhandel',
  'Tourismus',
  'Gesundheitswesen',
  'IT',
  'Beratung',
  'Produktion',
  'Immobilien',
  'Bildung',
  'Finanzen',
  'Andere',
] as const;

// KI Branchenlösungen mit Beschreibungen und Preisen
export const KI_BRANCHENLOESUNGEN = [
  { 
    value: 'kanzlei', 
    label: 'DeutLicht Kanzlei-Agent', 
    description: 'Spezialisiert auf Rechtsanwälte und Steuerberater: Mandantenanfragen vorqualifizieren, Termine planen, Dokumentenmanagement automatisieren',
    setup: 2990,
    monthly: 249
  },
  { 
    value: 'handwerk', 
    label: 'DeutLicht Handwerker-Agent', 
    description: 'Für Handwerksbetriebe: Anfragen aufnehmen, Terminkoordination, Material-Bestellungen, Kundenkommunikation automatisieren',
    setup: 1990,
    monthly: 179
  },
  { 
    value: 'ecommerce', 
    label: 'DeutLicht E-Commerce-Agent', 
    description: 'Für Online-Shops: Produktberatung, Bestellstatus, Retouren-Management, Cross-Selling Empfehlungen',
    setup: 4990,
    monthly: 399
  },
  { 
    value: 'produktion', 
    label: 'DeutLicht Produktions-Agent', 
    description: 'Für produzierende Unternehmen: Lieferantenmanagement, Qualitätskontrolle, Wartungsplanung, Bestandsoptimierung',
    setup: 3490,
    monthly: 299
  },
  { 
    value: 'gastronomie', 
    label: 'DeutLicht Gastronomie-Agent', 
    description: 'Für Restaurants und Hotels: Reservierungen, Bestellmanagement, Gästekommunikation, Bewertungsmanagement',
    setup: 2490,
    monthly: 199
  },
  { 
    value: 'immobilien', 
    label: 'DeutLicht Immobilien-Agent', 
    description: 'Für Makler und Hausverwaltungen: Anfragenqualifizierung, Exposé-Versand, Besichtigungstermine, Mieterkommunikation',
    setup: 2990,
    monthly: 249
  },
  { 
    value: 'healthcare', 
    label: 'DeutLicht Praxis-Agent', 
    description: 'Für Arztpraxen und Therapeuten: Terminbuchung, Rezeptanfragen, Patientenkommunikation, Recall-Management',
    setup: 2790,
    monthly: 229
  },
  { 
    value: 'buerger', 
    label: 'DeutLicht BürgerBot', 
    description: 'Für Kommunen und Behörden: Bürgeranfragen beantworten, Formulare erklären, Öffnungszeiten und Zuständigkeiten kommunizieren, Terminvergabe automatisieren',
    setup: 3990,
    monthly: 349
  },
  { 
    value: 'reise', 
    label: 'DeutLicht ReiseBot', 
    description: 'Für Reisebüros und Touristik: Reiseanfragen qualifizieren, Buchungsunterstützung, Reiseinformationen bereitstellen, Stornierungs- und Umbuchungsanfragen bearbeiten',
    setup: 2990,
    monthly: 249
  },
  { 
    value: 'hr', 
    label: 'DeutLicht Workflow-Audit + HR-Bot', 
    description: 'Für HR-Abteilungen: Bewerbermanagement, Onboarding-Prozesse automatisieren, Urlaubsanträge verarbeiten, Mitarbeiteranfragen beantworten, Workflow-Analyse',
    setup: 4490,
    monthly: 379
  },
  { 
    value: 'care', 
    label: 'DeutLicht CareBot', 
    description: 'Für Pflegeeinrichtungen und ambulante Dienste: Angehörigenkommunikation, Dienstplanung unterstützen, Dokumentation vereinfachen, Notfallprotokolle',
    setup: 3490,
    monthly: 299
  },
  { 
    value: 'lern', 
    label: 'DeutLicht LernBot', 
    description: 'Für Bildungseinrichtungen und E-Learning: Lernfortschritt tracken, Fragen beantworten, Kursinhalte erklären, Prüfungsvorbereitung unterstützen',
    setup: 2990,
    monthly: 249
  },
  { 
    value: 'agro', 
    label: 'DeutLicht AgroBot', 
    description: 'Für Landwirtschaft und Agrarbetriebe: Wetterdaten analysieren, Ernteplanung optimieren, Lieferantenkoordination, Dokumentation für Fördermittel',
    setup: 3290,
    monthly: 279
  },
  { 
    value: 'branche', 
    label: 'DeutLicht BranchenBot', 
    description: 'Individuell konfigurierbare Branchenlösung: Maßgeschneiderte KI-Lösung für Ihre spezifische Branche mit individuellen Workflows und Integrationen',
    setup: 5990,
    monthly: 499
  },
] as const;

// Voicebot Anwendungen mit Beschreibungen
export const VOICE_ANWENDUNGEN = [
  { 
    value: 'empfang', 
    label: 'Virtueller Empfang', 
    description: 'Begrüßung und Weiterleitung von Anrufern an die richtige Abteilung oder Person - 24/7 erreichbar' 
  },
  { 
    value: 'terminbuchung', 
    label: 'Terminbuchung', 
    description: 'Vollautomatische Terminvereinbarung mit Kalenderintegration und Bestätigungen per SMS/E-Mail' 
  },
  { 
    value: 'bestellannahme', 
    label: 'Bestellannahme', 
    description: 'Telefonische Bestellungen aufnehmen, bestätigen und in Ihr System übertragen' 
  },
  { 
    value: 'kundenservice', 
    label: 'Kundenservice', 
    description: 'Beantwortung häufiger Fragen, Statusauskünfte und einfache Problemlösungen' 
  },
  { 
    value: 'leadqualifizierung', 
    label: 'Lead-Qualifizierung', 
    description: 'Strukturierte Erfassung von Interessentenanfragen mit automatischer Bewertung und CRM-Übergabe' 
  },
  { 
    value: 'umfragen', 
    label: 'Umfragen & Feedback', 
    description: 'Automatisierte Kundenzufriedenheitsumfragen und Feedback-Erfassung per Telefon' 
  },
  { 
    value: 'erinnerungen', 
    label: 'Erinnerungsanrufe', 
    description: 'Proaktive Anrufe für Terminerinnerungen, Zahlungserinnerungen oder wichtige Mitteilungen' 
  },
  { 
    value: 'notfall', 
    label: 'Notfall-Hotline', 
    description: 'Außerhalb der Geschäftszeiten dringende Anliegen erfassen und bei Bedarf eskalieren' 
  },
] as const;
