import { Link } from "react-router-dom";
import { Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

// Import thematic images
import heroKiCheck from "@/assets/hero-ki-check.jpg";
import digitalisierungProzesse from "@/assets/digitalisierung-prozesse.jpg";
import leistungKiAgenten from "@/assets/leistung-ki-agenten.jpg";
import heroLeistungen from "@/assets/hero-leistungen.jpg";

const focusAreas = [
  {
    title: "Potenzial",
    subtitle: "erkennen",
    image: heroKiCheck,
  },
  {
    title: "Wachstum",
    subtitle: "steigern",
    image: leistungKiAgenten,
  },
  {
    title: "Prozesse",
    subtitle: "optimieren",
    image: digitalisierungProzesse,
  },
  {
    title: "Strategie",
    subtitle: "entwickeln",
    image: heroLeistungen,
  },
];

const KICheckCTA = () => {
  const handleCTAClick = () => {
    trackEvent("ki_check_cta_click", {
      location: "homepage_ki_check"
    });
  };

  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/20 bg-background px-4 sm:px-6">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[hsl(210,80%,97%)] to-[hsl(230,70%,95%)] dark:from-[hsl(220,50%,15%)] dark:to-[hsl(240,40%,20%)] rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col items-center text-center p-6 sm:p-8 md:p-12 bg-secondary">
            {/* Header */}
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Noch unsicher, welche KI-Lösung Sie brauchen?
              </h2>
              <p className="text-lg text-muted-foreground">
                Unser kostenloser KI-Readiness-Check analysiert Ihr Unternehmen in 3 Minuten und gibt konkrete Empfehlungen.
              </p>
            </div>

            {/* Benefits List */}
            <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-x-8 sm:gap-y-3 mt-6">
              <li className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                <span>10 gezielte Fragen</span>
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                <span>Individuelle Auswertung</span>
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                <span>Konkrete Handlungsempfehlungen</span>
              </li>
            </ul>

            {/* CTA Button */}
            <div className="mt-8">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/ki-check" onClick={handleCTAClick}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Jetzt kostenlos testen
                </Link>
              </Button>
            </div>

            {/* Focus Areas Grid with Images */}
            <div className="relative mt-10 w-full max-w-lg">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-2xl" />
              
              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {focusAreas.map((area, index) => (
                  <div
                    key={area.title}
                    className="group backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background/80"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative h-16 sm:h-20 w-full overflow-hidden">
                      <img
                        src={area.image}
                        alt={`${area.title} ${area.subtitle}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    
                    {/* Text */}
                    <div className="p-2 sm:p-3 text-center">
                      <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
                        {area.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {area.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KICheckCTA;