import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackNavClick, trackCTAClick } from "@/lib/analytics";
import deutlichtLogo from "@/assets/deutlicht-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ueberUnsOpen, setUeberUnsOpen] = useState(false);

  const navItems = [
    { name: "Startseite", href: "/" },
    {
      name: "Über uns",
      href: "/ueber-uns",
      submenu: [
        { name: "Hintergrund", href: "/ueber-uns/hintergrund" },
      ],
    },
    { name: "Leistungen", href: "/leistungen" },
    { name: "Projekte", href: "/projekte" },
    { name: "Medien", href: "/medien" },
    { name: "Kontakt", href: "/kontakt" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={deutlichtLogo} 
              alt="DeutLicht - Klare Vision, Starke Präsenz" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <Link
                      to={item.href}
                      onClick={() => trackNavClick(item.href)}
                      className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium"
                    >
                      {item.name}
                    </Link>
                    <ChevronDown className="w-4 h-4 text-foreground/60 group-hover:text-accent transition-colors" />
                    
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => trackNavClick(subItem.href)}
                            className="block px-4 py-2 text-foreground/80 hover:text-accent hover:bg-muted transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => trackNavClick(item.href)}
                    className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              to="/kontakt"
              onClick={() => trackCTAClick("Beratung anfragen", "navigation")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
            >
              Beratung anfragen
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden bg-background border-t border-border overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => setUeberUnsOpen(!ueberUnsOpen)}
                    className="flex items-center justify-between w-full py-2 text-foreground/80"
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        ueberUnsOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "pl-4 space-y-2 overflow-hidden transition-all",
                      ueberUnsOpen ? "max-h-40" : "max-h-0"
                    )}
                  >
                      {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        onClick={() => {
                          trackNavClick(subItem.href);
                          setIsOpen(false);
                        }}
                        className="block py-2 text-foreground/60 hover:text-accent"
                      >
                        {subItem.name}
                      </Link>
                    ))}
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
          <Link
            to="/kontakt"
            onClick={() => {
              trackCTAClick("Beratung anfragen", "mobile_navigation");
              setIsOpen(false);
            }}
            className="block w-full text-center bg-accent text-accent-foreground py-3 rounded-lg font-medium mt-4"
          >
            Beratung anfragen
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
