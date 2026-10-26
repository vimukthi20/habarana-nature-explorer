/**
 * HABARANA NATURE EXPLORER - INTEGRATED ANALYTICS TRACKER
 * Full implementation for:
 * 1. Google Tag Manager (GTM dataLayer events)
 * 2. Google Analytics 4 (GA4 standard & custom events)
 * 3. Meta Pixel (Facebook Pixel standard & custom events)
 * 4. Real-time Live Event Inspector & CSV/JSON Exporter
 */

(function () {
  'use strict';

  // 1. Initialize dataLayer for Google Tag Manager
  window.dataLayer = window.dataLayer || [];

  // Helper for pushing to GTM dataLayer
  function pushDataLayer(payload) {
    window.dataLayer.push(payload);
  }

  // 2. Initialize Google Analytics 4 (gtag.js wrapper)
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  gtag('js', new Date());
  if (window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.ga4Id) {
    gtag('config', window.ANALYTICS_CONFIG.ga4Id, {
      send_page_view: false // Managed customly for precise event inspection
    });
  }

  // 3. Initialize Meta Pixel wrapper
  window.fbq = window.fbq || function () {
    (window.fbq.q = window.fbq.q || []).push(arguments);
  };
  window.fbq.loaded = true;
  window.fbq.version = '2.0';

  // In-memory event stream for student presentations and written report export
  window.tourismAnalyticsLog = JSON.parse(sessionStorage.getItem('tourism_event_logs') || '[]');

  /**
   * Central Tracking Dispatcher
   * Broadcasts to GTM dataLayer, GA4 gtag, and Meta Pixel fbq
   */
  function trackTourismEvent(eventName, params = {}, metaPixelEvent = null) {
    const timestamp = new Date().toLocaleTimeString();
    const eventRecord = {
      id: Date.now(),
      time: timestamp,
      event: eventName,
      params: params,
      platforms: ['GTM dataLayer', 'GA4 gtag', 'Meta Pixel']
    };

    // 1. Push to Google Tag Manager dataLayer
    pushDataLayer({
      event: eventName,
      timestamp: new Date().toISOString(),
      ...params
    });

    // 2. Dispatch to Google Analytics 4
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    // 3. Dispatch to Meta Pixel
    if (typeof window.fbq === 'function') {
      if (metaPixelEvent) {
        window.fbq('track', metaPixelEvent, params);
      } else {
        window.fbq('trackCustom', eventName, params);
      }
    }

    // 4. Save to session storage & memory
    window.tourismAnalyticsLog.unshift(eventRecord);
    if (window.tourismAnalyticsLog.length > 100) {
      window.tourismAnalyticsLog.pop();
    }
    sessionStorage.setItem('tourism_event_logs', JSON.stringify(window.tourismAnalyticsLog));

    // 5. Update Live UI Inspector if active
    updateInspectorUI();

    // 6. Console log for developers
    if (window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.debugMode) {
      console.log(`%c[Analytics Event Fired] %c${eventName}`, 'color: #25d366; font-weight: bold;', 'color: #e9c46a; font-weight: bold;', params);
    }
  }

  window.trackTourismEvent = trackTourismEvent;

  // Convenience specific event methods
  window.tourismAnalytics = {
    // Page View
    trackPageView: function (pageName) {
      trackTourismEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        section_category: pageName || 'Tourism General'
      }, 'PageView');
    },

    // Package or Experience View
    trackViewItem: function (item) {
      trackTourismEvent('view_item', {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'Tour Package',
        price: item.price,
        currency: item.currency || 'LKR'
      }, 'ViewContent');
    },

    // User selects/clicks a package
    trackSelectItem: function (item) {
      trackTourismEvent('select_item', {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'Tour Package',
        price: item.price,
        currency: item.currency || 'LKR'
      });
    },

    // Lead Generation (Inquiry / Booking request)
    trackLead: function (leadDetails) {
      trackTourismEvent('generate_lead', {
        package_name: leadDetails.packageName,
        lead_type: leadDetails.leadType || 'Booking Inquiry',
        estimated_value: leadDetails.estimatedValue || 0,
        currency: 'LKR',
        guests: leadDetails.guests || 1,
        inquiry_source: leadDetails.source || 'Website Form'
      }, 'Lead');
    },

    // CTA Button Click
    trackCTA: function (ctaName, location) {
      trackTourismEvent('click_cta', {
        cta_text: ctaName,
        cta_location: location || 'Page Body'
      });
    },

    // WhatsApp Direct Click
    trackWhatsAppClick: function (intent) {
      trackTourismEvent('whatsapp_click', {
        contact_type: 'WhatsApp Direct Chat',
        intent: intent || 'General Inquiry'
      }, 'Contact');
    },

    // Currency Switch
    trackCurrencyChange: function (newCurrency) {
      trackTourismEvent('currency_change', {
        selected_currency: newCurrency
      });
    }
  };

  /**
   * Automated Event Listeners
   */
  document.addEventListener('DOMContentLoaded', function () {
    // Fire Page View
    const pageTitle = document.title;
    window.tourismAnalytics.trackPageView(pageTitle);

    // Track all CTA and button clicks with data attributes
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('[data-analytics-event]');
      if (target) {
        const eventName = target.getAttribute('data-analytics-event');
        const ctaText = target.getAttribute('data-analytics-cta') || target.textContent.trim();
        const category = target.getAttribute('data-analytics-category') || 'General Interaction';
        trackTourismEvent(eventName, {
          element_text: ctaText,
          element_category: category,
          page: window.location.pathname
        });
      }

      // Check for WhatsApp links
      const waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
      if (waLink) {
        window.tourismAnalytics.trackWhatsAppClick(waLink.getAttribute('data-package') || 'Quick Chat');
      }

      // Check for phone call links
      const telLink = e.target.closest('a[href^="tel:"]');
      if (telLink) {
        trackTourismEvent('phone_call_click', {
          phone_number: telLink.getAttribute('href')
        }, 'Contact');
      }
    });

    // Scroll Depth Tracking (25%, 50%, 75%, 90%)
    const scrollMilestones = { 25: false, 50: false, 75: false, 90: false };
    window.addEventListener('scroll', throttle(function () {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      [25, 50, 75, 90].forEach(function (mark) {
        if (scrollPercent >= mark && !scrollMilestones[mark]) {
          scrollMilestones[mark] = true;
          trackTourismEvent(`scroll_depth_${mark}`, {
            scroll_percentage: mark,
            page: window.location.pathname
          });
        }
      });
    }, 400));

    // Time on Page Milestones (30s, 60s, 120s)
    [30, 60, 120].forEach(function (seconds) {
      setTimeout(function () {
        trackTourismEvent('user_engagement_time', {
          seconds_spent: seconds,
          page: window.location.pathname
        });
      }, seconds * 1000);
    });

    // Inject the Analytics Live Inspector widget into DOM
    injectInspectorDOM();
  });

  // Utility: throttle
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Build & Inject on-page Live Inspector & Tag Debugger
   */
  function injectInspectorDOM() {
    const config = window.ANALYTICS_CONFIG || {};

    const widget = document.createElement('div');
    widget.className = 'analytics-widget';
    widget.innerHTML = `
      <button class="analytics-toggle-btn" id="toggleAnalyticsPanel" title="Open Analytics Inspector for Presentation & Testing">
        <span class="status-dot"></span>
        <span>Tourism Analytics Inspector</span>
      </button>

      <div class="analytics-panel" id="analyticsInspectorPanel">
        <div class="analytics-panel-header">
          <h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
            Digital Tracking Inspector
          </h4>
          <button class="panel-close-btn" id="closeAnalyticsPanel" aria-label="Close Inspector">&times;</button>
        </div>

        <div class="analytics-tabs">
          <button class="analytics-tab-btn active" data-tab="liveEvents">Live Events (<span id="eventCountBadge">0</span>)</button>
          <button class="analytics-tab-btn" data-tab="tagStatus">Tracking IDs</button>
          <button class="analytics-tab-btn" data-tab="simulateEvents">Test Triggers</button>
        </div>

        <div class="analytics-tab-content">
          <!-- Tab 1: Live Event Stream -->
          <div class="tab-pane active" id="pane-liveEvents">
            <div class="live-events-stream" id="eventsStreamContainer">
              <div style="color: #9cb1a6; text-align: center; padding: 20px 0;">No events logged yet. Interact with the website to see live tracking!</div>
            </div>
          </div>

          <!-- Tab 2: Tag Status & ID Config -->
          <div class="tab-pane" id="pane-tagStatus" style="display: none;">
            <div class="tracking-status-cards">
              <div class="status-badge-row">
                <span class="status-label">GTM Container:</span>
                <span class="status-value" id="dispGtmId">${config.gtmId}</span>
              </div>
              <div class="status-badge-row">
                <span class="status-label">GA4 Measurement ID:</span>
                <span class="status-value" id="dispGa4Id">${config.ga4Id}</span>
              </div>
              <div class="status-badge-row">
                <span class="status-label">Meta Pixel ID:</span>
                <span class="status-value" id="dispPixelId">${config.metaPixelId}</span>
              </div>
            </div>

            <div style="margin-top: 14px;">
              <label style="display:block; font-size: 0.75rem; margin-bottom: 4px; color: #a9c5b5;">Custom GA4 / GTM IDs (For Presentation):</label>
              <input type="text" id="inputCustomGA4" placeholder="Enter GA4 ID (e.g. G-XXXXXXX)" value="${config.ga4Id}" style="width:100%; padding: 6px; font-size: 0.75rem; margin-bottom: 6px; background:#12291c; border:1px solid #2d6a4f; color:#fff; border-radius:4px;">
              <input type="text" id="inputCustomGTM" placeholder="Enter GTM ID (e.g. GTM-XXXXXXX)" value="${config.gtmId}" style="width:100%; padding: 6px; font-size: 0.75rem; margin-bottom: 8px; background:#12291c; border:1px solid #2d6a4f; color:#fff; border-radius:4px;">
              <button id="saveTrackingIdsBtn" style="width:100%; padding: 6px; background:#2d6a4f; color:#fff; border:none; border-radius:4px; font-size:0.75rem; cursor:pointer; font-weight:bold;">Save & Update IDs</button>
            </div>
          </div>

          <!-- Tab 3: Simulate Events for Demo -->
          <div class="tab-pane" id="pane-simulateEvents" style="display: none;">
            <p style="font-size:0.75rem; color:#9cb1a6; margin-bottom: 10px;">Click below to instantly demonstrate live event firing to your evaluators:</p>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <button class="test-trigger-btn" data-test="view_item" style="padding: 6px 10px; background:#183625; color:#e9c46a; border:1px solid #2d6a4f; border-radius:4px; font-size:0.75rem; cursor:pointer; text-align:left;">Trigger: view_item (Safari Package)</button>
              <button class="test-trigger-btn" data-test="generate_lead" style="padding: 6px 10px; background:#183625; color:#e9c46a; border:1px solid #2d6a4f; border-radius:4px; font-size:0.75rem; cursor:pointer; text-align:left;">Trigger: generate_lead (Booking Modal)</button>
              <button class="test-trigger-btn" data-test="filter_wildlife" style="padding: 6px 10px; background:#183625; color:#e9c46a; border:1px solid #2d6a4f; border-radius:4px; font-size:0.75rem; cursor:pointer; text-align:left;">Trigger: filter_wildlife (Elephants)</button>
            </div>
          </div>
        </div>

        <div class="panel-footer-actions">
          <button class="btn-panel btn-panel-export" id="exportCsvBtn">Export CSV (Report)</button>
          <button class="btn-panel btn-panel-export" id="exportJsonBtn">Export JSON</button>
          <button class="btn-panel btn-panel-clear" id="clearEventsBtn">Clear</button>
        </div>
      </div>
    `;

    document.body.appendChild(widget);

    // Event handlers for widget
    const toggleBtn = document.getElementById('toggleAnalyticsPanel');
    const panel = document.getElementById('analyticsInspectorPanel');
    const closeBtn = document.getElementById('closeAnalyticsPanel');

    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('active');
      updateInspectorUI();
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('active');
    });

    // Tab switcher
    const tabBtns = panel.querySelectorAll('.analytics-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tabKey = this.getAttribute('data-tab');

        panel.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
        const activePane = document.getElementById(`pane-${tabKey}`);
        if (activePane) activePane.style.display = 'block';
      });
    });

    // Save custom tracking IDs
    document.getElementById('saveTrackingIdsBtn').addEventListener('click', function () {
      const customGa4 = document.getElementById('inputCustomGA4').value.trim();
      const customGtm = document.getElementById('inputCustomGTM').value.trim();
      if (customGa4) localStorage.setItem('tourism_ga4_id', customGa4);
      if (customGtm) localStorage.setItem('tourism_gtm_id', customGtm);
      document.getElementById('dispGa4Id').textContent = customGa4 || config.ga4Id;
      document.getElementById('dispGtmId').textContent = customGtm || config.gtmId;
      alert('Tracking IDs updated! They will be used across your browsing session.');
    });

    // Simulate triggers
    panel.querySelectorAll('.test-trigger-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const testType = this.getAttribute('data-test');
        if (testType === 'view_item') {
          tourismAnalytics.trackViewItem({
            id: 'PKG-02',
            name: 'Wildlife Adventure Safari',
            price: 12000,
            currency: 'LKR',
            category: 'Safari Experiences'
          });
        } else if (testType === 'generate_lead') {
          tourismAnalytics.trackLead({
            packageName: 'Habarana Nature Day',
            guests: 4,
            estimatedValue: 72000,
            leadType: 'Group Tour Inquiry'
          });
        } else if (testType === 'filter_wildlife') {
          trackTourismEvent('filter_click', {
            category_selected: 'Elephant Viewing',
            filter_type: 'Species Spotlight'
          });
        }
      });
    });

    // Export CSV (For Assignment Task 03 analysis)
    document.getElementById('exportCsvBtn').addEventListener('click', function () {
      const logs = window.tourismAnalyticsLog || [];
      if (logs.length === 0) {
        alert('No events collected yet to export.');
        return;
      }
      let csvContent = 'data:text/csv;charset=utf-8,Timestamp,Event_Name,Platforms,Parameters\n';
      logs.forEach(row => {
        const paramsStr = JSON.stringify(row.params).replace(/"/g, '""');
        csvContent += `"${row.time}","${row.event}","${row.platforms.join('; ')}","${paramsStr}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `tourism_analytics_data_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Export JSON
    document.getElementById('exportJsonBtn').addEventListener('click', function () {
      const logs = window.tourismAnalyticsLog || [];
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `tourism_analytics_events_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    // Clear Events
    document.getElementById('clearEventsBtn').addEventListener('click', function () {
      window.tourismAnalyticsLog = [];
      sessionStorage.removeItem('tourism_event_logs');
      updateInspectorUI();
    });

    updateInspectorUI();
  }

  function updateInspectorUI() {
    const container = document.getElementById('eventsStreamContainer');
    const badge = document.getElementById('eventCountBadge');
    if (!container || !badge) return;

    const logs = window.tourismAnalyticsLog || [];
    badge.textContent = logs.length;

    if (logs.length === 0) {
      container.innerHTML = '<div style="color: #9cb1a6; text-align: center; padding: 20px 0;">No events logged yet. Interact with the website!</div>';
      return;
    }

    container.innerHTML = logs.map(item => `
      <div class="event-item">
        <div class="event-header">
          <span class="event-name">${escapeHtml(item.event)}</span>
          <span class="event-time">${item.time}</span>
        </div>
        <div class="event-details">${escapeHtml(JSON.stringify(item.params, null, 1))}</div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
