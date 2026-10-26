/**
 * HABARANA NATURE EXPLORER - ANALYTICS CONFIGURATION
 * Tourism Analytics Group Project
 * 
 * Instructions for Students:
 * You can either replace the default IDs below with your group's IDs,
 * OR enter them directly using the on-page "Analytics Live Inspector" in your browser!
 */

const ANALYTICS_CONFIG = {
  // Google Tag Manager (GTM) Container ID (Format: GTM-XXXXXXX)
  gtmId: localStorage.getItem('tourism_gtm_id') || 'GTM-HNE2026',

  // Google Analytics 4 (GA4) Measurement ID (Format: G-XXXXXXXXXX)
  ga4Id: localStorage.getItem('tourism_ga4_id') || 'G-RY10B918S2',

  // Meta Pixel (Facebook Pixel) ID (15-16 digit numeric ID)
  metaPixelId: localStorage.getItem('tourism_meta_pixel_id') || '3829481729482910',

  // Debug & Demonstration mode (logs all events visibly to the on-page inspector)
  debugMode: true,

  // Currency exchange rates (base LKR)
  currencies: {
    LKR: { symbol: 'LKR ', rate: 1 },
    USD: { symbol: '$', rate: 0.0033 },
    EUR: { symbol: '€', rate: 0.0030 },
    GBP: { symbol: '£', rate: 0.0026 }
  }
};

window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;
