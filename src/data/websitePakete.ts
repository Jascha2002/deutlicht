// Website-Pakete Leistungsübersicht

export interface WebsitePaket {
  id: string;
  name: string;
  beschreibung: string;
  leistungen: string[];
  hinweis?: string;
}

export const websitePakete: WebsitePaket[] = [
  {
    id: 'landingpage_starter',
    name: 'Landingpage Starter',
    beschreibung: 'Eine einfache, aber effektive Einstiegs-Landingpage, ideal für kleine Unternehmen oder Startups, die schnell online präsent sein möchten. Sie dient als digitale Visitenkarte mit Fokus auf klare Botschaften, um Besucher zu überzeugen und Leads zu generieren.',
    leistungen: [
      'Einseitige Landingpage mit responsivem Design (mobiloptimiert)',
      'Header, Hero-Bereich, Call-to-Action-Buttons und Kontaktformular',
      'Basis-SEO-Optimierung (Meta-Tags, Keywords)',
      'Einbindung von bis zu 5 Bildern oder Grafiken',
      'Test und Launch auf Ihrem Hosting',
      'Eine Korrekturschleife'
    ],
    hinweis: 'Nicht enthalten: Custom Animationen, komplexe Integrationen, E-Commerce, Mehrsprachigkeit (optional buchbar)'
  },
  {
    id: 'landingpage',
    name: 'Landingpage Professional',
    beschreibung: 'Eine erweiterte Landingpage für professionelle Anforderungen, geeignet für Unternehmen, die eine starke Online-Präsenz aufbauen wollen. Sie bietet mehr Tiefe und Interaktivität, um Besucher länger zu binden und Konversionen zu steigern.',
    leistungen: [
      'Einseitige Landingpage mit erweitertem responsivem Design und Animationen',
      'Slider, Testimonials, interaktive Formulare und Social-Media-Links',
      'Erweiterte SEO-Optimierung (On-Page-SEO, Schema-Markup)',
      'Einbindung von bis zu 10 Bildern, Videos oder Grafiken',
      'Integration einfacher Analysetools (z.B. Google Analytics)',
      'Test, Launch und zwei Korrekturschleifen',
      'Optionale Integration von E-Mail-Marketing-Tools'
    ]
  },
  {
    id: 'onepager',
    name: 'Onepager',
    beschreibung: 'Kompakte Darstellung aller wichtigen Informationen auf einer einzigen Seite mit klarer Struktur und einfacher Navigation.',
    leistungen: [
      'Responsive One-Page Design',
      'Strukturierte Sektionen für Ihr Angebot',
      'Kontaktformular und Social-Media-Integration',
      'SEO-Grundlagen',
      'Eine Korrekturschleife'
    ]
  },
  {
    id: '5-10',
    name: 'Website 5-10 Seiten',
    beschreibung: 'Eine vollwertige Website mit moderatem Umfang, perfekt für kleine bis mittelgroße Unternehmen, die eine umfassende Präsentation benötigen. Sie umfasst mehrere Seiten für Inhalte wie Über Uns, Services und Kontakt, mit Fokus auf Funktionalität und Skalierbarkeit.',
    leistungen: [
      'Erstellung von 5-10 individuellen Seiten mit responsivem Design',
      'Inklusive Navigation, Footer, Blog-Bereich (falls gewünscht) und Kontaktformular',
      'Fortgeschrittene SEO-Optimierung für alle Seiten',
      'Multimedia-Elemente (Bilder, Videos) und bis zu 2 benutzerdefinierte Formulare',
      'CMS-Integration (z.B. WordPress) für einfache Selbstverwaltung',
      'Test, Launch und drei Korrekturschleifen',
      'Basis-Sicherheitsfeatures (SSL, CAPTCHA)'
    ]
  },
  {
    id: '10-20',
    name: 'Website 10-20 Seiten',
    beschreibung: 'Eine umfangreiche Website für wachsende Unternehmen, die detaillierte Inhalte und Funktionen benötigen. Sie eignet sich für Portfolios, Dienstleistungsseiten oder E-Commerce-Vorbereitungen, mit höherem Fokus auf Interaktion und Anpassung.',
    leistungen: [
      'Erstellung von 10-20 individuellen Seiten mit hoch responsivem Design',
      'Erweiterte Navigation, Suchfunktion, Blog-Modul und multiple Formulare',
      'Vollständige SEO-Optimierung inkl. technischer SEO und Content-Strategie',
      'Erweiterte Multimedia-Elemente, Galleries und Integrationen (z.B. Zahlungssysteme)',
      'Fortgeschrittene CMS-Integration mit Schulung zur Bedienung',
      'Test, Launch, vier Korrekturschleifen und Performance-Optimierung',
      'Erweiterte Sicherheits- und Datenschutzfeatures (DSGVO-konform)'
    ]
  },
  {
    id: '20-30',
    name: 'Website 20-30 Seiten',
    beschreibung: 'Umfangreiche Unternehmensdarstellung für etablierte Unternehmen mit vielen Leistungen, Produkten oder Standorten.',
    leistungen: [
      'Erstellung von 20-30 individuellen Seiten mit Premium-Design',
      'Komplexe Navigationsstruktur und Suchfunktion',
      'Umfassende SEO-Strategie mit laufender Optimierung',
      'Integration von APIs und externen Systemen',
      'Professionelle CMS-Integration mit erweiterter Schulung',
      'Unbegrenzte Korrekturschleifen in der Initialphase',
      'Performance-Tuning und Skalierbarkeitsplanung'
    ]
  },
  {
    id: '>30',
    name: 'Website 20+ Seiten (Enterprise)',
    beschreibung: 'Eine große, skalierbare Website für etablierte Unternehmen oder komplexe Projekte, die umfangreiche Inhalte und Features erfordern. Ideal für E-Commerce, Portale oder internationale Präsenzen, mit maximaler Flexibilität und Integrationen.',
    leistungen: [
      'Erstellung von 20+ individuellen Seiten mit premium responsivem Design und Custom-Entwicklungen',
      'Vollständige Site-Struktur inkl. Suchmaschine, User-Accounts (falls nötig) und E-Commerce-Module',
      'Umfassende SEO-Strategie mit Ongoing-Optimierung',
      'Integration von komplexen Elementen wie APIs, Datenbanken und interaktiven Tools',
      'Professionelle CMS-Integration mit erweiterter Schulung und Support',
      'Test, Launch, unbegrenzte Korrekturschleifen in der Initialphase und Wartungsoptionen',
      'Hochwertige Sicherheitsmaßnahmen, Performance-Tuning und Skalierbarkeitsplanung'
    ],
    hinweis: 'Für Projekte dieser Größenordnung empfehlen wir ein unverbindliches Beratungsgespräch'
  }
];

export const getWebsitePaketById = (id: string): WebsitePaket | undefined => {
  return websitePakete.find(p => p.id === id);
};

export const getWebsitePaketLabel = (id: string): string => {
  const paket = getWebsitePaketById(id);
  return paket ? paket.name : id;
};
