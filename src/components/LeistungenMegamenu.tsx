import { Link } from "react-router-dom";
import { 
  Monitor, 
  TrendingUp, 
  FileText, 
  Bot, 
  Mic, 
  Building2, 
  BookOpen, 
  Globe, 
  Cog, 
  Package, 
  Megaphone, 
  Search, 
  Smartphone, 
  GraduationCap,
  ArrowRight,
  Sparkles,
  Brain,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackNavClick } from "@/lib/analytics";

// Import highlight images from Leistungen
import heroLeistungen from "@/assets/hero-leistungen.jpg";
import leistungKiAgenten from "@/assets/leistung-ki-agenten.jpg";
import leistungWebsites from "@/assets/leistung-websites-new.jpg";
import leistungMarketing from "@/assets/leistung-marketing-new.jpg";

interface MegamenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

interface MegamenuColumn {
  title: string;
  icon: React.ElementType;
  highlightImage: string;
  highlightTitle: string;
  highlightHref: string;
  items: MegamenuItem[];
}

const megamenuData: MegamenuColumn[] = [
  {
    title: "Strategie & Digitalisierung",
    icon: TrendingUp,
    highlightImage: heroLeistungen,
    highlightTitle: "Digitale Transformation",
    highlightHref: "/leistungen/digitalisierung",
    items: [
      {
        name: "Digitalisierung",
        href: "/leistungen/digitalisierung",
        icon: Monitor,
        description: "Digitale Transformation starten",
      },
      {
        name: "Strategische Transformation",
        href: "/leistungen",
        icon: TrendingUp,
        description: "Ganzheitliche Strategieberatung",
      },
      {
        name: "Förderberatung",
        href: "/leistungen/foerderberatung",
        icon: FileText,
        description: "Fördermittel optimal nutzen",
      },
    ],
  },
  {
    title: "KI & Automatisierung",
    icon: Brain,
    highlightImage: leistungKiAgenten,
    highlightTitle: "Intelligente KI-Agenten",
    highlightHref: "/leistungen/ki-agenten",
    items: [
      {
        name: "KI-Agenten",
        href: "/leistungen/ki-agenten",
        icon: Bot,
        description: "Intelligente Automatisierung",
      },
      {
        name: "KI Voice Agents",
        href: "/leistungen/voicebot-demos",
        icon: Mic,
        description: "Sprachassistenten 24/7",
      },
      {
        name: "Branchenlösungen mit KI",
        href: "/leistungen/ki-branchen-loesungen",
        icon: Building2,
        description: "Maßgeschneiderte KI-Pakete",
      },
      {
        name: "Wissensmanagement",
        href: "/leistungen/wissensmanagement",
        icon: BookOpen,
        description: "Wissen intelligent verwalten",
      },
    ],
  },
  {
    title: "Systeme & Plattformen",
    icon: Layers,
    highlightImage: leistungWebsites,
    highlightTitle: "Moderne Weblösungen",
    highlightHref: "/leistungen/websites",
    items: [
      {
        name: "Websites & Shopsysteme",
        href: "/leistungen/websites",
        icon: Globe,
        description: "Professionelle Webauftritte",
      },
      {
        name: "CRM & ERP Systeme",
        href: "/leistungen/crm-erp",
        icon: Cog,
        description: "Geschäftsprozesse optimieren",
      },
      {
        name: "PIM Systeme",
        href: "/leistungen/pim",
        icon: Package,
        description: "Produktdaten zentral managen",
      },
      {
        name: "BIM Systeme",
        href: "/leistungen/bim",
        icon: Building2,
        description: "Building Information Modeling",
      },
    ],
  },
  {
    title: "Wachstum & Betrieb",
    icon: Sparkles,
    highlightImage: leistungMarketing,
    highlightTitle: "Marketing & Reichweite",
    highlightHref: "/leistungen/marketing",
    items: [
      {
        name: "Marketing & Social Media",
        href: "/leistungen/marketing",
        icon: Megaphone,
        description: "Reichweite effektiv steigern",
      },
      {
        name: "SEO & Sichtbarkeit",
        href: "/leistungen/seo",
        icon: Search,
        description: "Bei Google gefunden werden",
      },
      {
        name: "Self-Order & 24/7",
        href: "/leistungen/chayns-loesungen",
        icon: Smartphone,
        description: "Automatisierter Service",
      },
      {
        name: "Schulung & Beratung",
        href: "/leistungen/schulung",
        icon: GraduationCap,
        description: "Kompetenz aufbauen",
      },
    ],
  },
];

interface LeistungenMegamenuProps {
  onItemClick?: () => void;
}

const LeistungenMegamenu = ({ onItemClick }: LeistungenMegamenuProps) => {
  const handleClick = (href: string) => {
    trackNavClick(href);
    onItemClick?.();
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
      {/* Megamenu Grid */}
      <div className="grid grid-cols-4 gap-0 divide-x divide-border">
        {megamenuData.map((column, columnIndex) => (
          <div 
            key={column.title} 
            className={cn(
              "p-5",
              columnIndex === 0 && "bg-accent/5"
            )}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <div className="p-1.5 rounded-lg bg-accent/10">
                <column.icon className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                {column.title}
              </h3>
            </div>

            {/* Highlight Image Card */}
            <Link 
              to={column.highlightHref}
              onClick={() => handleClick(column.highlightHref)}
              className="block relative rounded-xl overflow-hidden group mb-4 h-24"
            >
              <img 
                src={column.highlightImage} 
                alt={column.highlightTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-xs font-medium text-white flex items-center gap-1">
                  {column.highlightTitle}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </div>
            </Link>

            {/* Column Items */}
            <div className="space-y-1">
              {column.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => handleClick(item.href)}
                  className={cn(
                    "group flex items-start gap-3 p-2.5 rounded-lg",
                    "transition-all duration-200",
                    "hover:bg-accent/10 hover:shadow-sm",
                    "border border-transparent hover:border-accent/20"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors flex-shrink-0",
                    "bg-muted group-hover:bg-accent/20"
                  )}>
                    <item.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground group-hover:text-accent transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 px-5 py-3 flex items-center justify-between">
        <Link
          to="/leistungen"
          onClick={() => handleClick("/leistungen")}
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          Alle Leistungen anzeigen
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/projektanfrage"
          onClick={() => handleClick("/projektanfrage")}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          Bedarf klären
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default LeistungenMegamenu;
