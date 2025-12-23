import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "cookie-consent";

type ConsentType = "all" | "essential" | null;

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid layout shift on page load
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "all");
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "essential");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Wir verwenden Cookies
              </h3>
              <p className="text-sm text-muted-foreground">
                Diese Website verwendet Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. 
                Essentielle Cookies sind für den Betrieb der Website notwendig. 
                Weitere Cookies helfen uns, die Website zu verbessern und Ihnen personalisierte Inhalte anzuzeigen.
              </p>
              
              {showDetails && (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground">Essentielle Cookies</h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground">Analyse & Marketing Cookies</h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-3 flex gap-4 text-sm">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-primary hover:underline"
                >
                  {showDetails ? "Weniger anzeigen" : "Mehr erfahren"}
                </button>
                <Link to="/datenschutz" className="text-primary hover:underline">
                  Datenschutzerklärung
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Button 
                variant="outline" 
                onClick={handleAcceptEssential}
                className="whitespace-nowrap"
              >
                Nur Essentielle
              </Button>
              <Button 
                onClick={handleAcceptAll}
                className="whitespace-nowrap"
              >
                Alle akzeptieren
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to check consent status
export const getCookieConsent = (): ConsentType => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentType;
};

// Helper function to check if analytics cookies are allowed
export const isAnalyticsAllowed = (): boolean => {
  return getCookieConsent() === "all";
};
