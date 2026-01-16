import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";

import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import Index from "./pages/Index";
import UeberUns from "./pages/UeberUns";
import Hintergrund from "./pages/Hintergrund";
import Leistungen from "./pages/Leistungen";
import Projekte from "./pages/Projekte";
import Kontakt from "./pages/Kontakt";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import Schnelluebersicht from "./pages/Schnelluebersicht";
import ChaynsLoesungen from "./pages/ChaynsLoesungen";
import ChaynsHardware from "./pages/ChaynsHardware";
import AIAgenten from "./pages/AIAgenten";
import AngebotsGenerator from "./pages/AngebotsGenerator";
import AngebotsAnnahme from "./pages/AngebotsAnnahme";
import KICheck from "./pages/KICheck";
import BranchenLoesungen from "./pages/BranchenLoesungen";
import VoicebotDemos from "./pages/VoicebotDemos";
import SEO from "./pages/SEO";
import Schulung from "./pages/Schulung";
import Websites from "./pages/Websites";
import Marketing from "./pages/Marketing";
import Wissensmanagement from "./pages/Wissensmanagement";
import CrmErp from "./pages/CrmErp";
import BIM from "./pages/BIM";
import PIM from "./pages/PIM";
import Foerderberatung from "./pages/Foerderberatung";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ueber-uns" element={<UeberUns />} />
              <Route path="/ueber-uns/hintergrund" element={<Hintergrund />} />
              <Route path="/leistungen" element={<Leistungen />} />
              <Route path="/projekte" element={<Projekte />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/agb" element={<AGB />} />
              <Route path="/angebot-annehmen" element={<AngebotsAnnahme />} />
              <Route path="/schnelluebersicht" element={<Schnelluebersicht />} />
              <Route path="/leistungen/chayns-loesungen" element={<ChaynsLoesungen />} />
              <Route path="/leistungen/chayns-hardware" element={<ChaynsHardware />} />
              <Route path="/leistungen/ai-agenten" element={<AIAgenten />} />
              <Route path="/projektanfrage" element={<AngebotsGenerator />} />
              <Route path="/angebots-generator" element={<AngebotsGenerator />} />
              <Route path="/klarheitscheck" element={<AngebotsGenerator />} />
              <Route path="/ki-check" element={<KICheck />} />
              <Route path="/leistungen/branchen-loesungen" element={<BranchenLoesungen />} />
              <Route path="/branchen-loesungen" element={<BranchenLoesungen />} />
              <Route path="/leistungen/voicebot-demos" element={<VoicebotDemos />} />
              <Route path="/voicebot-demos" element={<VoicebotDemos />} />
              <Route path="/leistungen/seo" element={<SEO />} />
              <Route path="/leistungen/schulung" element={<Schulung />} />
              <Route path="/leistungen/websites" element={<Websites />} />
              <Route path="/leistungen/marketing" element={<Marketing />} />
              <Route path="/leistungen/wissensmanagement" element={<Wissensmanagement />} />
              <Route path="/leistungen/crm-erp" element={<CrmErp />} />
              <Route path="/leistungen/bim" element={<BIM />} />
              <Route path="/leistungen/pim" element={<PIM />} />
              <Route path="/leistungen/foerderberatung" element={<Foerderberatung />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <GoogleAnalytics />
            <ScrollDepthTracker />
            <CookieBanner />
            <ElevenLabsWidget />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;