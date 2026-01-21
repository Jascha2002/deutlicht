import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, CheckCircle, Brain, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
const KICheckCTA = () => {
  const handleCTAClick = () => {
    trackEvent("ki_check_cta_click", {
      location: "homepage_ki_check"
    });
  };
  return <section className="w-full py-16 md:py-20 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/20 bg-background px-[28px]">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[hsl(210,80%,97%)] to-[hsl(230,70%,95%)] dark:from-[hsl(220,50%,15%)] dark:to-[hsl(240,40%,20%)] rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col items-center text-center p-8 md:p-12 bg-secondary">
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
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-6">
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
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/ki-check" onClick={handleCTAClick}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Jetzt kostenlos testen
                </Link>
              </Button>
            </div>

            {/* Icon Grid */}
            <div className="relative mt-10 w-full max-w-md">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-2xl" />
              
              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background/50" style={{
                animationDelay: "0.1s"
              }}>
                  <Brain className="h-8 w-8 md:h-10 md:w-10 mb-2 text-accent mx-auto" />
                  <p className="text-sm font-medium text-foreground">KI-Potenzial</p>
                  <p className="text-xs text-muted-foreground">erkennen</p>
                </div>
                
                <div className="backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background/50" style={{
                animationDelay: "0.2s"
              }}>
                  <TrendingUp className="h-8 w-8 md:h-10 md:w-10 mb-2 text-accent mx-auto" />
                  <p className="text-sm font-medium text-foreground">Wachstum</p>
                  <p className="text-xs text-muted-foreground">steigern</p>
                </div>
                
                <div className="backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background/50" style={{
                animationDelay: "0.3s"
              }}>
                  <Zap className="h-8 w-8 md:h-10 md:w-10 mb-2 text-accent mx-auto" />
                  <p className="text-sm font-medium text-foreground">Prozesse</p>
                  <p className="text-xs text-muted-foreground">optimieren</p>
                </div>
                
                <div className="backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background/50" style={{
                animationDelay: "0.4s"
              }}>
                  <Target className="h-8 w-8 md:h-10 md:w-10 mb-2 text-accent mx-auto" />
                  <p className="text-sm font-medium text-foreground">Strategie</p>
                  <p className="text-xs text-muted-foreground">entwickeln</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg animate-pulse bg-accent">
                Kostenlos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default KICheckCTA;