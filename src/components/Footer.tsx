import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, FileText, ArrowRight } from "lucide-react";
const Footer = () => {
  return (
    <footer role="contentinfo" aria-label="Fußzeile" className="border-t bg-inherit">
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr] gap-8 lg:gap-12">
          {/* Brand - Breitere Spalte */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display font-bold text-4xl lg:text-5xl text-inherit">
                DeutLicht<span className="text-accent">®</span>
              </span>
            </Link>
            <p className="leading-relaxed text-base font-light max-w-md text-inherit">
              Ihr Partner für die digitale Zukunft. Mehr als 30 Jahre Erfahrung im Management und über 25 Jahre im
              Bereich Digitalisierung.
            </p>
            <p className="leading-relaxed text-xs mt-3 max-w-md text-inherit">
              Die Marke DeutLicht® ist eine eingetragene bzw. angemeldete Marke der Stadtnetz UG (haftungsbeschränkt).
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer Navigation">
            <h4 className="font-display font-semibold mb-4 text-inherit">Navigation</h4>
            <ul className="space-y-3" role="list">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Startseite
                </Link>
              </li>
              <li>
                <Link to="/ueber-uns" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/leistungen" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Leistungen
                </Link>
              </li>
              <li>
                <Link to="/projekte" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Projekte
                </Link>
              </li>
              <li>
                <Link
                  to="/ki-check"
                  className="transition-colors text-sm px-2 py-0.5 bg-accent text-accent-foreground font-bold rounded"
                >
                  KI-Check
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen/ki-branchen-loesungen"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  KI-Branchenlösungen
                </Link>
              </li>
              <li>
                <Link
                  to="/projektanfrage"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Projektanfrage
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Kontakt
                </Link>
              </li>
            </ul>
          </nav>

          {/* Leistungen */}
          <nav aria-label="Leistungen Navigation">
            <h4 className="font-display font-semibold mb-4 text-inherit">Leistungen</h4>
            <ul className="space-y-3" role="list">
              <li>
                <Link
                  to="/leistungen/ki-agenten"
                  className="transition-colors text-sm bg-accent text-accent-foreground font-bold px-2 py-0.5 rounded"
                >
                  KI-Agenten
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen/digitalisierung"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Digitalisierung
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen/websites"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Websites & Shops
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen/marketing"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Marketing & Social Media
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen/seo"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  SEO & Sichtbarkeit
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen/ki-branchen-loesungen"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  KI-Branchenlösungen
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen/schulung"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  Schulungen & Beratung
                </Link>
              </li>
              <li>
                <Link
                  to="/leistungen/crm-erp"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  CRM & ERP Systeme
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kontakt */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-inherit">Kontakt</h4>
            <ul className="space-y-3" role="list">
              <li>
                <a
                  href="mailto:info@deutlicht.de"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  info@deutlicht.de
                </a>
              </li>
              <li>
                <a
                  href="tel:+491785549216"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +49 178 55 49 216
                </a>
              </li>
              <li>
                <div className="text-muted-foreground text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Stadtnetz UG (haftungsbeschränkt)
                    <br />
                    Gemeindeweg 4 (Mäuseturm)
                    <br />
                    07546 Gera (Deutschland)
                  </span>
                </div>
              </li>
            </ul>

            {/* Quick CTA */}
            <div className="mt-6 pt-4 border-t border-border">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium text-sm"
              >
                Projekt anfragen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} DeutLicht® – Alle Rechte vorbehalten
            </p>
            <nav aria-label="Rechtliche Links" className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/impressum" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Impressum
              </Link>
              <Link to="/datenschutz" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Datenschutz
              </Link>
              <Link
                to="/datenschutz#barrierefreiheit"
                className="text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                Barrierefreiheit
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
