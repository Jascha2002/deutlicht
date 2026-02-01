// Grobe Preisrahmen für die Kundenorientierung
// Basiert auf der echten Preismatrix mit ±25% Toleranz
// Hosting und Service/Wartung sind Festpreise

import { OfferFormData } from '@/types/offer';
import { calcTotal } from './pricing';

export interface PriceRange {
  label: string;
  minSetup: number;
  maxSetup: number;
  fixedMonthly: number; // Hosting + Service sind Festpreise
}

// Berechnet den Orientierungsrahmen basierend auf der tatsächlichen Preismatrix
export const getApproximatePriceRange = (formData: OfferFormData): PriceRange => {
  if (!formData.services_selected || formData.services_selected.length === 0) {
    return { label: 'Keine Auswahl', minSetup: 0, maxSetup: 0, fixedMonthly: 0 };
  }

  // Echte Berechnung aus der Preismatrix
  const { setup, monthly } = calcTotal(formData);

  // Hosting und Service/Wartung sind Festpreise (nicht variabel)
  // Diese werden separat als fixedMonthly ausgewiesen
  const fixedMonthly = monthly;

  // Setup-Preis mit ±25% Toleranz
  const minSetup = Math.round(setup * 0.75 / 100) * 100; // -25%, auf 100er gerundet
  const maxSetup = Math.round(setup * 1.25 / 100) * 100; // +25%, auf 100er gerundet

  return {
    label: `ca. ${formatCurrencyRange(minSetup, maxSetup)}`,
    minSetup,
    maxSetup,
    fixedMonthly,
  };
};

// Formatiert einen Preisbereich als Text
export const formatCurrencyRange = (min: number, max: number): string => {
  if (min === 0 && max === 0) return 'Auf Anfrage';
  if (min === max) return `${min.toLocaleString('de-DE')} €`;
  return `${min.toLocaleString('de-DE')} – ${max.toLocaleString('de-DE')} €`;
};

// Generiert einen groben Orientierungstext für den Kunden
export const generatePriceOrientationText = (formData: OfferFormData): string => {
  if (!formData.services_selected || formData.services_selected.length === 0) {
    return 'Bitte wählen Sie mindestens eine Leistung aus.';
  }

  const range = getApproximatePriceRange(formData);
  
  let text = `**Grober Orientierungsrahmen:** ${range.label} (Einrichtung)`;
  
  if (range.fixedMonthly > 0) {
    text += `\n\n**Monatliche Festkosten:** ${range.fixedMonthly.toLocaleString('de-DE')} €/Monat (Hosting & Service)`;
  }

  text += '\n\nDer tatsächliche Preis hängt von Ihren individuellen Anforderungen ab und wird nach persönlicher Beratung festgelegt.';

  return text;
};
