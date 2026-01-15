import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KIReadinessCheck from "@/components/KIReadinessCheck";
import AnimatedLogo from "@/components/AnimatedLogo";
import { Brain } from "lucide-react";
import heroKiCheck from "@/assets/hero-ki-check.jpg";

const KICheck = () => {
  return (
    <>
      <Helmet>
        <title>KI-Readiness-Check | Deutlicht</title>
        <meta
          name="description"
          content="Kostenloser KI-Readiness-Check: Analysieren Sie in 3 Minuten, wie bereit Ihr Unternehmen für KI-Lösungen ist und erhalten Sie konkrete Handlungsempfehlungen."
        />
      </Helmet>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroKiCheck} 
              alt="KI-Check Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <AnimatedLogo size="lg" className="mb-8" />
              
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground border border-accent/30 text-sm font-medium mb-6">
                <Brain className="w-4 h-4" />
                Kostenlose Analyse
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                KI-Readiness-Check
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Analysieren Sie in 3 Minuten, wie bereit Ihr Unternehmen für KI-Lösungen ist
              </p>
            </div>
          </div>
        </section>
        
        <KIReadinessCheck />
      </main>
      <Footer />
    </>
  );
};

export default KICheck;
