import { 
  Building2, 
  Wrench, 
  UtensilsCrossed, 
  Factory, 
  Plane, 
  TrendingUp, 
  HeartPulse, 
  GraduationCap, 
  Tractor, 
  LayoutGrid,
  type LucideIcon
} from "lucide-react";

export interface BranchenLoesung {
  id: string;
  branche: string;
  icon: LucideIcon;
  botName: string;
  problem: string;
  loesung: string;
  anwendungen: string[];
  roi: string[];
  detailbeschreibung: string;
}

export const branchenLoesungen: BranchenLoesung[] = [
  {
    id: "oeffentliche-verwaltung",
    branche: "Öffentliche Verwaltung",
    icon: Building2,
    botName: "DeutLicht BürgerBot",
    problem: "Bürgeranfragen überlasten das Personal, eingeschränkte Öffnungszeiten begrenzen Service und Transparenz.",
    loesung: "24/7 Bürger-Hotline, Formularhilfe, Förderanträge, Umfragen.",
    anwendungen: [
      "Beantwortung von Bürgeranfragen (Leistungen, Zuständigkeiten, Fristen)",
      "Unterstützung bei Förder- & Antragsprozessen",
      "Terminbuchung & Statusabfragen",
      "Bürgerumfragen & Feedback"
    ],
    roi: [
      "bis zu 80 % Routineanfragen automatisiert",
      "Personal fokussiert sich auf komplexe Fälle"
    ],
    detailbeschreibung: "Der BürgerBot agiert als digitale Erstkontaktstelle für Kommunen und Behörden. Er integriert bestehende Verwaltungsportale, Formularsysteme und Wissensdatenbanken. Durch klare Eskalationsregeln werden komplexe Anliegen nahtlos an Sachbearbeiter übergeben."
  },
  {
    id: "handwerk-bau",
    branche: "Handwerk & Bau",
    icon: Wrench,
    botName: "DeutLicht HandwerksBot",
    problem: "Manuelle Baustellendokumentation, unstrukturierte Kundenkommunikation, hoher Telefonaufwand.",
    loesung: "Checklisten, Terminplanung, Upsell-Logik.",
    anwendungen: [
      "Digitale Baustellenprotokolle",
      "Angebots- & Terminabstimmung",
      "Wartungs- & Upsell-Hinweise",
      "Kundenstatus-Updates"
    ],
    roi: [
      "70 % weniger Telefonate",
      "+40 % Kundenzufriedenheit"
    ],
    detailbeschreibung: "Der HandwerksBot verbindet Projektmanagement, Kundenkommunikation und Nachverkauf. Er entlastet Betriebe von administrativen Aufgaben und schafft strukturierte Abläufe von der Anfrage bis zur Nachbetreuung."
  },
  {
    id: "handel-gastronomie",
    branche: "Handel & Gastronomie",
    icon: UtensilsCrossed,
    botName: "DeutLicht GastroBot",
    problem: "Personalengpässe, verpasste Bestellungen außerhalb der Öffnungszeiten.",
    loesung: "Self-Order, Status-Updates, Upsell.",
    anwendungen: [
      "24/7 Bestellannahme",
      "Abhol- & Lieferstatus",
      "Zusatzverkäufe (Getränke, Extras)",
      "Gästekommunikation"
    ],
    roi: [
      "+30 % Umsatz durch permanente Bestellbarkeit"
    ],
    detailbeschreibung: "Der GastroBot integriert Kassensysteme und Lieferdienste. Er reduziert Wartezeiten, erhöht Bestellvolumen und verbessert das Gästeerlebnis – ohne zusätzliches Personal."
  },
  {
    id: "maschinenbau-industrie",
    branche: "Maschinenbau & Industrie",
    icon: Factory,
    botName: "DeutLicht ProdBot",
    problem: "Lange Angebotsphasen, unqualifizierte Leads, hohe Vertriebskosten.",
    loesung: "Produktkonfigurator & Lead-Qualifizierung.",
    anwendungen: [
      "Interaktive Produktkonfiguration",
      "Technische Vorqualifizierung",
      "Angebotsvorbereitung",
      "Übergabe an Vertrieb"
    ],
    roi: [
      "50 % kürzere Angebotsphasen"
    ],
    detailbeschreibung: "Der ProdBot sammelt technische Anforderungen strukturiert, prüft Machbarkeit und bereitet Angebote vor. Vertriebsteams konzentrieren sich auf Abschluss statt Datensammlung."
  },
  {
    id: "tourismus-hotellerie",
    branche: "Tourismus & Hotellerie",
    icon: Plane,
    botName: "DeutLicht ReiseBot",
    problem: "Manuelle Buchungen, verpasste Upsells, hoher Kommunikationsaufwand.",
    loesung: "Buchung, Upsell, Check-in.",
    anwendungen: [
      "Zimmer- & Tourbuchungen",
      "Gruppenanfragen",
      "Digitale Check-ins",
      "Zusatzleistungen (Spa, Ausflüge)"
    ],
    roi: [
      "+25 % Zusatzumsatz durch Upsell"
    ],
    detailbeschreibung: "Der ReiseBot begleitet Gäste entlang der gesamten Customer Journey – von der Anfrage bis zum Aufenthalt – und steigert Umsatz pro Gast automatisiert."
  },
  {
    id: "mittelstand-digitalisierung",
    branche: "Mittelstand & Digitalisierung",
    icon: TrendingUp,
    botName: "DeutLicht Workflow-Audit + HR-Bots",
    problem: "Manuelle Prozesse blockieren Wachstum und Skalierung.",
    loesung: "Prozessanalyse, HR-Onboarding, interne Anfragen, Wissensmanagement.",
    anwendungen: [
      "Prozessanalyse",
      "HR-Onboarding",
      "Interne Anfragen",
      "Wissensmanagement"
    ],
    roi: [
      "50 % schnelleres Onboarding",
      "messbare Prozessverbesserung"
    ],
    detailbeschreibung: "Der Workflow-Audit identifiziert Automatisierungspotenziale. Anschließend werden KI-Agenten für HR, Verwaltung und interne Services deployed."
  },
  {
    id: "pflege-senioren",
    branche: "Pflege & Senioren",
    icon: HeartPulse,
    botName: "DeutLicht CareBot",
    problem: "Personalmangel, zeitintensive Routineaufgaben.",
    loesung: "Termine, Medikamente, Updates.",
    anwendungen: [
      "Erinnerungen & Terminplanung",
      "Angehörigen-Updates",
      "Dokumentationshilfe",
      "Informationshotline"
    ],
    roi: [
      "Pflegekräfte entlastet",
      "Angehörige besser informiert"
    ],
    detailbeschreibung: "Der CareBot reduziert administrativen Aufwand und verbessert Kommunikation – ohne menschliche Nähe zu ersetzen."
  },
  {
    id: "bildung-weiterbildung",
    branche: "Bildung & Weiterbildung",
    icon: GraduationCap,
    botName: "DeutLicht LernBot",
    problem: "Bürokratische Anmeldungen, verpasste Förderungen, hoher Papieraufwand.",
    loesung: "Kurse, Termine, BAFA-Check.",
    anwendungen: [
      "Kursberatung & Anmeldung",
      "Förderfähigkeits-Check (z. B. BAFA)",
      "Termin- & Dokumentenmanagement",
      "Teilnehmerkommunikation"
    ],
    roi: [
      "Qualifizierung ohne Papierkram",
      "höhere Förderquote"
    ],
    detailbeschreibung: "Der LernBot begleitet Teilnehmende von der Förderprüfung bis zum Kursabschluss und reduziert Verwaltungsaufwand für Bildungsträger massiv."
  },
  {
    id: "landwirtschaft",
    branche: "Landwirtschaft",
    icon: Tractor,
    botName: "DeutLicht AgroBot",
    problem: "Wetter-, Liefer- und Planungschaos, fehlende Transparenz.",
    loesung: "Wetter- & Erntehinweise, Lieferantenkommunikation, Förderübersicht.",
    anwendungen: [
      "Wetter- & Erntehinweise",
      "Lieferantenkommunikation",
      "Förder- & Subventionsübersicht",
      "Maschinen- & Wartungsplanung"
    ],
    roi: [
      "geringere Ausfälle",
      "bessere Planungssicherheit"
    ],
    detailbeschreibung: "Der AgroBot verknüpft externe Daten (Wetter, Marktpreise) mit internen Abläufen und unterstützt Landwirte bei Entscheidungen in Echtzeit."
  },
  {
    id: "weitere-branchen",
    branche: "Weitere Branchen",
    icon: LayoutGrid,
    botName: "DeutLicht BranchenBot",
    problem: "Branchenspezifische Herausforderungen erfordern individuelle Lösungen.",
    loesung: "Template-basierte KI-Lösung für Ihre Branche.",
    anwendungen: [
      "Fitnessstudios",
      "Autowerkstätten",
      "Gartenmärkte",
      "Arzt- & Therapiepraxen",
      "Immobilien",
      "Einzelhandel",
      "Fertigung",
      "Gesundheitswesen"
    ],
    roi: [
      "20–50 % Effizienzsteigerung, branchenspezifisch"
    ],
    detailbeschreibung: "Vorgefertigte KI-Templates werden in wenigen Wochen kundenspezifisch angepasst – ohne Individualentwicklung von Grund auf."
  }
];

export const strategischeBausteine = [
  {
    id: "showcase-plattform",
    title: "KI-Agenten-Showcase-Plattform",
    icon: "🔥",
    prioritaet: "High",
    aufwand: "High",
    auswirkung: "High",
    beschreibung: "Vertriebstool & Proof-of-Concept – verkürzt Verkaufszyklen massiv"
  },
  {
    id: "modularer-baukasten",
    title: "Modularer KI-Agenten-Baukasten + API-Ökosystem",
    icon: "🔧",
    prioritaet: "High",
    aufwand: "High",
    auswirkung: "High",
    beschreibung: "Kunden kombinieren Module selbst – geringe Einstiegshürden, hohe Skalierung"
  },
  {
    id: "dokumentenverarbeitung",
    title: "Dokumentenverarbeitungs-Agent für KMU",
    icon: "📄",
    prioritaet: "High",
    aufwand: "Medium",
    auswirkung: "Medium",
    beschreibung: "Rechnungen, Verträge, Klassifizierung – Fokus-Produkt für schnelle Referenzen"
  },
  {
    id: "monitoring-analytics",
    title: "KI-Agenten-Monitoring & Analytics",
    icon: "📊",
    prioritaet: "Medium",
    aufwand: "Medium",
    auswirkung: "High",
    beschreibung: "Transparenz, ROI-Tracking, Optimierung – starke Kundenbindung"
  },
  {
    id: "hybrid-modell",
    title: "Hybrid-Modell: KI + Mensch",
    icon: "🤝",
    prioritaet: "Medium",
    aufwand: "Low",
    auswirkung: "High",
    beschreibung: "Reduziert KI-Ängste – ideal für Verwaltung, Mittelstand, Pflege"
  }
];
