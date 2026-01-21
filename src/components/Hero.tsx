import { Link } from "react-router-dom";
import { ArrowRight, Play, Zap } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
import BranchenSelectorButton from "@/components/BranchenSelectorButton";
import AnimatedLogo from "@/components/AnimatedLogo";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
      {/* Background Video */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover contrast-110 saturate-110" style={{
        objectPosition: 'center 0%'
      }} aria-hidden="true">
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background border-dashed rounded-sm opacity-40 bg-[#19242e] py-px" />
      </div>

      {/* Branchen-Selector Button */}
      <BranchenSelectorButton />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 md:pt-40 py-[97px] lg:px-[131px]">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-solid border-accent opacity-100 bg-inherit">
          
          {/* Logo on the left - double size, no loop */}
          <div className="flex-shrink-0">
            <AnimatedLogo size="xl" loop={false} />
          </div>
          
          {/* Text content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-accent/30 rounded-full px-4 py-2 bg-primary text-primary-foreground">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                Digitalisierung mit Klarheit
              </span>
            </div>

            {/* Headline */}
            <h1 id="hero-heading" className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-black/[0.41] text-primary-foreground py-[40px] text-justify px-[64px]">
              Von der Idee zur
              <br />
              <span className="text-[#c88a04] text-7xl bg-transparent">intelligenten Lösung</span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl text-lg leading-relaxed sm:text-2xl font-semibold bg-[#c88a04]/[0.01] text-primary-foreground">
              Wir begleiten Ihr Unternehmen durch die digitale Transformation – 
              mit Strategie, Erfahrung und maßgeschneiderten Lösungen.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-4" role="group" aria-label="Handlungsoptionen">
              <Link to="/projektanfrage" onClick={() => trackCTAClick("Jetzt Projektanfrage starten", "hero")} className="group flex items-center gap-2 text-accent-foreground px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 bg-[#c88a04]">
                Jetzt Projektanfrage starten
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <Link to="/leistungen" onClick={() => trackCTAClick("Mehr erfahren", "hero")} className="group flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-[#c88a04] bg-primary-foreground">
                Mehr erfahren
                <ArrowRight aria-hidden="true" className="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary bg-inherit" />
              </Link>
              <Link to="/kontakt" onClick={() => trackCTAClick("Kostenlose Beratung", "hero")} className="group flex items-center gap-2 bg-card/50 hover:bg-card border border-border text-foreground px-8 py-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
                <Play aria-hidden="true" className="w-5 h-5 text-[#c88a04]" />
                Kostenlose Beratung
              </Link>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="pt-12 border-t mt-12 opacity-100 border-transparent bg-transparent text-black">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mx-0 py-0 px-0 my-[2px] bg-[#f3f5f7]/55">
            <div className="text-center">
              <div className="font-display text-5xl font-bold opacity-100 shadow-none text-inherit">30+</div>
              <div className="font-display text-xl font-bold text-inherit">Jahre Erfahrung</div>
            </div>
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-inherit">25+</div>
              <div className="font-display text-xl font-bold text-inherit">Jahre Digitalisierung</div>
            </div>
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-inherit">100%</div>
              <div className="font-display text-xl font-bold text-inherit">Individuelle Lösungen</div>
            </div>
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-inherit">KMU</div>
              <div className="font-display text-xl font-bold text-inherit">Fokus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      
    </section>;
};
export default Hero;