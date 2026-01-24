import { Link } from "react-router-dom";
import { Monitor, Cog, TrendingUp, Megaphone, ArrowRight } from "lucide-react";

// Import service images from Leistungen page
import heroLeistungen from "@/assets/hero-leistungen.jpg";
import leistungCrmErp from "@/assets/crm-erp-dashboard.jpg";
import leistungWebsites from "@/assets/leistung-websites-new.jpg";
import leistungMarketing from "@/assets/leistung-marketing-new.jpg";

const leistungen = [{
  icon: Monitor,
  title: "Digitalisierung",
  description: "Strategische Planung und Umsetzung digitaler Transformationsprozesse für Ihr Unternehmen.",
  href: "/leistungen/digitalisierung",
  image: heroLeistungen
}, {
  icon: Cog,
  title: "CRM & ERP Systeme",
  description: "Einführung und Optimierung von Kundenmanagement- und Unternehmenssoftware.",
  href: "/leistungen/crm-erp",
  image: leistungCrmErp
}, {
  icon: TrendingUp,
  title: "Webentwicklung",
  description: "Professionelle Websites und Shopsysteme, die messbare Ergebnisse liefern.",
  href: "/leistungen/websites",
  image: leistungWebsites
}, {
  icon: Megaphone,
  title: "Marketing & Social Media",
  description: "Nachhaltige Strategien für Ihre digitale Präsenz und Reichweite.",
  href: "/leistungen/marketing",
  image: leistungMarketing
}];

const LeistungenTeaser = () => {
  return (
    <section className="bg-muted/30 mx-0 my-0 px-0 py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 px-0 my-[29px]">
          <span className="font-medium uppercase tracking-widest text-xl text-accent">
            Unsere Leistungen
          </span>
          <h2 className="font-display text-3xl font-bold text-foreground mt-4 sm:text-5xl">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-0 py-0 my-0 mx-0">
          {leistungen.map(leistung => (
            <Link 
              key={leistung.title} 
              to={leistung.href} 
              className="group border border-border rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 bg-primary"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={leistung.image} 
                  alt={leistung.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div className="w-10 h-10 bg-accent/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <leistung.icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold mb-3 text-accent">
                  {leistung.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4 text-primary-foreground">
                  {leistung.description}
                </p>
                <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                  Mehr erfahren
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 space-y-4 my-[47px] px-0 py-[15px] mx-0 bg-inherit">
          <Link to="/leistungen" className="inline-flex items-center gap-2 font-medium transition-colors text-accent">
            Alle Leistungen ansehen
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="pt-6">
            <Link to="/projektanfrage" className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-accent hover:bg-accent/90">
              Bedarf klären
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeistungenTeaser;