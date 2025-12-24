import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { isAnalyticsAllowed } from "@/components/CookieBanner";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

export const useScrollDepthTracking = () => {
  const location = useLocation();
  const trackedThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Reset tracked thresholds on route change
    trackedThresholds.current = new Set();
  }, [location.pathname]);

  useEffect(() => {
    if (!isAnalyticsAllowed()) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      SCROLL_THRESHOLDS.forEach((threshold) => {
        if (
          scrollPercent >= threshold &&
          !trackedThresholds.current.has(threshold)
        ) {
          trackedThresholds.current.add(threshold);
          
          if (typeof window.gtag === "function") {
            window.gtag("event", "scroll_depth", {
              percent_scrolled: threshold,
              page_path: location.pathname,
            });
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
};

export default useScrollDepthTracking;
