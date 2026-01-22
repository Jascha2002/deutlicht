import { OfferFormData } from '@/types/offer';

export const getSizeFactor = (size: string): number => {
  const factors: Record<string, number> = {
    '1-10': 1.0,
    '11-50': 1.3,
    '51-250': 1.6,
    '>250': 2.2,
  };
  return factors[size] || 1.0;
};

export const getIndustryFactor = (formData: OfferFormData): number => {
  const ind = formData.industry === 'Andere' ? formData.industry_other : formData.industry;
  if (!ind) return 1.0;
  const low = ind.toLowerCase();
  const schwach = ['einzelhandel', 'tourismus', 'gastronomie', 'immobilien', 'produktion'];
  const komplex = ['finanzen', 'versicherungen', 'gesundheit', 'it', 'technologie'];

  if (schwach.some((b) => low.includes(b))) return 0.9;
  if (komplex.some((b) => low.includes(b))) {
    let f = 1.15;
    if (formData.company_size === '51-250') f += 0.012;
    if (formData.company_size === '>250') f += 0.0375;
    return f;
  }
  return 1.0;
};

export const getTimeFactor = (timing: string): number => {
  const factors: Record<string, number> = {
    'Sofort': 1.3,
    'In 2 Wochen': 1.15,
    'In 4 Wochen': 1.0,
    'In 1-2 Monaten': 0.95,
    'In 6 Monaten': 0.9,
    'Noch in Planung': 0.85,
  };
  return factors[timing] || 1.0;
};

export const calcWebsite = (formData: OfferFormData): { setup: number; monthly: number } => {
  let base = 0;
  if (formData.website_type === 'onepager') base = 1200;
  else if (formData.website_type === 'landingpage_starter') base = 399;
  else if (formData.website_type === 'landingpage') base = 1500;
  else if (formData.website_type === '5-10')
    base = 1900 + ((parseInt(formData.website_pages_count) || 5) - 5) * 300;
  else if (formData.website_type === '10-20')
    base = 3400 + ((parseInt(formData.website_pages_count) || 10) - 10) * 250;
  else if (formData.website_type === '20-30')
    base = 5900 + ((parseInt(formData.website_pages_count) || 20) - 20) * 200;
  else if (formData.website_type === '>30')
    base = 7900 + ((parseInt(formData.website_pages_count) || 30) - 30) * 180;

  formData.website_features.forEach((f) => {
    if (f === 'Lead-/Vertriebsfokus') base += 2000;
    if (f === 'Konfigurator') base += 4500;
    if (f === 'ERP-Anbindung') base += 4500;
    if (f === 'Blog') base += 800;
    if (f === 'Mehrsprachigkeit') base += 1200;
    if (f === 'Terminbuchung') base += 1500;
    if (f === 'Mitgliederbereich') base += 2500;
  });

  if (formData.domain_needed === 'ja') base += 15;
  base = base * getTimeFactor(formData.project_start_timing) * getSizeFactor(formData.company_size) * getIndustryFactor(formData);

  let monthly = 0;
  if (formData.hosting_needed === 'ja') {
    const h: Record<string, number> = {
      onepager_landingpage: 12,
      'website_5-10': 20,
      'website_10-20': 30,
    };
    monthly += h[formData.hosting_type] || 0;
  }
  if (formData.service_contract === 'ja') {
    const s: Record<string, number> = { '20': 39, '60': 99, '120': 179 };
    monthly += s[formData.service_minutes] || 0;
  }
  return { setup: Math.round(base), monthly };
};

export const calcSocial = (formData: OfferFormData): { setup: number; monthly: number } => {
  if (!formData.social_frequency || !formData.social_platforms.length)
    return { setup: 0, monthly: 0 };
  const freq: Record<string, number> = {
    '1x/Monat': 0.8,
    '1x/14Tage': 1.0,
    '1x/Woche': 1.4,
    '2-3x/Woche': 2.0,
    'Mehrfach/Woche': 2.8,
  };
  const chan: Record<string, number> = {
    LinkedIn: 1.0,
    Facebook: 0.9,
    Instagram: 1.2,
    TikTok: 1.8,
    X: 0.7,
  };
  const cont: Record<string, number> = {
    Kunde_liefert_alles: 1.0,
    DeutLicht_Texte: 1.3,
    DeutLicht_beschafft_Medien: 1.8,
    DeutLicht_erstellt_Medien: 2.5,
    Fullservice: 3.5,
  };
  const f = freq[formData.social_frequency] || 1.0;
  const c =
    formData.social_platforms.reduce((s, p) => s + (chan[p] || 1.0), 0) /
    formData.social_platforms.length;
  const co = cont[formData.social_content] || 1.0;
  let setup = 1800;
  if (formData.social_vor_ort === '0.5') setup += 790;
  if (formData.social_vor_ort === '1') setup += 1490;
  return { setup, monthly: Math.round(250 * f * c * co) };
};

export const calcSEO = (formData: OfferFormData): { setup: number; monthly: number } => {
  const p: Record<string, { setup: number; monthly: number }> = {
    micro: { setup: 199, monthly: 0 },
    starter: { setup: 299, monthly: 0 },
    quickwin: { setup: 449, monthly: 0 },
    klein: { setup: 0, monthly: 199 },
    basic: { setup: 0, monthly: 790 },
    pro: { setup: 0, monthly: 1390 },
    enterprise: { setup: 0, monthly: 2490 },
  };
  return p[formData.seo_package] || { setup: 0, monthly: 0 };
};

export const calcKI = (formData: OfferFormData): { setup: number; monthly: number } => {
  if (formData.ki_type === 'einfach') return { setup: 1750, monthly: 0 };
  if (formData.ki_type === 'workflow') return { setup: 7500, monthly: 0 };
  if (formData.ki_type === 'multi') return { setup: 12000, monthly: 0 };
  
  // Alle Branchenlösungen mit Preisen
  const branchenPreise: Record<string, { setup: number; monthly: number }> = {
    kanzlei: { setup: 2990, monthly: 249 },
    handwerk: { setup: 1990, monthly: 179 },
    ecommerce: { setup: 4990, monthly: 399 },
    produktion: { setup: 3490, monthly: 299 },
    gastronomie: { setup: 2490, monthly: 199 },
    immobilien: { setup: 2990, monthly: 249 },
    healthcare: { setup: 2790, monthly: 229 },
    buerger: { setup: 3990, monthly: 349 },
    reise: { setup: 2990, monthly: 249 },
    hr: { setup: 4490, monthly: 379 },
    care: { setup: 3490, monthly: 299 },
    lern: { setup: 2990, monthly: 249 },
    agro: { setup: 3290, monthly: 279 },
    branche: { setup: 5990, monthly: 499 },
  };
  return branchenPreise[formData.ki_branche] || { setup: 0, monthly: 0 };
};

export const calcVoice = (formData: OfferFormData): { setup: number; monthly: number } => {
  let base = 0;
  if (formData.voice_type === 'weiterleitung') base = 3500;
  if (formData.voice_type === 'vorqualifizierung') base = 6000;
  if (formData.voice_type === 'vollautomatisch') base = 9500;
  return { setup: base, monthly: 0 };
};

export const calcProzess = (formData: OfferFormData): { setup: number; monthly: number } => {
  if (formData.prozess_type === 'audit') return { setup: 1200, monthly: 0 };
  if (formData.prozess_type === 'workshop') return { setup: 2500, monthly: 0 };
  return { setup: 0, monthly: 0 };
};

export const calcBeratung = (formData: OfferFormData): number => {
  if (formData.beratung_model === 'kontingent') return 3500;
  if (formData.beratung_model === 'einzelstunden')
    return Math.round((parseFloat(formData.beratung_hours) || 0) * 199);
  if (formData.beratung_model === 'beides')
    return 3500 + Math.round((parseFloat(formData.beratung_hours) || 0) * 199);
  return 0;
};

export const calcTotal = (formData: OfferFormData): { setup: number; monthly: number } => {
  let setup = 0;
  let monthly = 0;

  if (formData.services_selected.includes('Website & Digitale Plattformen')) {
    const w = calcWebsite(formData);
    setup += w.setup;
    monthly += w.monthly;
  }
  if (formData.services_selected.includes('Social Media Marketing')) {
    const s = calcSocial(formData);
    setup += s.setup;
    monthly += s.monthly;
  }
  if (formData.services_selected.includes('SEO & Sichtbarkeit')) {
    const s = calcSEO(formData);
    setup += s.setup;
    monthly += s.monthly;
  }
  if (formData.services_selected.includes('KI-Agenten & Automation')) {
    const k = calcKI(formData);
    setup += k.setup;
    monthly += k.monthly;
  }
  if (formData.services_selected.includes('Voicebots / Sprachassistenz')) {
    const v = calcVoice(formData);
    setup += v.setup;
    monthly += v.monthly;
  }
  if (formData.services_selected.includes('Prozessoptimierung & Digitalstrategie')) {
    const p = calcProzess(formData);
    setup += p.setup;
    monthly += p.monthly;
  }
  if (formData.services_selected.includes('Beratung & Schulung')) {
    setup += calcBeratung(formData);
  }

  return { setup, monthly };
};
