import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Home, Users, Briefcase, FolderOpen, Phone, FileText, 
  Bot, Brain, Mic, Monitor, Globe, Megaphone, Search, 
  GraduationCap, BookOpen, Smartphone, Lock, Cog, Building2, 
  Package, HandCoins, Handshake, Scale, Shield, Map
} from "lucide-react";

interface SitemapSection {
  title: string;
  icon: React.ElementType;
  links: {
    name: string;
    href: string;
    description?: string;
  }[];
}

const sitemapData: SitemapSection[] = [
  {
    title: "Hauptseiten",
    icon: Home,
    links: [
      { name: "Startseite", href: "/", description: "Willkommen bei DeutLicht" },
      { name: "Über uns", href: "/ueber-uns", description: "Unser Team & unsere Mission" },
      { name: "Hintergrund", href: "/ueber-uns/hintergrund", description: "Unsere Geschichte & Erfahrung" },
      { name: "Leistungen", href: "/leistungen", description: "Alle Dienstleistungen im Überblick" },
      { name: "Projekte", href: "/projekte", description: "Referenzen & Kundenprojekte" },
      { name: "Kontakt", href: "/kontakt", description: "Sprechen Sie mit uns" },
      { name: "Projektanfrage", href: "/projektanfrage", description: "Starten Sie Ihr Projekt" },
    ]
  },
  {
    title: "KI & Automatisierung",
    icon: Bot,
    links: [
      { name: "KI-Check", href: "/ki-check", description: "Kostenloser KI-Readiness Check" },
      { name: "KI-Agenten", href: "/ki-agenten", description: "Autonome Prozessautomatisierung" },
      { name: "KI-Branchenlösungen", href: "/leistungen/ki-branchen-loesungen", description: "Branchenspezifische KI-Pakete" },
      { name: "Voicebot Demos", href: "/leistungen/voicebot-demos", description: "Sprachassistenten in Aktion" },
    ]
  },
  {
    title: "Digitalisierung & Systeme",
    icon: Monitor,
    links: [
      { name: "Digitalisierung", href: "/leistungen/digitalisierung", description: "Digitale Transformation" },
      { name: "CRM & ERP Systeme", href: "/leistungen/crm-erp", description: "Kundenmanagement & Ressourcenplanung" },
      { name: "BIM Systeme", href: "/leistungen/bim", description: "Building Information Modeling" },
      { name: "PIM Systeme", href: "/leistungen/pim", description: "Product Information Management" },
      { name: "Wissensmanagement", href: "/leistungen/wissensmanagement", description: "Wissen strukturiert nutzen" },
    ]
  },
  {
    title: "Web & Marketing",
    icon: Globe,
    links: [
      { name: "Websites & Shops", href: "/leistungen/websites", description: "Webentwicklung & E-Commerce" },
      { name: "Marketing & Social Media", href: "/leistungen/marketing", description: "Online-Marketing Strategien" },
      { name: "SEO & Sichtbarkeit", href: "/leistungen/seo", description: "Suchmaschinenoptimierung" },
    ]
  },
  {
    title: "Beratung & Schulung",
    icon: GraduationCap,
    links: [
      { name: "Schulungen & Beratung", href: "/leistungen/schulung", description: "Weiterbildung & Coaching" },
      { name: "Förderberatung", href: "/leistungen/foerderberatung", description: "Fördermittel optimal nutzen" },
    ]
  },
  {
    title: "Hardware & Lösungen",
    icon: Smartphone,
    links: [
      { name: "Self-Order & 24/7 Lösungen", href: "/leistungen/chayns-loesungen", description: "Selbstbedienungssysteme" },
      { name: "Schlösser & Roboter", href: "/leistungen/chayns-hardware", description: "Smart Hardware Lösungen" },
    ]
  },
  {
    title: "Partner-Programm",
    icon: Handshake,
    links: [
      { name: "Partner-Programm", href: "/partner", description: "Werden Sie Partner" },
      { name: "Partner anmelden", href: "/partner/anmelden", description: "Jetzt registrieren" },
    ]
  },
  {
    title: "Rechtliches",
    icon: Scale,
    links: [
      { name: "Impressum", href: "/impressum", description: "Rechtliche Angaben" },
      { name: "Datenschutz", href: "/datenschutz", description: "Datenschutzerklärung" },
      { name: "AGB", href: "/agb", description: "Allgemeine Geschäftsbedingungen" },
      { name: "Barrierefreiheit", href: "/datenschutz#barrierefreiheit", description: "Zugänglichkeit" },
    ]
  },
];

const Sitemap = () => {
  return (
    <>
      <Helmet>
        <title>Sitemap | DeutLicht® – Alle Seiten im Überblick</title>
        <meta
          name="description"
          content="Übersicht aller Seiten von DeutLicht®. Finden Sie schnell Informationen zu KI-Agenten, Digitalisierung, Websites, Marketing und mehr."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://deutlicht.de/sitemap" />
      </Helmet>

      <Navigation />

      <main id="main-content" className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
              <Map className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">Seitenübersicht</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Sitemap
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Alle Seiten von DeutLicht® auf einen Blick. Navigieren Sie schnell zu den gewünschten Inhalten.
            </p>
          </div>

          {/* Sitemap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sitemapData.map((section) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={section.title}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="group flex flex-col py-2 px-3 -mx-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="text-foreground group-hover:text-accent transition-colors font-medium text-sm">
                            {link.name}
                          </span>
                          {link.description && (
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {link.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* XML Sitemap Link */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-4 bg-muted rounded-xl">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">XML Sitemap für Suchmaschinen</p>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  /sitemap.xml
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Sitemap;
