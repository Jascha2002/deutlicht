// Analyse-Seite für interne Nutzung

import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DigitalisierungsAnalyseApp from '@/components/analyse/DigitalisierungsAnalyseApp';

const DigitalisierungsAnalyse = () => {
  return (
    <>
      <Helmet>
        <title>Digitalisierungs-Analyse | DeutLicht</title>
        <meta name="description" content="Interne Digitalisierungs-Analyse für Beratungsprojekte" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      <main className="pt-20">
        <DigitalisierungsAnalyseApp />
      </main>
      <Footer />
    </>
  );
};

export default DigitalisierungsAnalyse;
