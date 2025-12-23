import { Link } from "react-router-dom";
import { Monitor, Cog, TrendingUp, Megaphone, ArrowRight } from "lucide-react";

const leistungen = [
  {
    icon: Monitor,
    title: "Digitalisierung",
    description:
      "Strategische Planung und Umsetzung digitaler Transformationsprozesse für Ihr Unternehmen.",
    href: "/leistungen#digitalisierung",
  },
  {
    icon: Cog,
    title: "CRM & ERP Systeme",
    description:
      "Einführung und Optimierung von Kundenmanagement- und Unternehmenssoftware.",
    href: "/leistungen#crm-erp",
  },
  {
    icon: TrendingUp,
    title: "Webentwicklung",
    description:
      "Professionelle Websites und Shopsysteme, die messbare Ergebnisse liefern.",
    href: "/leistungen#web",
  },
  {
    icon: Megaphone,
    title: "Marketing & Social Media",
    description:
      "Nachhaltige Strategien für Ihre digitale Präsenz und Reichweite.",
    href: "/leistungen#marketing",
  },
];

const LeistungenTeaser = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-medium uppercase tracking-widest text-sm">
            Unsere Leistungen
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-4">
            Ganzheitliche Lösungen für Ihre
            <br />
            <span className="text-accent">digitale Zukunft</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Von der strategischen Analyse bis zur erfolgreichen Umsetzung – 
            wir begleiten Sie auf dem gesamten Weg.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leistungen.map((leistung) => (
            <Link
              key={leistung.title}
              to={leistung.href}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <leistung.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {leistung.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {leistung.description}
              </p>
              <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/leistungen"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Alle Leistungen ansehen
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeistungenTeaser;
