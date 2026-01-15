import { 
  Building2, 
  Shield, 
  Home, 
  Zap, 
  Stethoscope, 
  Bell, 
  Package, 
  Wrench,
  Calendar,
  Phone,
  Car,
  Pill,
  BookOpen,
  Truck
} from "lucide-react";

export type VoicebotScenario = {
  id: string;
  category: string;
  title: string;
  shortTitle: string;
  icon: typeof Building2;
  type: "inbound" | "outbound";
  description: string;
  benefits: string[];
  conversation: {
    role: "agent" | "user";
    text: string;
  }[];
};

export const voicebotCategories = [
  { id: "termine", title: "Terminvereinbarung", icon: Calendar },
  { id: "erinnerungen", title: "Terminerinnerungen", icon: Bell },
  { id: "benachrichtigungen", title: "Abholbenachrichtigungen", icon: Package },
  { id: "service", title: "Kundenservice", icon: Phone },
];

export const voicebotScenarios: VoicebotScenario[] = [
  // ===== TERMINVEREINBARUNG =====
  {
    id: "arzt",
    category: "termine",
    title: "Arztpraxis – Vorsorgeuntersuchung buchen",
    shortTitle: "Arzttermin buchen",
    icon: Stethoscope,
    type: "inbound",
    description: "Patienten können rund um die Uhr Termine für Vorsorgeuntersuchungen buchen. Der Bot prüft Verfügbarkeiten und bestätigt direkt.",
    benefits: [
      "Reduzierung von No-Shows um bis zu 30%",
      "24/7 Terminbuchung ohne Wartezeit",
      "DSGVO-konforme Datenverarbeitung",
      "Automatische Kalenderintegration"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag! Sie erreichen die Praxis Dr. Müller. Wie kann ich Ihnen helfen?" },
      { role: "user", text: "Hallo, ich möchte einen Termin für eine Vorsorgeuntersuchung vereinbaren." },
      { role: "agent", text: "Sehr gerne! Geht es um eine Gesundheitsvorsorge, Hautkrebs-Screening oder eine andere Untersuchung?" },
      { role: "user", text: "Eine allgemeine Gesundheitsvorsorge bitte." },
      { role: "agent", text: "Perfekt. Ich habe freie Termine am Dienstag, den 22. Januar um 10 Uhr, oder am Donnerstag, den 24. Januar um 14:30 Uhr. Welcher passt Ihnen besser?" },
      { role: "user", text: "Donnerstag um 14:30 Uhr wäre ideal." },
      { role: "agent", text: "Wunderbar! Ich trage den Termin ein. Darf ich Ihren Namen notieren?" },
      { role: "user", text: "Ja, mein Name ist Thomas Schmidt." },
      { role: "agent", text: "Vielen Dank, Herr Schmidt. Ihr Termin für die Gesundheitsvorsorge ist am Donnerstag, 24. Januar um 14:30 Uhr bei Dr. Müller bestätigt. Sie erhalten eine SMS-Erinnerung am Vortag. Auf Wiederhören!" }
    ]
  },
  {
    id: "immobilien",
    category: "termine",
    title: "Immobilienbüro – Besichtigungstermin",
    shortTitle: "Besichtigungstermin",
    icon: Home,
    type: "inbound",
    description: "Interessenten auf der Warteliste können automatisch Besichtigungstermine buchen. Der Bot prüft Objektverfügbarkeit und sendet Kalender-Einladungen.",
    benefits: [
      "24/7 Verfügbarkeit für Interessenten",
      "Automatische Kalenderintegration",
      "Reduzierung von No-Shows durch Erinnerungen",
      "Lead-Qualifizierung im Gespräch"
    ],
    conversation: [
      { role: "agent", text: "Willkommen bei Immobilien Weber. Wie kann ich Ihnen helfen?" },
      { role: "user", text: "Guten Tag, ich stehe auf der Warteliste für die 3-Zimmer-Wohnung in der Berliner Straße und würde gerne einen Besichtigungstermin vereinbaren." },
      { role: "agent", text: "Natürlich! Ich sehe Ihre Vormerkung. Die Wohnung ist ab sofort zur Besichtigung verfügbar. Ich habe Termine am Samstag um 10 Uhr oder Montag um 17 Uhr. Was passt Ihnen?" },
      { role: "user", text: "Samstag um 10 Uhr wäre perfekt." },
      { role: "agent", text: "Sehr gut! Darf ich Ihren Namen und Ihre E-Mail-Adresse für die Terminbestätigung haben?" },
      { role: "user", text: "Ja, ich bin Lisa Bauer, meine E-Mail ist lisa.bauer@email.de." },
      { role: "agent", text: "Vielen Dank, Frau Bauer! Ihr Besichtigungstermin für die 3-Zimmer-Wohnung in der Berliner Straße ist für Samstag, 10 Uhr bestätigt. Sie erhalten eine E-Mail mit allen Details und eine Erinnerung am Vortag. Bis Samstag!" }
    ]
  },
  {
    id: "werkstatt",
    category: "termine",
    title: "Autowerkstatt – Werkstatttermin",
    shortTitle: "Werkstatttermin",
    icon: Car,
    type: "inbound",
    description: "Kunden können Werkstatttermine für Inspektionen, Reparaturen oder TÜV vereinbaren. Der Bot erfasst Fahrzeugdaten und den gewünschten Service.",
    benefits: [
      "Schnelle Terminbuchung ohne Wartezeit",
      "Erfassung wichtiger Fahrzeugdaten",
      "Automatische Ersatzteil-Vorabprüfung",
      "Reduzierung von Leerläufen"
    ],
    conversation: [
      { role: "agent", text: "Autohaus Schmidt Service, wie kann ich Ihnen helfen?" },
      { role: "user", text: "Hallo, ich brauche einen Termin für die Hauptuntersuchung." },
      { role: "agent", text: "Gerne! Um welches Fahrzeug handelt es sich?" },
      { role: "user", text: "Ein VW Golf, Baujahr 2019." },
      { role: "agent", text: "Perfekt. Für die HU mit AU habe ich freie Termine am Mittwoch um 8 Uhr oder Freitag um 14 Uhr. Was ist Ihnen lieber?" },
      { role: "user", text: "Mittwoch um 8 Uhr passt gut." },
      { role: "agent", text: "In Ordnung. Bitte bringen Sie Fahrzeugschein und Serviceunterlagen mit. Der Termin dauert etwa 60 Minuten. Darf ich Ihren Namen und Ihre Telefonnummer notieren?" },
      { role: "user", text: "Ja, Michael Bergmann, 0171 1234567." },
      { role: "agent", text: "Danke, Herr Bergmann! Ihr HU-Termin ist für Mittwoch um 8 Uhr bestätigt. Sie erhalten eine SMS-Erinnerung am Vortag. Bis dann!" }
    ]
  },
  {
    id: "ablesung",
    category: "termine",
    title: "Ablesedienst – Zählerablesung",
    shortTitle: "Ablesetermin",
    icon: Zap,
    type: "inbound",
    description: "Terminbuchung für Zählerablesungen (Strom, Wasser, Gas, Heizung). Der Bot schlägt verfügbare Zeitfenster vor und sendet automatische Bestätigungen.",
    benefits: [
      "Optimierung der Feldarbeiten",
      "Reduzierung von Fehlablesungen",
      "Flexible Terminvergabe",
      "SMS-Bestätigung automatisch"
    ],
    conversation: [
      { role: "agent", text: "Stadtwerke Musterstadt, Abteilung Zählerablesung. Was kann ich für Sie tun?" },
      { role: "user", text: "Guten Tag, ich muss einen Termin für die Stromzählerablesung vereinbaren." },
      { role: "agent", text: "Natürlich! Können Sie mir bitte Ihre Kundennummer oder Adresse nennen?" },
      { role: "user", text: "Meine Kundennummer ist 456789." },
      { role: "agent", text: "Danke! Ich sehe Ihre Adresse: Hauptstraße 12. Für die Ablesung habe ich folgende Zeitfenster: Montag zwischen 9 und 12 Uhr oder Dienstag zwischen 14 und 17 Uhr. Was passt besser?" },
      { role: "user", text: "Dienstag Nachmittag wäre gut." },
      { role: "agent", text: "Perfekt! Ihr Ablesetermin ist für Dienstag zwischen 14 und 17 Uhr eingetragen. Bitte stellen Sie sicher, dass der Zähler zugänglich ist. Sie erhalten eine SMS mit dem genauen Zeitfenster am Vortag. Vielen Dank!" }
    ]
  },

  // ===== TERMINERINNERUNGEN =====
  {
    id: "werkstatt-erinnerung",
    category: "erinnerungen",
    title: "Autowerkstatt – Reparatur-Erinnerung",
    shortTitle: "Werkstatt-Erinnerung",
    icon: Wrench,
    type: "outbound",
    description: "Automatische Anrufe erinnern Kunden an anstehende Werkstatttermine und bieten Optionen zur Bestätigung oder Umbuchung.",
    benefits: [
      "Reduzierung von No-Shows um bis zu 40%",
      "Automatische Umbuchung möglich",
      "Entlastung des Personals",
      "Bessere Werkstattauslastung"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist der automatische Erinnerungsservice von Autohaus Schmidt. Spreche ich mit Herrn Bergmann?" },
      { role: "user", text: "Ja, am Apparat." },
      { role: "agent", text: "Ich rufe an, um Sie an Ihren Werkstatttermin morgen um 8 Uhr zu erinnern. Es geht um die Hauptuntersuchung Ihres VW Golf. Können Sie den Termin bestätigen?" },
      { role: "user", text: "Ja, der Termin passt." },
      { role: "agent", text: "Wunderbar! Bitte denken Sie daran, Fahrzeugschein und Serviceunterlagen mitzubringen. Die Bearbeitung dauert etwa 60 Minuten. Wir freuen uns auf Sie!" },
      { role: "user", text: "Danke für die Erinnerung!" },
      { role: "agent", text: "Gerne geschehen! Falls Sie noch Fragen haben, erreichen Sie uns unter unserer Servicenummer. Auf Wiederhören!" }
    ]
  },
  {
    id: "arzt-erinnerung",
    category: "erinnerungen",
    title: "Arztpraxis – Terminerinnerung",
    shortTitle: "Arzt-Erinnerung",
    icon: Stethoscope,
    type: "outbound",
    description: "Patienten werden automatisch an anstehende Arzttermine erinnert. Bei Bedarf können sie direkt umbuchen oder absagen.",
    benefits: [
      "Reduzierung von No-Shows um bis zu 30%",
      "DSGVO-konform",
      "Direkte Umbuchungsmöglichkeit",
      "Entlastung des Praxisteams"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist die automatische Terminerinnerung der Praxis Dr. Müller. Spreche ich mit Herrn Schmidt?" },
      { role: "user", text: "Ja, das bin ich." },
      { role: "agent", text: "Ich möchte Sie an Ihren Termin morgen um 14:30 Uhr erinnern – eine Gesundheitsvorsorge bei Dr. Müller. Können Sie diesen Termin wahrnehmen?" },
      { role: "user", text: "Ja, ich komme wie geplant." },
      { role: "agent", text: "Sehr gut! Bitte bringen Sie Ihre Versichertenkarte und aktuelle Befunde mit, falls vorhanden. Falls Sie vorher noch Fragen haben, erreichen Sie uns unter 0341 123456. Bis morgen, Herr Schmidt!" }
    ]
  },
  {
    id: "therapie-erinnerung",
    category: "erinnerungen",
    title: "Therapeut – Sitzungserinnerung",
    shortTitle: "Therapie-Erinnerung",
    icon: Calendar,
    type: "outbound",
    description: "Automatische Erinnerung an Therapiesitzungen mit Bestätigungsoption. Reduziert Terminausfälle bei Physiotherapie, Psychotherapie etc.",
    benefits: [
      "Diskrete Erinnerung",
      "Einfache Bestätigung per Sprache",
      "Umbuchungsoption integriert",
      "Weniger Terminausfälle"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist die Praxis für Physiotherapie Gesund & Fit mit einer Terminerinnerung. Spreche ich mit Frau Meier?" },
      { role: "user", text: "Ja, hallo." },
      { role: "agent", text: "Ich erinnere Sie an Ihre Physiotherapie-Sitzung morgen um 9:30 Uhr bei Therapeutin Sandra Koch. Können Sie den Termin bestätigen, indem Sie Ja sagen?" },
      { role: "user", text: "Ja, ich komme." },
      { role: "agent", text: "Perfekt! Bitte tragen Sie bequeme Kleidung und bringen Sie Ihr Rezept mit, falls noch nicht abgegeben. Bis morgen, Frau Meier!" }
    ]
  },

  // ===== ABHOLBENACHRICHTIGUNGEN =====
  {
    id: "einzelhandel-abholung",
    category: "benachrichtigungen",
    title: "Einzelhandel – Bestellung abholbereit",
    shortTitle: "Ware abholen",
    icon: Package,
    type: "outbound",
    description: "Kunden werden benachrichtigt, wenn ihre Bestellung zur Abholung bereit ist. Der Bot bietet auch Lieferoptionen an.",
    benefits: [
      "Reduzierung von Lagerkosten",
      "Besserer Kundenservice",
      "Option für Lieferung",
      "Automatische Erinnerung bei Nichtabholung"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist der Abholservice von Elektronik Meier. Spreche ich mit Frau Wagner?" },
      { role: "user", text: "Ja, das bin ich." },
      { role: "agent", text: "Ich rufe an, um Ihnen mitzuteilen, dass Ihre Bestellung – ein Laptop Lenovo ThinkPad – jetzt zur Abholung in unserer Filiale bereit ist. Möchten Sie ihn abholen oder sollen wir ihn liefern?" },
      { role: "user", text: "Ich hole ihn morgen ab." },
      { role: "agent", text: "Wunderbar! Die Ware wird für Sie reserviert. Unsere Öffnungszeiten sind Montag bis Samstag von 9 bis 18 Uhr. Bitte bringen Sie einen Ausweis und die Bestellnummer mit. Auf Wiederhören!" }
    ]
  },
  {
    id: "werkstatt-fertig",
    category: "benachrichtigungen",
    title: "Werkstatt – Reparatur erledigt",
    shortTitle: "Reparatur fertig",
    icon: Wrench,
    type: "outbound",
    description: "Kunden werden informiert, wenn ihre Reparatur abgeschlossen ist. Der Bot kann auch Zahlungs- und Abholoptionen anbieten.",
    benefits: [
      "Schnelle Kundeninformation",
      "Reduzierung der Lagerdauer",
      "Vorab-Zahlung möglich",
      "Bessere Kundenbindung"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist Autohaus Schmidt Service. Spreche ich mit Herrn Bergmann?" },
      { role: "user", text: "Ja, am Apparat." },
      { role: "agent", text: "Ich freue mich, Ihnen mitzuteilen, dass Ihr VW Golf die Hauptuntersuchung bestanden hat. Das Fahrzeug ist zur Abholung bereit. Der Gesamtbetrag beträgt 89 Euro. Wann möchten Sie Ihr Auto abholen?" },
      { role: "user", text: "Kann ich heute noch vorbeikommen?" },
      { role: "agent", text: "Natürlich! Wir haben heute bis 18 Uhr geöffnet. Sie können bar, mit Karte oder kontaktlos zahlen. Die TÜV-Plakette ist bereits angebracht. Wir freuen uns auf Sie!" }
    ]
  },
  {
    id: "apotheke-abholung",
    category: "benachrichtigungen",
    title: "Apotheke – Medikament verfügbar",
    shortTitle: "Medikament abholen",
    icon: Pill,
    type: "outbound",
    description: "Patienten werden informiert, wenn bestellte Medikamente verfügbar sind. Der Bot kann auch Beratungstermine anbieten.",
    benefits: [
      "Schnelle Patienteninformation",
      "Reduzierung von Wartezeiten",
      "Beratungstermine integrierbar",
      "Bessere Medikamenten-Compliance"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist die Löwen-Apotheke. Spreche ich mit Herrn Müller?" },
      { role: "user", text: "Ja, hallo." },
      { role: "agent", text: "Ich rufe an, um Sie zu informieren, dass Ihr bestelltes Medikament – Pantoprazol 40mg – jetzt bei uns zur Abholung bereit ist. Können Sie es heute oder morgen abholen?" },
      { role: "user", text: "Ich komme morgen vormittag." },
      { role: "agent", text: "Sehr gut! Wir haben morgen ab 8 Uhr geöffnet. Bitte bringen Sie Ihr Rezept mit, falls noch nicht abgegeben. Falls Sie Fragen zur Einnahme haben, steht Ihnen unser Apotheker gerne zur Beratung bereit. Auf Wiederhören!" }
    ]
  },
  {
    id: "bibliothek-abholung",
    category: "benachrichtigungen",
    title: "Bibliothek – Buch reserviert",
    shortTitle: "Buch abholen",
    icon: BookOpen,
    type: "outbound",
    description: "Nutzer werden informiert, wenn reservierte Medien verfügbar sind. Der Bot nennt auch die Abholfrist.",
    benefits: [
      "Automatische Benachrichtigung",
      "Klare Kommunikation der Abholfrist",
      "Reduzierung nicht abgeholter Reservierungen",
      "Entlastung des Bibliothekspersonals"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist die Stadtbibliothek Musterstadt mit einer Benachrichtigung. Spreche ich mit Frau Klein?" },
      { role: "user", text: "Ja, das bin ich." },
      { role: "agent", text: "Ihr vorgemerktes Buch 'Der Schwarm' von Frank Schätzing ist jetzt verfügbar. Sie können es bis Freitag, den 26. Januar abholen. Danach geht die Reservierung an die nächste Person. Passt das für Sie?" },
      { role: "user", text: "Ja, ich hole es morgen ab." },
      { role: "agent", text: "Wunderbar! Das Buch liegt an der Servicetheke für Sie bereit. Bitte bringen Sie Ihren Bibliotheksausweis mit. Unsere Öffnungszeiten sind Dienstag bis Samstag von 10 bis 18 Uhr. Viel Spaß beim Lesen!" }
    ]
  },
  {
    id: "logistik-abholung",
    category: "benachrichtigungen",
    title: "Paketstation – Sendung eingetroffen",
    shortTitle: "Paket abholen",
    icon: Truck,
    type: "outbound",
    description: "Kunden werden informiert, wenn ihr Paket in der Paketstation oder im Pickup-Store angekommen ist.",
    benefits: [
      "Schnelle Kundeninformation",
      "Klare Abholfrist",
      "Alternative Zustelloptionen",
      "Reduzierung der Lagerdauer"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist der automatische Benachrichtigungsservice von Paket Express. Spreche ich mit Herrn Fischer?" },
      { role: "user", text: "Ja, hallo." },
      { role: "agent", text: "Ihre Sendung ist in der Paketstation am Marktplatz 5 eingetroffen. Sie können das Paket innerhalb der nächsten 7 Tage abholen. Ihr Abholcode wurde per SMS zugesandt. Haben Sie diesen erhalten?" },
      { role: "user", text: "Ja, den Code habe ich." },
      { role: "agent", text: "Perfekt! Die Paketstation ist rund um die Uhr zugänglich. Falls Sie Hilfe benötigen, erreichen Sie unseren Kundenservice unter 0800 123456. Einen schönen Tag noch!" }
    ]
  },

  // ===== KUNDENSERVICE =====
  {
    id: "hausverwaltung",
    category: "service",
    title: "Hausverwaltung – Mieteranfragen",
    shortTitle: "Mieterschaden",
    icon: Building2,
    type: "inbound",
    description: "Mieter können rund um die Uhr Schäden melden, Wartungsanfragen stellen oder Informationen erhalten. Der Bot erfasst Details und erstellt Tickets.",
    benefits: [
      "24/7 Erreichbarkeit für Mieter",
      "Automatische Ticket-Erstellung",
      "Dringlichkeitseinstufung",
      "Entlastung der Verwaltung"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, Hausverwaltung Mustermann. Wie kann ich Ihnen helfen?" },
      { role: "user", text: "Hallo, ich habe einen Wasserschaden in der Küche. Es tropft von der Decke." },
      { role: "agent", text: "Das tut mir leid! Das klingt dringend. Können Sie mir bitte Ihre Adresse und Wohnungsnummer nennen?" },
      { role: "user", text: "Ja, Hauptstraße 15, Wohnung 3." },
      { role: "agent", text: "Vielen Dank. Ich habe ein Notfall-Ticket erstellt. Können Sie bitte den Hauptwasserhahn zudrehen, falls möglich? Ein Techniker wird sich innerhalb der nächsten 2 Stunden bei Ihnen melden. Unter welcher Nummer erreichen wir Sie am besten?" },
      { role: "user", text: "0171 9876543." },
      { role: "agent", text: "Perfekt, notiert. Ein Mitarbeiter ruft Sie schnellstmöglich zurück. Falls sich die Situation verschlechtert, rufen Sie bitte sofort die Feuerwehr unter 112. Kann ich sonst noch etwas für Sie tun?" }
    ]
  },
  {
    id: "versicherung",
    category: "service",
    title: "Versicherung – Schadensmeldung",
    shortTitle: "Schadensmeldung",
    icon: Shield,
    type: "inbound",
    description: "Kunden können rund um die Uhr Schäden melden. Der Bot erfasst alle relevanten Informationen und leitet die Meldung an die richtige Abteilung weiter.",
    benefits: [
      "24/7 Schadensmeldung möglich",
      "Strukturierte Datenerfassung",
      "Schnellere Bearbeitung",
      "Reduzierung der Wartezeiten"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, Sie erreichen die Schadensmeldung der Sicherheit Versicherung. Wie kann ich Ihnen helfen?" },
      { role: "user", text: "Guten Tag, ich möchte einen Autoschaden melden." },
      { role: "agent", text: "Das tut mir leid! Sind Sie oder andere Personen verletzt?" },
      { role: "user", text: "Nein, zum Glück nicht. Es ist nur ein Blechschaden." },
      { role: "agent", text: "Gut, dass niemand verletzt ist. Können Sie mir bitte Ihre Versicherungsnummer nennen?" },
      { role: "user", text: "Ja, die Nummer ist VS-123456789." },
      { role: "agent", text: "Vielen Dank. Wann und wo ist der Schaden passiert?" },
      { role: "user", text: "Heute Morgen auf dem Supermarkt-Parkplatz." },
      { role: "agent", text: "Ich habe Ihre Schadensmeldung aufgenommen. Sie erhalten in Kürze eine E-Mail mit Ihrer Schadensnummer und den nächsten Schritten. Ein Sachbearbeiter wird sich innerhalb von 24 Stunden bei Ihnen melden. Kann ich sonst noch etwas für Sie tun?" }
    ]
  },
  {
    id: "mietzahlung",
    category: "service",
    title: "Hausverwaltung – Mieterinnerung",
    shortTitle: "Mieterinnerung",
    icon: Building2,
    type: "outbound",
    description: "Automatische Erinnerung an anstehende Mietzahlungen mit verschiedenen Zahlungsoptionen.",
    benefits: [
      "Reduzierung von Zahlungsausfällen",
      "Diskrete Kommunikation",
      "Verschiedene Zahlungsoptionen",
      "Dokumentation der Kontaktversuche"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist die Hausverwaltung Mustermann. Spreche ich mit Herrn Schulz?" },
      { role: "user", text: "Ja, am Apparat." },
      { role: "agent", text: "Ich rufe an, um Sie freundlich daran zu erinnern, dass Ihre Miete für Januar in 3 Tagen fällig ist. Der Betrag von 850 Euro wird am 1. Januar abgebucht. Ist alles in Ordnung mit der Abbuchung?" },
      { role: "user", text: "Ja, das Geld ist auf dem Konto." },
      { role: "agent", text: "Wunderbar, vielen Dank für die Bestätigung! Falls Sie Fragen zur Nebenkostenabrechnung oder anderen Themen haben, erreichen Sie uns unter 0341 123456. Einen schönen Tag noch!" }
    ]
  },
  {
    id: "versicherung-verlaengerung",
    category: "service",
    title: "Versicherung – Vertragsverlängerung",
    shortTitle: "Vertragserinnerung",
    icon: Shield,
    type: "outbound",
    description: "Kunden werden an auslaufende Versicherungsverträge erinnert und erhalten Angebote zur Verlängerung.",
    benefits: [
      "Proaktive Kundenbindung",
      "Reduzierung der Kündigungsrate",
      "Cross-Selling-Möglichkeiten",
      "Persönliche Betreuung"
    ],
    conversation: [
      { role: "agent", text: "Guten Tag, hier ist die Sicherheit Versicherung. Spreche ich mit Frau Weber?" },
      { role: "user", text: "Ja, hallo." },
      { role: "agent", text: "Ich rufe an, weil Ihre Autoversicherung in 2 Wochen ausläuft. Wir würden Ihnen gerne ein Verlängerungsangebot unterbreiten. Hätten Sie kurz Zeit?" },
      { role: "user", text: "Ja, was bieten Sie an?" },
      { role: "agent", text: "Bei einer Verlängerung um 12 Monate erhalten Sie 10% Rabatt als treue Kundin. Ihre monatliche Prämie wäre dann 42 Euro statt 47 Euro. Soll ich die Verlängerung für Sie einleiten?" },
      { role: "user", text: "Ja, das klingt gut. Bitte verlängern." },
      { role: "agent", text: "Wunderbar! Ich habe die Verlängerung veranlasst. Sie erhalten die neuen Unterlagen per E-Mail. Vielen Dank für Ihre Treue, Frau Weber!" }
    ]
  }
];

// Helper function to get scenarios by category
export const getScenariosByCategory = (categoryId: string) => 
  voicebotScenarios.filter(s => s.category === categoryId);

// Helper function to get scenario by ID
export const getScenarioById = (id: string) => 
  voicebotScenarios.find(s => s.id === id);
