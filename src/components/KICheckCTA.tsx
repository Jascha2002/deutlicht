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
  return <section className="w-full py-16 md:py-24 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/20 bg-secondary-foreground opacity-85">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[hsl(210,80%,97%)] to-[hsl(230,70%,95%)] dark:from-[hsl(220,50%,15%)] dark:to-[hsl(240,40%,20%)] rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12">
            {/* Left: Text + Button */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Noch unsicher, welche KI-Lösung Sie brauchen?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Unser kostenloser KI-Readiness-Check analysiert Ihr Unternehmen in 3 Minuten und gibt konkrete Empfehlungen.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>10 gezielte Fragen</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Individuelle Auswertung</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Konkrete Handlungsempfehlungen</span>
                </li>
              </ul>

              <div className="pt-2">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/ki-check" onClick={handleCTAClick}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Jetzt kostenlos testen
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Visual Element */}
            <div className="flex items-center justify-center relative">
              <div className="relative w-full max-w-sm">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-2xl" />
                
                {/* Icon Grid */}
                <div className="relative grid grid-cols-2 gap-4 p-6">
                  {/* Top Left */}
                  <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{
                  animationDelay: "0.1s"
                }}>
                    <Brain className="h-10 w-10 text-accent mb-3" />
                    <p className="text-sm font-medium text-foreground">KI-Potenzial</p>
                    <p className="text-xs text-muted-foreground">erkennen</p>
                  </div>
                  
                  {/* Top Right */}
                  <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{
                  animationDelay: "0.2s"
                }}>
                    <TrendingUp className="h-10 w-10 text-primary mb-3" />
                    <p className="text-sm font-medium text-foreground">Wachstum</p>
                    <p className="text-xs text-muted-foreground">steigern</p>
                  </div>
                  
                  {/* Bottom Left */}
                  <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{
                  animationDelay: "0.3s"
                }}>
                    <Zap className="h-10 w-10 text-gold mb-3" />
                    <p className="text-sm font-medium text-foreground">Prozesse</p>
                    <p className="text-xs text-muted-foreground">optimieren</p>
                  </div>
                  
                  {/* Bottom Right */}
                  <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{
                  animationDelay: "0.4s"
                }}>
                    <Target className="h-10 w-10 text-accent mb-3" />
                    <p className="text-sm font-medium text-foreground">Strategie</p>
                    <p className="text-xs text-muted-foreground">entwickeln</p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                  Kostenlos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default KICheckCTA;