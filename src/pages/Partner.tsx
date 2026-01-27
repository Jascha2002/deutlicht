import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PartnerProgramm } from "@/components/PartnerProgramm";

const Partner = () => {
  return (
    <>
      <Helmet>
        <title>Partner-Programm - Gemeinsam wachsen | DeutLicht</title>
        <meta 
          name="description" 
          content="Werden Sie DeutLicht-Partner: Wiederkehrende Provisionen für Steuerberater, Marketing-Agenturen und Webdesigner. Jetzt kostenlos anmelden." 
        />
        <meta name="keywords" content="Partner-Programm, Provision, Affiliate, Steuerberater, Marketing-Agentur, Webdesigner, KI-Lösungen, Digitalisierung" />
        <link rel="canonical" href="https://deutlicht.de/partner" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Partner-Programm - Gemeinsam wachsen | DeutLicht" />
        <meta property="og:description" content="Werden Sie DeutLicht-Partner: Wiederkehrende Provisionen für Steuerberater, Marketing-Agenturen und Webdesigner." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deutlicht.de/partner" />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "DeutLicht Partner-Programm",
            "description": "Partner-Programm für Steuerberater, Marketing-Agenturen und Webdesigner mit wiederkehrenden Provisionen.",
            "url": "https://deutlicht.de/partner",
            "publisher": {
              "@type": "Organization",
              "name": "DeutLicht",
              "url": "https://deutlicht.de"
            }
          })}
        </script>
      </Helmet>

      <Navigation />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <PartnerProgramm />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Partner;
