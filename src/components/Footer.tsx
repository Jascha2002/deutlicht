import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, FileText, ArrowRight } from "lucide-react";
const Footer = () => {
  return <footer role="contentinfo" aria-label="Fußzeile" className="border-t bg-inherit my-0 opacity-100 mx-0 px-0 border-inherit py-0">
      <div className="max-w-7xl px-4 sm:px-6 py-0 bg-inherit lg:px-0 my-[7px] mx-[13px]">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 opacity-100 mx-0 px-0">
          {/* Brand */}
          <div className="space-y-4 mx-[7px] px-0 py-0 my-0">
            <Link to="/" className="inline-block">
              <span className="font-display font-bold mx-0 text-5xl px-px text-inherit">
                DeutLicht<span className="text-accent">®</span>
              </span>
            </Link>
            <p className="leading-relaxed text-base font-light text-primary">
              Ihr Partner für die digitale Zukunft. Mehr als 30 Jahre Erfahrung im Management und über 25 Jahre im Bereich Digitalisierung.
            </p>
            <p className="leading-relaxed text-xs mt-3 text-primary">
              Die Marke DeutLicht® ist eine eingetragene bzw. angemeldete Marke der Stadtnetz UG (haftungsbeschränkt).
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer Navigation">
            <h4 className="font-display font-semibold mb-4 px-0 text-inherit">
              Navigation
            </h4>
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
                <Link to="/ki-check" className="transition-colors text-sm px-[9px] text-accent bg-primary">
                  KI-Check
                </Link>
              </li>
              <li>
                <Link to="/leistungen/branchen-loesungen" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Branchen-Lösungen
                </Link>
              </li>
              <li>
                <Link to="/projektanfrage" className="text-muted-foreground hover:text-accent transition-colors text-sm flex items-center gap-1">
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
            <h4 className="font-display font-semibold mb-4 text-inherit px-0">
              Leistungen
            </h4>
            <ul className="space-y-3" role="list">
              <li>
                <Link to="/leistungen/ai-agenten" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  KI / AI-Agenten
                </Link>
              </li>
              <li>
                <Link to="/leistungen/branchen-loesungen" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Branchenlösungen
                </Link>
              </li>
              <li>
                <Link to="/leistungen#digitalisierung" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Digitalisierung
                </Link>
              </li>
              <li>
                <Link to="/leistungen#crm-erp" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  CRM & ERP Systeme
                </Link>
              </li>
              <li>
                <Link to="/leistungen#web" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Webentwicklung
                </Link>
              </li>
              <li>
                <Link to="/leistungen#marketing" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Marketing & Social Media
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Schulungen & Beratung
                </Link>
              </li>
              <li>
                <Link to="/leistungen#marketing" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  SEO-Sichtbarkeit
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kontakt */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-inherit px-0">
              Kontakt
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@DeutLicht.de" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md" aria-label="E-Mail an info@DeutLicht.de senden">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  info@DeutLicht.de
                </a>
              </li>
              <li>
                <a href="tel:+491785549216" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md" aria-label="Telefonnummer +49 178 5549216 anrufen">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  +49 178 5549216
                </a>
              </li>
              <li>
                <address className="flex items-start gap-2 text-muted-foreground text-sm not-italic">
                  <MapPin className="w-4 h-4 mt-0.5" aria-hidden="true" />
                  <span>Gemeindeweg 4, 07546 Gera</span>
                </address>
              </li>
            </ul>
            
            {/* Quick CTA */}
            <div className="mt-6 pt-4 border-t border-border">
              <Link to="/projektanfrage" className="inline-flex items-center gap-2 text-sm font-medium transition-colors bg-[#c88a04] text-primary-foreground px-[13px]">
                Jetzt Projektanfrage starten
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex-col md:flex-row opacity-100 py-0 bg-inherit my-[18px] flex items-center justify-between gap-[20px] border-inherit">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} DeutLicht®. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/projektanfrage" className="text-muted-foreground hover:text-accent transition-colors text-sm">
              Projektanfrage
            </Link>
            <Link to="/impressum" className="text-muted-foreground hover:text-accent transition-colors text-sm">
              Impressum
            </Link>
            <Link to="/datenschutz" className="text-muted-foreground hover:text-accent transition-colors text-sm">
              Datenschutz
            </Link>
            <Link to="/barrierefreiheit" className="text-muted-foreground hover:text-accent transition-colors text-sm">
              Barrierefreiheit
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;