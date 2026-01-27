// Dropdown-Optionen für die Digitalisierungs-Analyse App

export const DROPDOWN_OPTIONS = {
  // =============================================
  // STAMMDATEN
  // =============================================
  rechtsform: [
    'GmbH', 'AG', 'UG (haftungsbeschränkt)', 'Einzelunternehmen', 
    'GbR', 'KG', 'OHG', 'e.V.', 'Sonstiges'
  ],
  
  branche: [
    'Handwerk', 'Einzelhandel', 'Großhandel', 'Produktion / Industrie',
    'IT & Software', 'Beratung', 'Marketing & Werbung', 'Dienstleistung',
    'Gesundheitswesen', 'Bildung & Schulung', 'Immobilien', 
    'Tourismus & Gastro', 'Transport & Logistik', 'Energie',
    'Finanzen & Versicherung', 'Öffentliche Verwaltung', 
    'Non-Profit', 'Vereine & Verbände', 'Sonstiges'
  ],
  
  mitarbeiterzahl_kategorie: [
    '1-5', '6-10', '11-20', '21-50', '51-100', '101-250', '251+'
  ],
  
  jahresumsatz_kategorie: [
    'unter 100.000 €', '100.000 - 500.000 €', '500.000 - 1 Mio. €',
    '1 - 5 Mio. €', '5 - 10 Mio. €', 'über 10 Mio. €'
  ],

  // =============================================
  // ONLINE-AUFTRITT
  // =============================================
  website_cms: [
    'WordPress', 'Typo3', 'Joomla', 'Drupal', 'Wix', 'Jimdo', 
    'Webflow', 'Shopify', 'Squarespace', 'Custom/Eigenentwicklung', 
    'Keines', 'Weiss nicht', 'Sonstiges'
  ],
  
  website_hosting: [
    'Eigener Server (On-Premise)', 'Shared Hosting', 'Cloud Hosting',
    'Managed Hosting', 'Weiss nicht'
  ],
  
  website_aktualisierung: [
    'Täglich', 'Wöchentlich', 'Monatlich', 'Seltener', 'Nie'
  ],
  
  website_aktualisierung_wer: [
    'Intern (eigene Mitarbeiter)', 'Externe Agentur', 'Freelancer', 'Niemand'
  ],
  
  shop_system: [
    'Shopify', 'WooCommerce (WordPress)', 'Shopware', 'Magento',
    'PrestaShop', 'Oxid', 'JTL-Shop', 'Custom/Eigenentwicklung',
    'Keines', 'Sonstiges'
  ],
  
  shop_zahlungsarten: [
    'PayPal', 'Kreditkarte', 'Lastschrift', 'Rechnung', 
    'Vorkasse', 'Sofortüberweisung', 'Klarna', 'Amazon Pay', 
    'Apple Pay', 'Google Pay', 'Ratenkauf'
  ],
  
  buchungssystem_typ: [
    'Calendly', 'Acuity Scheduling', 'SimplyBook', 'Microsoft Bookings',
    'Terminland', 'Custom/Eigenentwicklung', 'Keines', 'Sonstiges'
  ],

  // =============================================
  // SOCIAL MEDIA & MARKETING
  // =============================================
  social_kanaele: [
    'LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'X (Twitter)', 
    'YouTube', 'Xing', 'Pinterest', 'Snapchat', 'Threads', 'WhatsApp Business'
  ],
  
  frequenz_optionen: [
    'Mehrmals täglich', 'Täglich', 'Mehrmals wöchentlich', 
    'Wöchentlich', '14-tägig', 'Monatlich', 'Seltener', 'Nie'
  ],
  
  content_ersteller: [
    'Intern (eigene Mitarbeiter)', 'Externe Agentur', 'Freelancer',
    'Gemischt (intern + extern)', 'Niemand'
  ],
  
  newsletter_tool: [
    'Mailchimp', 'Brevo (Sendinblue)', 'ActiveCampaign', 'Newsletter2Go',
    'CleverReach', 'Constant Contact', 'HubSpot', 'GetResponse',
    'MailerLite', 'Keines', 'Sonstiges'
  ],

  // =============================================
  // SYSTEME & SOFTWARE
  // =============================================
  crm_system: [
    'Salesforce', 'HubSpot CRM', 'Pipedrive', 'Monday.com', 
    'Zoho CRM', 'Microsoft Dynamics', 'SugarCRM', 'Freshsales',
    'Bitrix24', 'Excel/Tabellen', 'Keines', 'Sonstiges'
  ],
  
  erp_system: [
    'SAP', 'Microsoft Dynamics 365', 'DATEV', 'Lexware', 
    'Sage', 'proAlpha', 'Infor', 'Oracle NetSuite', 
    'Odoo', 'Keines', 'Custom/Eigenentwicklung', 'Sonstiges'
  ],
  
  erp_module: [
    'Auftragsbearbeitung', 'Lagerverwaltung', 'Einkauf', 
    'Produktion / Fertigung', 'Vertrieb', 'Personalwesen',
    'Finanzen / Controlling', 'CRM', 'Projektverwaltung',
    'Service / Wartung', 'Qualitätsmanagement'
  ],
  
  buchhaltung_system: [
    'DATEV', 'Lexware', 'SevDesk', 'Debitoor', 'Billomat',
    'FastBill', 'Papierkram', 'Xero', 'QuickBooks',
    'Excel', 'Keines', 'Sonstiges'
  ],
  
  dms_system: [
    'Microsoft SharePoint', 'Nextcloud', 'DocuWare', 'ELO',
    'd.velop', 'M-Files', 'Google Drive', 'Dropbox Business',
    'Dateiserver (klassisch)', 'Keines', 'Sonstiges'
  ],
  
  pm_tool: [
    'Asana', 'Trello', 'Monday.com', 'Jira', 'Microsoft Project',
    'ClickUp', 'Basecamp', 'Wrike', 'Notion', 
    'Excel', 'Keines', 'Sonstiges'
  ],
  
  zeiterfassung_system: [
    'Clockodo', 'Toggl', 'Harvest', 'Timely', 'RescueTime',
    'Excel', 'Stundenzettel (Papier)', 'Keines', 'Sonstiges'
  ],
  
  email_system: [
    'Microsoft 365', 'Google Workspace', 'Exchange Server',
    'IMAP (klassisch)', 'POP3', 'Webmail', 'Sonstiges'
  ],
  
  chat_tool: [
    'Microsoft Teams', 'Slack', 'Zoom', 'Google Chat',
    'WhatsApp Business', 'Telegram', 'Discord',
    'Keines', 'Sonstiges'
  ],
  
  videokonferenz: [
    'Microsoft Teams', 'Zoom', 'Google Meet', 'Cisco Webex',
    'Skype', 'GoToMeeting', 'Jitsi', 'Sonstiges'
  ],

  // =============================================
  // PROZESSE & WORKFLOWS
  // =============================================
  vertrieb_leadgewinnung: [
    'Eigene Website', 'Google Ads', 'Social Media',
    'Empfehlungen', 'Kaltakquise (Telefon)', 'E-Mail-Akquise',
    'Messen / Events', 'Partner / Kooperationen',
    'Printanzeigen', 'Lokale Werbung'
  ],
  
  vertrieb_angebotserstellung: [
    'Vollautomatisch (CRM/ERP)', 'Teilautomatisiert (Vorlagen)',
    'Komplett manuell'
  ],
  
  auftragseingang_kanal: [
    'E-Mail', 'Telefon', 'Webformular', 'Online-Shop',
    'Portal / Kundenportal', 'Fax', 'Post', 'Persönlich'
  ],
  
  rechnungsstellung: [
    'Vollautomatisch', 'Halbautomatisch', 'Manuell'
  ],
  
  service_kanal: [
    'Telefon', 'E-Mail', 'Ticket-System', 'Live-Chat',
    'WhatsApp', 'Portal', 'Vor Ort'
  ],

  // =============================================
  // DATEN & SICHERHEIT
  // =============================================
  daten_ablage_ort: [
    'Cloud (z.B. Microsoft 365, Google)', 'Eigener Server (On-Premise)',
    'Lokale Festplatten', 'Externe Festplatten', 'NAS', 'Papier / Aktenordner'
  ],
  
  backup_frequenz: [
    'Täglich', 'Wöchentlich', 'Monatlich', 'Unregelmäßig', 'Nie', 'Weiss nicht'
  ],
  
  backup_speicherort: [
    'Cloud', 'Externe Festplatte', 'Lokaler Server', 'Gemischt', 'Keiner', 'Weiss nicht'
  ],
  
  zugriffskontrolle: [
    'Rollenbasiert (verschiedene Berechtigungen)', 
    'Individuell pro Person',
    'Alle haben auf alles Zugriff',
    'Keine Kontrolle'
  ],

  // =============================================
  // REPORTING & KPIs
  // =============================================
  reporting_frequenz: [
    'Täglich', 'Wöchentlich', 'Monatlich', 'Quartalsweise', 
    'Jährlich', 'Unregelmäßig', 'Nie'
  ],
  
  kennzahlen_liste: [
    'Umsatz', 'Gewinn', 'Deckungsbeitrag', 'Liquidität',
    'Auftragseingang', 'Angebotserfolgsquote', 'Kundenzufriedenheit',
    'Mitarbeiterauslastung', 'Projektkosten', 'Durchlaufzeiten',
    'Reklamationsquote', 'Website-Traffic', 'Conversion-Rate',
    'Social Media Reichweite', 'Newsletter-Öffnungsrate'
  ],

  // =============================================
  // ZIELE & STRATEGIE
  // =============================================
  schmerzpunkte_optionen: [
    'Zu viel manuelle Arbeit', 'Hoher Zeitaufwand', 'Häufige Fehler',
    'Fehlende Transparenz', 'Schlechte Datenqualität',
    'Medienbrüche (Papier → Digital)', 'Doppelarbeit',
    'Langsame Prozesse', 'Hohe Kosten', 'Mitarbeiter überlastet',
    'Keine Übersicht über Projekte', 'Verlust von Informationen',
    'Schlechte Kundenkommunikation'
  ],
  
  ziele_optionen: [
    'Umsatz steigern', 'Kosten senken', 'Prozesse beschleunigen',
    'Fehlerquote reduzieren', 'Transparenz erhöhen',
    'Mitarbeiter entlasten', 'Kundenzufriedenheit steigern',
    'Wettbewerbsfähigkeit verbessern', 'Skalierbarkeit erreichen',
    'Home-Office ermöglichen', 'Nachhaltigkeit verbessern',
    'Datenqualität verbessern'
  ],
  
  zeitrahmen: [
    '0-3 Monate', '3-6 Monate', '6-12 Monate', 
    '1-2 Jahre', 'Über 2 Jahre', 'Offen'
  ],

  // =============================================
  // BEWERTUNGSSKALEN
  // =============================================
  skala_1_5: ['1 (sehr schlecht)', '2', '3 (mittel)', '4', '5 (sehr gut)'],
  skala_1_10: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  
  ja_nein: ['Ja', 'Nein'],
  ja_nein_geplant: ['Ja', 'Nein', 'Geplant'],
  ja_nein_weiss_nicht: ['Ja', 'Nein', 'Weiss nicht'],
  ja_teilweise_nein: ['Ja', 'Teilweise', 'Nein'],
  
  qualitaet: ['Sehr gut', 'Gut', 'Ausreichend', 'Mangelhaft', 'Ungenügend'],
  
  prioritaet: ['Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'],
  
  status_vorhanden: ['Vorhanden', 'Teilweise', 'Fehlt', 'Geplant']
} as const;

// Type für alle Dropdown-Keys
export type DropdownKey = keyof typeof DROPDOWN_OPTIONS;

// Helper Funktion um Optionen als Select-Format zu bekommen
export const getSelectOptions = (key: DropdownKey) => {
  return DROPDOWN_OPTIONS[key].map((option) => ({
    value: option,
    label: option
  }));
};

// Helper für "Sonstiges" Felder
export const hasSonstigesOption = (key: DropdownKey): boolean => {
  const options = DROPDOWN_OPTIONS[key];
  return options.includes('Sonstiges' as never);
};
