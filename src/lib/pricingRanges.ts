// Grobe Preisrahmen für die Kundenorientierung
// Diese Werte sind absichtlich UNGENAU und dienen nur der groben Einordnung
// Die exakte Preismatrix bleibt intern

export interface PriceRange {
  label: string;
  minSetup: number;
  maxSetup: number;
  minMonthly?: number;
  maxMonthly?: number;
}

// Grobe Kategorien für die Anzeige an Kunden
export const PRICE_CATEGORIES = {
  starter: { label: 'Starter', min: 500, max: 2500 },
  standard: { label: 'Standard', min: 2500, max: 7500 },
  professional: { label: 'Professional', min: 7500, max: 15000 },
  enterprise: { label: 'Enterprise', min: 15000, max: 50000 },
  individual: { label: 'Individuell', min: 50000, max: null },
} as const;

// Ermittelt eine grobe Preiskategorie basierend auf ausgewählten Services
export const getApproximatePriceRange = (servicesSelected: string[]): PriceRange => {
  if (servicesSelected.length === 0) {
    return { label: 'Keine Auswahl', minSetup: 0, maxSetup: 0 };
  }

  let minSetup = 0;
  let maxSetup = 0;
  let minMonthly = 0;
  let maxMonthly = 0;

  servicesSelected.forEach((service) => {
    switch (service) {
      case 'Website & Digitale Plattformen':
        minSetup += 400;
        maxSetup += 15000;
        minMonthly += 0;
        maxMonthly += 100;
        break;
      case 'Social Media Marketing':
        minSetup += 1500;
        maxSetup += 4000;
        minMonthly += 200;
        maxMonthly += 2500;
        break;
      case 'SEO & Sichtbarkeit':
        minSetup += 200;
        maxSetup += 500;
        minMonthly += 0;
        maxMonthly += 3000;
        break;
      case 'KI-Agenten & Automation':
        minSetup += 1500;
        maxSetup += 15000;
        minMonthly += 150;
        maxMonthly += 600;
        break;
      case 'Voicebots / Sprachassistenz':
        minSetup += 3000;
        maxSetup += 12000;
        minMonthly += 0;
        maxMonthly += 0;
        break;
      case 'Prozessoptimierung & Digitalstrategie':
        minSetup += 1000;
        maxSetup += 3000;
        break;
      case 'Beratung & Schulung':
        minSetup += 500;
        maxSetup += 5000;
        break;
    }
  });

  // Runden auf 500er-Schritte für grobere Angaben
  minSetup = Math.floor(minSetup / 500) * 500;
  maxSetup = Math.ceil(maxSetup / 500) * 500;
  minMonthly = Math.floor(minMonthly / 50) * 50;
  maxMonthly = Math.ceil(maxMonthly / 50) * 50;

  return {
    label: `ca. ${formatCurrencyRange(minSetup, maxSetup)}`,
    minSetup,
    maxSetup,
    minMonthly: minMonthly > 0 ? minMonthly : undefined,
    maxMonthly: maxMonthly > 0 ? maxMonthly : undefined,
  };
};

// Formatiert einen Preisbereich als Text
export const formatCurrencyRange = (min: number, max: number): string => {
  if (min === 0 && max === 0) return 'Auf Anfrage';
  if (min === max) return `${min.toLocaleString('de-DE')} €`;
  return `${min.toLocaleString('de-DE')} – ${max.toLocaleString('de-DE')} €`;
};

// Generiert einen groben Orientierungstext für den Kunden
export const generatePriceOrientationText = (
  servicesSelected: string[]
): string => {
  if (servicesSelected.length === 0) {
    return 'Bitte wählen Sie mindestens eine Leistung aus.';
  }

  const range = getApproximatePriceRange(servicesSelected);
  
  let text = `**Grober Orientierungsrahmen:** ${range.label} (Einrichtung)`;
  
  if (range.minMonthly !== undefined && range.maxMonthly !== undefined) {
    text += ` zzgl. ca. ${formatCurrencyRange(range.minMonthly, range.maxMonthly)}/Monat`;
  }

  text += '\n\nDer tatsächliche Preis hängt von Ihren individuellen Anforderungen ab und wird nach persönlicher Beratung festgelegt.';

  return text;
};
