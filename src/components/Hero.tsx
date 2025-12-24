import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
      {/* Background Video */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover contrast-110 saturate-110"
          style={{ objectPosition: 'center 0%' }}
          aria-hidden="true"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center space-y-8 bg-background/50 dark:bg-background/30 backdrop-blur-sm rounded-3xl p-8 md:p-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm text-accent font-medium">
              Digitalisierung mit Klarheit
            </span>
          </div>

          {/* Headline */}
          <h1 id="hero-heading" className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Von der Idee zur
            <br />
            <span className="text-accent">intelligenten Lösung</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Wir begleiten Ihr Unternehmen durch die digitale Transformation – 
            mit Strategie, Erfahrung und maßgeschneiderten Lösungen.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4" role="group" aria-label="Handlungsoptionen">
            <Link
              to="/kontakt"
              onClick={() => trackCTAClick("Kostenlose Beratung", "hero")}
              className="group flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Kostenlose Beratung
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              to="/schnelluebersicht"
              onClick={() => trackCTAClick("Schnellübersicht lesen", "hero")}
              className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-accent px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Schnellübersicht lesen
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              to="/ueber-uns/hintergrund"
              onClick={() => trackCTAClick("Mehr erfahren", "hero")}
              className="group flex items-center gap-2 bg-card/50 hover:bg-card border border-border text-foreground px-8 py-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Play className="w-5 h-5 text-accent" aria-hidden="true" />
              Mehr erfahren
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 border-t border-border/50 mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-accent">30+</div>
                <div className="text-sm text-muted-foreground">Jahre Erfahrung</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-accent">25+</div>
                <div className="text-sm text-muted-foreground">Jahre Digitalisierung</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">Individuelle Lösungen</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-accent">KMU</div>
                <div className="text-sm text-muted-foreground">Fokus</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" aria-hidden="true">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">Mehr entdecken</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-accent rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
