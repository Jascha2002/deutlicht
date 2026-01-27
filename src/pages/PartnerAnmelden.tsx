import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PartnerAnmeldeformular } from "@/components/PartnerAnmeldeformular";

const PartnerAnmelden = () => {
  return (
    <>
      <Helmet>
        <title>Partner werden - Anmeldung | DeutLicht</title>
        <meta 
          name="description" 
          content="Melden Sie sich jetzt als DeutLicht-Partner an und profitieren Sie von attraktiven Provisionen und exklusiven Schulungen." 
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://deutlicht.de/partner/anmelden" />
      </Helmet>

      <Navigation />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <PartnerAnmeldeformular />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PartnerAnmelden;
