import { isAnalyticsAllowed } from "@/components/CookieBanner";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) => {
  if (!isAnalyticsAllowed() || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, eventParams);
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent("form_submission", {
    form_name: formName,
    success,
  });
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (buttonName: string, location: string) => {
  trackEvent("cta_click", {
    button_name: buttonName,
    location,
  });
};

/**
 * Track navigation clicks
 */
export const trackNavClick = (destination: string) => {
  trackEvent("navigation_click", {
    destination,
  });
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (url: string) => {
  trackEvent("external_link_click", {
    url,
  });
};
