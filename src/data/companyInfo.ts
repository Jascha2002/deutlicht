/**
 * Zentrale Unternehmens-CI Konfiguration
 * Für alle Dokumente: Angebote, Verträge, Rechnungen, etc.
 */

export const COMPANY_INFO = {
  // Firmenname für Briefkopf
  name: 'Stadtnetz UG / DeutLicht',
  shortName: 'DeutLicht',
  
  // Hauptadresse
  address: {
    street: 'Gemeindeweg 4',
    postalCode: '07546',
    city: 'Gera',
    country: 'Deutschland',
  },
  
  // Vollständige Rechtsangaben für Fußzeile
  legal: {
    fullName: 'Stadtnetz UG (haftungsbeschränkt)',
    tradingAs: 'handelnd unter der Marke DeutLicht®',
    addressLine1: 'Gemeindeweg 4 (Mäuseturm)',
    addressLine2: '07546 Gera (Deutschland)',
    taxNumber: '161/120/05343',
    commercialRegister: 'HRB 514530',
    court: 'Amtsgericht Jena',
  },
  
  // Kontaktdaten
  contact: {
    email: 'info@DeutLicht.de',
    phone: '+49 178-5549216',
    website: 'www.deutlicht.de',
  },
  
  // Logo-Pfade für verschiedene Kontexte
  logos: {
    document: '/src/assets/deutlicht-logo-document.png',
    header: '/src/assets/deutlicht-logo-final.png',
    icon: '/src/assets/deutlicht-logo-icon.png',
  },
  
  // Slogan
  slogan: 'Klare Vision – Starke Präsenz',
} as const;

// Formatierte Adresszeile für Header
export function getHeaderAddress(): string {
  const { address } = COMPANY_INFO;
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
}

// Formatierte Fußzeile für Dokumente
export function getDocumentFooter(): string {
  const { legal, contact } = COMPANY_INFO;
  return `${legal.fullName} | ${legal.tradingAs}
${legal.addressLine1} | ${legal.addressLine2}
Steuernummer: ${legal.taxNumber} | ${legal.commercialRegister}, ${legal.court}
${contact.email} | ${contact.website}`;
}

// Kurze Fußzeile für kompakte Dokumente
export function getCompactFooter(): string {
  const { legal, contact } = COMPANY_INFO;
  return `${legal.fullName} | ${legal.tradingAs} | ${legal.addressLine1} | ${legal.addressLine2} | St.-Nr.: ${legal.taxNumber} | ${legal.commercialRegister}, ${legal.court}`;
}

// Für Vertragsköpfe
export function getContractHeader(): string {
  const { name, address } = COMPANY_INFO;
  return `${name}
${address.street}
${address.postalCode} ${address.city}
${address.country}`;
}
