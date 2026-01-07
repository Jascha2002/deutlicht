import { Helmet } from "react-helmet-async";
import { KlarheitsCheck } from "@/components/KlarheitsCheck";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const KlarheitscheckPage = () => {
  return (
    <>
      <Helmet>
        <title>Klarheits-Check | DeutLicht - Digitale Beratung</title>
        <meta 
          name="description" 
          content="Der DeutLicht-Klarheits-Check: In wenigen Minuten zur richtigen digitalen Lösung. Durchblick. DeutLicht." 
        />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <KlarheitsCheck />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default KlarheitscheckPage;
