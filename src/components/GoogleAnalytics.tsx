import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isAnalyticsAllowed } from "./CookieBanner";

const GA_MEASUREMENT_ID = "G-RXH05QYFJ1";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Only load GA if user has accepted all cookies
    if (!isAnalyticsAllowed()) return;

    // Check if script is already loaded
    if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
      return;
    }

    // Load GA script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: "SameSite=None;Secure",
    });
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!isAnalyticsAllowed() || !window.gtag) return;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
};
