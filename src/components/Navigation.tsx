import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Monitor, Cog, Building2, Package, BookOpen, Smartphone, Globe, Megaphone, FileText, Users, Lock, Bot, Search, GraduationCap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackNavClick, trackCTAClick } from "@/lib/analytics";
import { ThemeToggle } from "@/components/ThemeToggle";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import deutlichtLogo from "@/assets/deutlicht-logo-final.png";
interface SubMenuItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}
interface NavItem {
  name: string;
  href: string;
  submenu?: SubMenuItem[];
  badge?: string;
  badgeStyle?: 'inline' | 'below';
}
// Full-text search data for all pages with content excerpts
const searchablePages = [{
  title: "Startseite",
  path: "/",
  keywords: ["home", "start", "übersicht"],
  content: "DeutLicht digitale Klarheit Vision starke Präsenz Unternehmensberatung Digitalisierung KI-Lösungen Website Entwicklung Willkommen Partner digitale Zukunft"
}, {
  title: "Über uns",
  path: "/ueber-uns",
  keywords: ["team", "unternehmen", "wer wir sind"],
  content: "Unser Team Erfahrung Management Digitalisierung 30 Jahre Expertise Carsten van de Sand Unternehmensberater Strategie Innovation Zusammenarbeit"
}, {
  title: "Hintergrund",
  path: "/ueber-uns/hintergrund",
  keywords: ["geschichte", "erfahrung"],
  content: "Geschichte DeutLicht Entstehung Entwicklung Meilensteine Erfahrung Werdegang Kompetenz Hintergrund Historie"
}, {
  title: "Leistungen",
  path: "/leistungen",
  keywords: ["services", "angebot", "dienstleistungen"],
  content: "Leistungen Digitalisierung CRM ERP BIM PIM Wissensmanagement Website Webshop Marketing Social Media SEO Förderberatung Beratung Schulungen"
}, {
  title: "KI Agenten",
  path: "/leistungen/ki-agenten",
  keywords: ["ki", "künstliche intelligenz", "chatbot", "voice", "automatisierung"],
  content: "KI Agenten künstliche Intelligenz Chatbot Voicebot Sprachassistent Automatisierung Kundenservice 24/7 Erreichbarkeit Machine Learning NLP Branchenlösungen maßgeschneidert"
}, {
  title: "KI-Branchenlösungen",
  path: "/leistungen/ki-branchen-loesungen",
  keywords: ["handwerk", "gesundheit", "gastronomie", "einzelhandel", "ki"],
  content: "KI-Branchenlösungen Handwerk Gesundheit Gastronomie Einzelhandel maßgeschneidert branchenspezifisch KI Pakete Lösungen Anforderungen individuell"
}, {
  title: "Self-Order & 24/7",
  path: "/leistungen/chayns-loesungen",
  keywords: ["selbstbedienung", "terminal", "kiosk"],
  content: "Self-Order Selbstbedienung Terminal Kiosk 24/7 Bestellung digital kontaktlos Gastronomie Handel Kundenerlebnis chayns"
}, {
  title: "Schlösser & Roboter",
  path: "/leistungen/chayns-hardware",
  keywords: ["smartlock", "roboter", "hardware"],
  content: "Smartlock intelligente Schlösser Zutrittskontrolle Roboter Serviceroboter Butlerbot Hardware IoT Automatisierung Schließsystem"
}, {
  title: "CRM & ERP Systeme",
  path: "/leistungen/crm-erp",
  keywords: ["odoo", "kundenmanagement", "enterprise"],
  content: "CRM Customer Relationship Management ERP Enterprise Resource Planning Odoo Kundenmanagement Geschäftsprozesse Integration Verwaltung"
}, {
  title: "BIM Systeme",
  path: "/leistungen/bim",
  keywords: ["building", "information", "modellierung"],
  content: "BIM Building Information Modeling Bauwesen Architektur Planung 3D Modellierung Gebäudedaten Konstruktion"
}, {
  title: "Digitalisierung",
  path: "/leistungen/digitalisierung",
  keywords: ["digital", "transformation"],
  content: "Digitalisierung digitale Transformation Prozesse automatisieren Effizienz steigern Modernisierung IT-Strategie Innovation"
}, {
  title: "Websites & Shops",
  path: "/leistungen/websites",
  keywords: ["website", "webshop", "online"],
  content: "Website Webentwicklung Webshop Online-Shop E-Commerce Responsive Design UX UI Programmierung"
}, {
  title: "Marketing & Social Media",
  path: "/leistungen/marketing",
  keywords: ["social", "werbung", "seo"],
  content: "Marketing Social Media SEO Suchmaschinenoptimierung Werbung Online-Marketing Content Reichweite Sichtbarkeit Facebook Instagram LinkedIn"
}, {
  title: "KI-Check",
  path: "/ki-check",
  keywords: ["readiness", "analyse", "bewertung", "kostenlos"],
  content: "KI-Check KI-Readiness Analyse Bewertung kostenlos Potenzial künstliche Intelligenz Einsatzmöglichkeiten Reife Unternehmen"
}, {
  title: "Angebotsgenerator",
  path: "/angebotsgenerator",
  keywords: ["anfrage", "projekt", "angebot", "generator"],
  content: "Angebotsgenerator Angebot anfragen Projekt starten Kontakt aufnehmen Beratungsgespräch unverbindlich kostenlos"
}, {
  title: "Projekte",
  path: "/projekte",
  keywords: ["referenzen", "portfolio", "beispiele"],
  content: "Projekte Referenzen Portfolio Beispiele Kundenprojekte Erfolge Case Studies Umsetzung"
}, {
  title: "Kontakt",
  path: "/kontakt",
  keywords: ["email", "telefon", "nachricht"],
  content: "Kontakt Email Telefon Nachricht schreiben erreichen Adresse Ansprechpartner Beratung Termin"
}, {
  title: "Impressum",
  path: "/impressum",
  keywords: ["rechtlich", "angaben"],
  content: "Impressum rechtliche Angaben Verantwortlicher Stadtnetz UG Geschäftsführer Handelsregister"
}, {
  title: "Datenschutz",
  path: "/datenschutz",
  keywords: ["dsgvo", "privacy"],
  content: "Datenschutz DSGVO Privacy Datenschutzerklärung Cookies personenbezogene Daten Rechte Verarbeitung"
}];
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ueberUnsOpen, setUeberUnsOpen] = useState(false);
  const [leistungenOpen, setLeistungenOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    title: string;
    path: string;
    keywords: string[];
    content: string;
    score: number;
    excerpt: string;
    matched: boolean;
  }>>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = searchablePages.map(page => {
        // Calculate relevance score
        let score = 0;
        const titleMatch = page.title.toLowerCase().includes(query);
        const keywordMatch = page.keywords.some(kw => kw.includes(query));
        const contentMatch = page.content.toLowerCase().includes(query);
        if (titleMatch) score += 10;
        if (keywordMatch) score += 5;
        if (contentMatch) score += 3;

        // Find matching excerpt from content
        let excerpt = "";
        if (contentMatch) {
          const contentLower = page.content.toLowerCase();
          const matchIndex = contentLower.indexOf(query);
          const start = Math.max(0, matchIndex - 20);
          const end = Math.min(page.content.length, matchIndex + query.length + 40);
          excerpt = (start > 0 ? "..." : "") + page.content.slice(start, end) + (end < page.content.length ? "..." : "");
        }
        return {
          ...page,
          score,
          excerpt,
          matched: score > 0
        };
      }).filter(page => page.matched).sort((a, b) => b.score - a.score).slice(0, 6);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  const handleSearchSelect = (path: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(path);
  };

  const handleNavigation = (href: string) => {
    trackNavClick(href);
    
    // Check if it's a hash link for /leistungen page
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const currentPath = window.location.pathname;
      
      // If we're already on the target page, just scroll
      if (currentPath === path || (currentPath === '/leistungen' && path === '/leistungen')) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      
      // Navigate to the page first, then scroll
      navigate(path);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      navigate(href);
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };
  const navItems: NavItem[] = [{
    name: "Startseite",
    href: "/"
  }, {
    name: "Über uns",
    href: "/ueber-uns",
    submenu: [{
      name: "Hintergrund",
      href: "/ueber-uns/hintergrund",
      icon: Users
    }]
  }, {
    name: "Leistungen",
    href: "/leistungen",
submenu: [{
      name: "Digitalisierung",
      href: "/leistungen/digitalisierung",
      icon: Monitor
    }, {
      name: "Websites & Shops",
      href: "/leistungen/websites",
      icon: Globe
    }, {
      name: "Marketing & Social Media",
      href: "/leistungen/marketing",
      icon: Megaphone
    }, {
      name: "KI-Branchenlösungen",
      href: "/leistungen/ki-branchen-loesungen",
      icon: Building2
    }, {
      name: "KI Agenten",
      href: "/leistungen/ki-agenten",
      icon: Bot
    }, {
      name: "SEO & Sichtbarkeit",
      href: "/leistungen/seo",
      icon: Search
    }, {
      name: "Schulungen & Beratung",
      href: "/leistungen/schulung",
      icon: GraduationCap
    }, {
      name: "Wissensmanagement",
      href: "/leistungen/wissensmanagement",
      icon: BookOpen
    }, {
      name: "Self-Order & 24/7 Lösungen",
      href: "/leistungen/chayns-loesungen",
      icon: Smartphone
    }, {
      name: "Schlösser & Roboter",
      href: "/leistungen/chayns-hardware",
      icon: Lock
    }, {
      name: "CRM & ERP Systeme",
      href: "/leistungen/crm-erp",
      icon: Cog
    }, {
      name: "BIM Systeme",
      href: "/leistungen/bim",
      icon: Building2
    }, {
      name: "PIM Systeme",
      href: "/leistungen/pim",
      icon: Package
    }, {
      name: "Förderberatung",
      href: "/leistungen/foerderberatung",
      icon: FileText
    }]
  }, {
    name: "Angebotsgenerator",
    href: "/angebotsgenerator"
  }, {
    name: "Projekte",
    href: "/projekte"
  }, {
    name: "Kontakt",
    href: "/kontakt"
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" role="navigation" aria-label="Hauptnavigation">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Zum Hauptinhalt springen
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md" aria-label="DeutLicht Startseite">
            <img alt="DeutLicht - Klare Vision, Starke Präsenz" src="/lovable-uploads/5f7352e5-870e-4afc-b12d-2e93d61e4f60.png" className="h-14 w-auto rounded-2xl shadow-md object-fill" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8" role="menubar">
            {navItems.map(item => <div key={item.name} className="relative group" role="none">
                {item.submenu ? <div className="flex items-center space-x-1 cursor-pointer" role="menuitem" aria-haspopup="true">
                    <Link to={item.href} onClick={() => trackNavClick(item.href)} className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md">
                      {item.name}
                    </Link>
                    <ChevronDown className="w-4 h-4 text-foreground/60 group-hover:text-accent transition-colors" aria-hidden="true" />
                    
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" role="menu" aria-label={`${item.name} Untermenü`}>
                      <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[220px]">
                        {item.submenu.map(subItem => {
                    const IconComponent = subItem.icon;
                    const isHashLink = subItem.href.includes('#');
                    return isHashLink ? (
                      <button 
                        key={subItem.name} 
                        onClick={() => handleNavigation(subItem.href)} 
                        className="flex items-center gap-3 px-4 py-2 w-full text-left text-foreground/80 hover:text-accent hover:bg-muted transition-colors text-sm focus:outline-none focus-visible:bg-muted focus-visible:text-accent" 
                        role="menuitem"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4 text-accent" aria-hidden="true" />}
                        {subItem.name}
                      </button>
                    ) : (
                      <Link 
                        key={subItem.name} 
                        to={subItem.href} 
                        onClick={() => trackNavClick(subItem.href)} 
                        className="flex items-center gap-3 px-4 py-2 text-foreground/80 hover:text-accent hover:bg-muted transition-colors text-sm focus:outline-none focus-visible:bg-muted focus-visible:text-accent" 
                        role="menuitem"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4 text-accent" aria-hidden="true" />}
                        {subItem.name}
                      </Link>
                    );
                  })}
                      </div>
                    </div>
                  </div> : <Link to={item.href} onClick={() => trackNavClick(item.href)} className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md flex flex-col items-center" role="menuitem">
                    <span>{item.name}</span>
                    {item.badge && item.badgeStyle === 'below' && <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-semibold rounded -mt-0.5 text-primary bg-[#c88a04]">
                        {item.badge}
                      </span>}
                    {item.badge && item.badgeStyle !== 'below' && <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-accent text-accent-foreground animate-pulse ml-2">
                        {item.badge}
                      </span>}
                  </Link>}
              </div>)}
          </div>

          {/* CTA Buttons, Accessibility, Search & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search Button */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-foreground/80 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md" aria-label="Suche öffnen">
              <Search className="w-5 h-5" />
            </button>
            <AccessibilityWidget />
            <ThemeToggle />
            {/* KI-Check Button */}
            <Link 
              to="/ki-check" 
              onClick={() => trackCTAClick("KI-Check", "navigation")} 
              className="relative px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 border border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <span>KI-Check</span>
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[9px] font-bold rounded bg-accent text-accent-foreground">
                kostenlos
              </span>
            </Link>
            {/* Beratung anfragen Button */}
            <Link to="/kontakt" onClick={() => trackCTAClick("Beratung anfragen", "navigation")} className="text-accent-foreground px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 bg-accent">
              Beratung anfragen
            </Link>
          </div>

          {/* Search Overlay */}
          {searchOpen && <div className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border shadow-lg z-50">
              <div className="max-w-2xl mx-auto p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Website durchsuchen..." className="w-full pl-12 pr-12 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                  <button onClick={closeSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Suche schließen">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {searchResults.length > 0 && <div className="mt-3 space-y-1">
                    {searchResults.map(result => <button key={result.path} onClick={() => handleSearchSelect(result.path)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <Search className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-foreground font-medium">{result.title}</span>
                        </div>
                        {result.excerpt && <p className="text-sm text-muted-foreground mt-1 ml-7 line-clamp-1">
                            {result.excerpt}
                          </p>}
                      </button>)}
                  </div>}
                
                {searchQuery && searchResults.length === 0 && <p className="mt-3 text-center text-muted-foreground py-4">
                    Keine Ergebnisse für "{searchQuery}"
                  </p>}
              </div>
            </div>}

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md" aria-label={isOpen ? "Menü schließen" : "Menü öffnen"} aria-expanded={isOpen} aria-controls="mobile-menu">
            {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={cn("lg:hidden bg-background border-t border-border transition-all duration-300", isOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0 overflow-hidden")} role="menu" aria-label="Mobile Navigation">
        <div className="px-4 py-4 space-y-2">
          {navItems.map(item => <div key={item.name}>
              {item.submenu ? <div>
                  <button onClick={() => {
              if (item.name === "Über uns") {
                setUeberUnsOpen(!ueberUnsOpen);
              } else if (item.name === "Leistungen") {
                setLeistungenOpen(!leistungenOpen);
              }
            }} className="flex items-center justify-between w-full py-2 text-foreground/80">
                    <span>{item.name}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", (item.name === "Über uns" ? ueberUnsOpen : leistungenOpen) && "rotate-180")} />
                  </button>
                  <div className={cn("pl-4 space-y-1 overflow-hidden transition-all", (item.name === "Über uns" ? ueberUnsOpen : leistungenOpen) ? "max-h-[400px]" : "max-h-0")}>
                    {item.submenu.map(subItem => {
                const IconComponent = subItem.icon;
                const isHashLink = subItem.href.includes('#');
                return isHashLink ? (
                  <button 
                    key={subItem.name} 
                    onClick={() => {
                      handleNavigation(subItem.href);
                      setIsOpen(false);
                    }} 
                    className="flex items-center gap-3 py-2 w-full text-left text-foreground/60 hover:text-accent text-sm"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 text-accent" />}
                    {subItem.name}
                  </button>
                ) : (
                  <Link 
                    key={subItem.name} 
                    to={subItem.href} 
                    onClick={() => {
                      trackNavClick(subItem.href);
                      setIsOpen(false);
                    }} 
                    className="flex items-center gap-3 py-2 text-foreground/60 hover:text-accent text-sm"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 text-accent" />}
                    {subItem.name}
                  </Link>
                );
              })}
                  </div>
                </div> : <Link to={item.href} onClick={() => {
            trackNavClick(item.href);
            setIsOpen(false);
          }} className="block py-2 text-foreground/80 hover:text-accent">
                  <span className="flex flex-col items-start gap-1">
                    <span>{item.name}</span>
                    {item.badge && <span className={cn("inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded", item.badgeStyle === 'below' ? "bg-accent text-accent-foreground" : "bg-accent text-accent-foreground animate-pulse rounded-full")}>
                        {item.badge}
                      </span>}
                  </span>
                </Link>}
            </div>)}
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AccessibilityWidget />
                <ThemeToggle />
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/ki-check" onClick={() => {
                trackCTAClick("KI-Check", "mobile_navigation");
                setIsOpen(false);
              }} className="relative flex-1 text-center border border-accent text-accent py-3 rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>KI-Check</span>
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 text-[8px] font-bold rounded bg-accent text-accent-foreground">
                  kostenlos
                </span>
              </Link>
              <Link to="/kontakt" onClick={() => {
                trackCTAClick("Beratung anfragen", "mobile_navigation");
                setIsOpen(false);
              }} className="flex-1 text-center bg-accent text-accent-foreground py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                Beratung anfragen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navigation;