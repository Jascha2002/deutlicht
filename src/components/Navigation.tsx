import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Monitor, 
  Cog, 
  Building2, 
  Package, 
  BookOpen, 
  Smartphone, 
  Globe, 
  Megaphone, 
  FileText,
  Users,
  Lock,
  Bot,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackNavClick, trackCTAClick } from "@/lib/analytics";
import { ThemeToggle } from "@/components/ThemeToggle";
import deutlichtLogo from "@/assets/deutlicht-logo-icon.png";

interface SubMenuItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}

interface NavItem {
  name: string;
  href: string;
  submenu?: SubMenuItem[];
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ueberUnsOpen, setUeberUnsOpen] = useState(false);
  const [leistungenOpen, setLeistungenOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: "Startseite", href: "/" },
    {
      name: "Über uns",
      href: "/ueber-uns",
      submenu: [
        { name: "Hintergrund", href: "/ueber-uns/hintergrund", icon: Users },
      ],
    },
    { 
      name: "Leistungen", 
      href: "/leistungen",
      submenu: [
        { name: "Digitalisierung", href: "/leistungen#digitalisierung", icon: Monitor },
        { name: "CRM & ERP Systeme", href: "/leistungen#crm-erp", icon: Cog },
        { name: "BIM Systeme", href: "/leistungen#bim", icon: Building2 },
        { name: "PIM Systeme", href: "/leistungen#pim", icon: Package },
        { name: "Wissensmanagement", href: "/leistungen#wissensmanagement", icon: BookOpen },
        { name: "Self-Order & 24/7", href: "/leistungen/chayns-loesungen", icon: Smartphone },
        { name: "Schlösser & Roboter", href: "/leistungen/chayns-hardware", icon: Lock },
        { name: "Websites & Shops", href: "/leistungen#web", icon: Globe },
        { name: "Marketing & Social Media", href: "/leistungen#marketing", icon: Megaphone },
        { name: "Förderberatung", href: "/leistungen#foerderung", icon: FileText },
      ],
    },
    { name: "Projekte", href: "/projekte" },
    { name: "Medien", href: "/medien" },
    { name: "Kontakt", href: "/kontakt" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" role="navigation" aria-label="Hauptnavigation">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Zum Hauptinhalt springen
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md" aria-label="DeutLicht Startseite">
            <img 
              src={deutlichtLogo} 
              alt="DeutLicht - Klare Vision, Starke Präsenz" 
              className="h-24 w-auto contrast-105 drop-shadow-sm"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8" role="menubar">
            {navItems.map((item) => (
              <div key={item.name} className="relative group" role="none">
                {item.submenu ? (
                  <div className="flex items-center space-x-1 cursor-pointer" role="menuitem" aria-haspopup="true">
                    <Link
                      to={item.href}
                      onClick={() => trackNavClick(item.href)}
                      className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md"
                    >
                      {item.name}
                    </Link>
                    <ChevronDown className="w-4 h-4 text-foreground/60 group-hover:text-accent transition-colors" aria-hidden="true" />
                    
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" role="menu" aria-label={`${item.name} Untermenü`}>
                      <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[220px]">
                        {item.submenu.map((subItem) => {
                          const IconComponent = subItem.icon;
                          return (
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
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => trackNavClick(item.href)}
                    className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md"
                    role="menuitem"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/kontakt"
              onClick={() => trackCTAClick("Beratung anfragen", "navigation")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Beratung anfragen
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md"
            aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden bg-background border-t border-border transition-all duration-300",
          isOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0 overflow-hidden"
        )}
        role="menu"
        aria-label="Mobile Navigation"
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => {
                      if (item.name === "Über uns") {
                        setUeberUnsOpen(!ueberUnsOpen);
                      } else if (item.name === "Leistungen") {
                        setLeistungenOpen(!leistungenOpen);
                      }
                    }}
                    className="flex items-center justify-between w-full py-2 text-foreground/80"
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        (item.name === "Über uns" ? ueberUnsOpen : leistungenOpen) && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "pl-4 space-y-1 overflow-hidden transition-all",
                      (item.name === "Über uns" ? ueberUnsOpen : leistungenOpen) ? "max-h-[400px]" : "max-h-0"
                    )}
                  >
                    {item.submenu.map((subItem) => {
                      const IconComponent = subItem.icon;
                      return (
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
                </div>
              ) : (
                <Link
                  to={item.href}
                  onClick={() => {
                    trackNavClick(item.href);
                    setIsOpen(false);
                  }}
                  className="block py-2 text-foreground/80 hover:text-accent"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between mt-4 gap-3">
            <ThemeToggle />
            <Link
              to="/kontakt"
              onClick={() => {
                trackCTAClick("Beratung anfragen", "mobile_navigation");
                setIsOpen(false);
              }}
              className="flex-1 text-center bg-accent text-accent-foreground py-3 rounded-lg font-medium"
            >
              Beratung anfragen
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
