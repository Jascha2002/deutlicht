import { Helmet } from "react-helmet-async";
import { AngebotsGenerator } from "@/components/AngebotsGenerator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const AngebotsGeneratorPage = () => {
  return (
    <>
      <Helmet>
        <title>Angebots-Generator | DeutLicht - Ihr persönliches Angebot in 5 Minuten</title>
        <meta 
          name="description" 
          content="Der DeutLicht Angebots-Generator: In wenigen Minuten zu Ihrem persönlichen Angebot. Kostenlos und unverbindlich." 
        />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AngebotsGenerator />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AngebotsGeneratorPage;