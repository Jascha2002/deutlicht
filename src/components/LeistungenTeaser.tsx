import { Link } from "react-router-dom";
import { Monitor, Cog, TrendingUp, Megaphone, ArrowRight } from "lucide-react";
const leistungen = [{
  icon: Monitor,
  title: "Digitalisierung",
  description: "Strategische Planung und Umsetzung digitaler Transformationsprozesse für Ihr Unternehmen.",
  href: "/leistungen#digitalisierung"
}, {
  icon: Cog,
  title: "CRM & ERP Systeme",
  description: "Einführung und Optimierung von Kundenmanagement- und Unternehmenssoftware.",
  href: "/leistungen#crm-erp"
}, {
  icon: TrendingUp,
  title: "Webentwicklung",
  description: "Professionelle Websites und Shopsysteme, die messbare Ergebnisse liefern.",
  href: "/leistungen#web"
}, {
  icon: Megaphone,
  title: "Marketing & Social Media",
  description: "Nachhaltige Strategien für Ihre digitale Präsenz und Reichweite.",
  href: "/leistungen#marketing"
}];
const LeistungenTeaser = () => {
  return <section className="bg-muted/30 mx-0 my-0 px-0 py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-medium uppercase tracking-widest text-xl text-[#c88a04]">
            Unsere Leistungen
          </span>
          <h2 className="font-display text-3xl font-bold text-foreground mt-4 sm:text-5xl">
            Ganzheitliche Lösungen für Ihre
            <br />
            <span className="text-[#c88a04]">digitale Zukunft</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Von der strategischen Analyse bis zur erfolgreichen Umsetzung – 
            wir begleiten Sie auf dem gesamten Weg.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leistungen.map(leistung => <Link key={leistung.title} to={leistung.href} className="group border border-border rounded-2xl p-6 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 bg-secondary">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <leistung.icon className="w-7 h-7 text-[#c88a04]" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-[#c88a04]">
                {leistung.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4 text-[#c88a04]">
                {leistung.description}
              </p>
              <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>)}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 space-y-4 bg-cyan-800 py-[30px] px-[8px] mx-0">
          <Link to="/leistungen" className="inline-flex items-center gap-2 font-medium transition-colors text-[#c88a04]">
            Alle Leistungen ansehen
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="pt-6">
            <Link to="/projektanfrage" className="inline-flex items-center gap-2 text-accent-foreground px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-[#c88a04]">
              Projektanfrage starten – Bedarf klären
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default LeistungenTeaser;