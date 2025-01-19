'use client';

declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      options: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
  }
}

export const useAnalytics = () => {
  const trackEvent = (
    action: string,
    category?: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  return {
    trackEvent,
  };
};
