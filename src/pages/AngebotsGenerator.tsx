import { Helmet } from "react-helmet-async";
import { AngebotsGenerator } from "@/components/AngebotsGenerator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedLogo from "@/components/AnimatedLogo";
import { FileText } from "lucide-react";
import heroProjektanfrage from "@/assets/hero-projektanfrage.jpg";

const AngebotsGeneratorPage = () => {
  return <>
      <Helmet>
        <title>Angebotsgenerator | DeutLicht - Ihr persönliches Angebot in 5 Minuten</title>
        <meta name="description" content="Der DeutLicht Angebotsgenerator: In wenigen Minuten zu Ihrem persönlichen Angebot. Kostenlos und unverbindlich." />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-secondary">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-12">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroProjektanfrage} 
              alt="Projektanfrage Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-secondary" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <AnimatedLogo size="lg" className="mb-8" />
              
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground border border-accent/30 text-sm font-medium mb-6">
                <FileText className="w-4 h-4" />
                Kostenlos & Unverbindlich
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Angebotsgenerator
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                In wenigen Minuten zu Ihrem persönlichen Angebot
              </p>
            </div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 pb-16">
          <AngebotsGenerator />
        </div>
      </main>
      
      <Footer />
    </>;
};
export default AngebotsGeneratorPage;