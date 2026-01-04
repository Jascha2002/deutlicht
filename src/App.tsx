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

import AccessibilityWidget from "@/components/AccessibilityWidget";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import DeutLichtChat from "@/components/DeutLichtChat";
import FloatingInquiryButton from "@/components/FloatingInquiryButton";
import Index from "./pages/Index";
import UeberUns from "./pages/UeberUns";
import Hintergrund from "./pages/Hintergrund";
import Leistungen from "./pages/Leistungen";
import Projekte from "./pages/Projekte";
import Kontakt from "./pages/Kontakt";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Schnelluebersicht from "./pages/Schnelluebersicht";
import ChaynsLoesungen from "./pages/ChaynsLoesungen";
import ChaynsHardware from "./pages/ChaynsHardware";
import AIAgenten from "./pages/AIAgenten";
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
              <Route path="/schnelluebersicht" element={<Schnelluebersicht />} />
              <Route path="/leistungen/chayns-loesungen" element={<ChaynsLoesungen />} />
              <Route path="/leistungen/chayns-hardware" element={<ChaynsHardware />} />
              <Route path="/leistungen/ai-agenten" element={<AIAgenten />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <GoogleAnalytics />
            <ScrollDepthTracker />
            <CookieBanner />
            
            <AccessibilityWidget />
            <ElevenLabsWidget />
            <DeutLichtChat />
            <FloatingInquiryButton />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
