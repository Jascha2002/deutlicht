import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KIReadinessCheck from "@/components/KIReadinessCheck";

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
        <KIReadinessCheck />
      </main>
      <Footer />
    </>
  );
};

export default KICheck;
