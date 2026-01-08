import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import KICheckCTA from "@/components/KICheckCTA";
import LeistungenTeaser from "@/components/LeistungenTeaser";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <>
      <Helmet>
        <title>DeutLicht® – Digitalisierung mit Klarheit | Ihr Partner für die digitale Zukunft</title>
        <meta
          name="description"
          content="DeutLicht® begleitet Ihr Unternehmen durch die digitale Transformation. Über 30 Jahre Erfahrung in Digitalisierung, CRM, Webentwicklung und Marketing."
        />
        <meta
          name="keywords"
          content="Digitalisierung, CRM, ERP, Webentwicklung, Marketing, KMU, Beratung, Förderung"
        />
        <link rel="canonical" href="https://deutlicht.de" />
      </Helmet>

      <Navigation />
      
      <main id="main-content">
        <Hero />
        <KICheckCTA />
        <LeistungenTeaser />
      </main>

      <Footer />
    </>
  );
};

export default Index;
