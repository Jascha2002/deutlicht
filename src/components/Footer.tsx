import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-bold text-foreground">
                DeutLicht<span className="text-accent">®</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ihr Partner für die digitale Zukunft. Mehr als 30 Jahre Erfahrung 
              im Management und über 25 Jahre im Bereich Digitalisierung.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Startseite
                </Link>
              </li>
              <li>
                <Link
                  to="/ueber-uns"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Leistungen
                </Link>
              </li>
              <li>
                <Link
                  to="/projekte"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Projekte
                </Link>
              </li>
              <li>
                <Link
                  to="/kontakt"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Leistungen */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Leistungen
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/leistungen#digitalisierung"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Digitalisierung
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen#crm-erp"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  CRM & ERP Systeme
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen#web"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Webentwicklung
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen#marketing"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Marketing & Social Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Kontakt
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@DeutLicht.de"
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  info@DeutLicht.de
                </a>
              </li>
              <li>
                <a
                  href="tel:+491785549216"
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +49 178 5549216
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Gemeindeweg 4, 07546 Gera</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} DeutLicht®. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/impressum"
              className="text-muted-foreground hover:text-accent transition-colors text-sm"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="text-muted-foreground hover:text-accent transition-colors text-sm"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
