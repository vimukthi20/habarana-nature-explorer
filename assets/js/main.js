/**
 * HABARANA NATURE EXPLORER - MAIN JAVASCRIPT
 * Interactive UI components, currency switcher, booking modal, search modal, form validation
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Mobile Menu Toggle & Enhanced Drawer
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggleBtn && mainNav) {
    // Add mobile booking & WhatsApp buttons inside the drawer if not already present
    if (!mainNav.querySelector('.mobile-menu-footer-cta')) {
      const ctaDiv = document.createElement('div');
      ctaDiv.className = 'mobile-menu-footer-cta';
      ctaDiv.innerHTML = `
        <button class="btn btn-primary btn-block" data-open-booking="Mobile Drawer Booking" style="padding:12px 18px; font-size:0.88rem;">
          <span>Book Tour Package</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <button class="btn btn-whatsapp btn-sm btn-block" onclick="window.open('https://wa.me/94771234567?text=Hi%20Habarana%20Nature%20Explorer,%20I%20would%20like%20to%20inquire%20about%20tours', '_blank')">
          <span>WhatsApp Quick Chat</span>
        </button>
      `;
      mainNav.appendChild(ctaDiv);
    }

    mobileToggleBtn.addEventListener('click', function () {
      mainNav.classList.toggle('active');
      const isExpanded = mainNav.classList.contains('active');
      mobileToggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside or clicking a nav link
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !mobileToggleBtn.contains(e.target) && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
      }
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
      });
    });
  }

  // 2. Currency Switcher & Dynamic Price Converter
  const currencySelect = document.getElementById('currencySelector');
  const currencyConfig = window.ANALYTICS_CONFIG ? window.ANALYTICS_CONFIG.currencies : {
    LKR: { symbol: 'LKR ', rate: 1 },
    USD: { symbol: '$', rate: 0.0033 },
    EUR: { symbol: '€', rate: 0.0030 },
    GBP: { symbol: '£', rate: 0.0026 }
  };

  if (currencySelect) {
    currencySelect.addEventListener('change', function () {
      const selectedCurrency = this.value;
      updateDisplayedPrices(selectedCurrency);

      if (window.tourismAnalytics && window.tourismAnalytics.trackCurrencyChange) {
        window.tourismAnalytics.trackCurrencyChange(selectedCurrency);
      }
      showToast(`Currency converted to ${selectedCurrency}`);
    });
  }

  function updateDisplayedPrices(currencyKey) {
    const cur = currencyConfig[currencyKey] || currencyConfig.LKR;
    const priceElements = document.querySelectorAll('[data-base-price]');

    priceElements.forEach(el => {
      const basePriceLKR = parseFloat(el.getAttribute('data-base-price'));
      if (!isNaN(basePriceLKR)) {
        if (currencyKey === 'LKR') {
          el.textContent = `${cur.symbol} ${basePriceLKR.toLocaleString()}`;
        } else {
          const converted = Math.round(basePriceLKR * cur.rate);
          el.textContent = `${cur.symbol}${converted.toLocaleString()}`;
        }
      }
    });
  }

  // 3. Booking / Inquiry Modal Controller
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('quickBookingForm');
  const packageSelectInput = document.getElementById('modalPackageSelect');

  // Open modal from any CTA button
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const packageName = this.getAttribute('data-open-booking');
      if (packageName && packageSelectInput) {
        packageSelectInput.value = packageName;
      }
      openBookingModal(packageName);
    });
  });

  function openBookingModal(pkgName) {
    if (!bookingModal) return;
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.trackTourismEvent) {
      window.trackTourismEvent('open_booking_modal', {
        selected_package: pkgName || 'General Inquiry',
        page: window.location.pathname
      });
    }
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', function (e) {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  // Handle Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = document.getElementById('modalName').value.trim();
      const email = document.getElementById('modalEmail').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const pkg = document.getElementById('modalPackageSelect').value;
      const guests = parseInt(document.getElementById('modalGuests').value, 10) || 1;
      const date = document.getElementById('modalDate').value;
      const notes = document.getElementById('modalNotes') ? document.getElementById('modalNotes').value.trim() : '';

      if (!fullName || !email) {
        showToast('Please fill in your name and email address.');
        return;
      }

      // Estimate booking value based on package
      let unitPrice = 3500;
      if (pkg.includes('Wildlife Adventure')) unitPrice = 12000;
      if (pkg.includes('Nature Day')) unitPrice = 18000;
      const totalEstimatedValue = unitPrice * guests;

      // Track conversion in Analytics
      if (window.tourismAnalytics) {
        window.tourismAnalytics.trackLead({
          packageName: pkg,
          leadType: 'Modal Booking Form',
          estimatedValue: totalEstimatedValue,
          guests: guests,
          source: 'Website Modal Form'
        });
      }

      // Success feedback
      closeBookingModal();
      bookingForm.reset();
      showToast(`Thank you, ${fullName}! Your inquiry for ${pkg} has been received.`);
    });
  }

  // 4. Contact Us Page Form Submission
  const mainContactForm = document.getElementById('mainContactForm');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please complete all required fields.');
        return;
      }

      // Track in Analytics
      if (window.trackTourismEvent) {
        window.trackTourismEvent('contact_form_submit', {
          user_name: name,
          user_email: email,
          form_name: 'Main Contact Page Form'
        }, 'Contact');
      }

      mainContactForm.reset();
      showToast(`Message sent! Thank you ${name}, our Habarana nature guide will get back to you shortly.`);
    });
  }

  // 5. Toast Notification System
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e9c46a" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  window.showToast = showToast;

  // 6. Interactive Search Modal
  const searchTriggerBtn = document.getElementById('searchTriggerBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('siteSearchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const closeSearchModalBtn = document.getElementById('closeSearchModal');

  const siteSearchIndex = [
    { title: 'Wildlife Safari Experiences', category: 'Wildlife Experiences', url: 'wildlife-experiences.html', desc: 'Guided safari adventures observing elephants and wildlife in natural habitats.' },
    { title: 'Elephant Viewing & Conservation', category: 'Wildlife Experiences', url: 'wildlife-experiences.html', desc: 'Observe majestic Sri Lankan elephant herds peacefully in Habarana.' },
    { title: 'Guided Wildlife Observation', category: 'Wildlife Experiences', url: 'wildlife-experiences.html', desc: 'Learn animal behavior, habitats, and biodiversity with certified naturalist.' },
    { title: 'Responsible Nature Tourism', category: 'Eco Tourism', url: 'wildlife-experiences.html', desc: 'Ethical wildlife viewing respecting animals and preserving ecosystems.' },
    { title: 'Birdwatching Excursions', category: 'Nature Activities', url: 'nature-activities.html', desc: 'Discover vibrant birds including Sri Lanka Blue Magpie, Hornbills, and Kingfishers.' },
    { title: 'Guided Nature Walks', category: 'Nature Activities', url: 'nature-activities.html', desc: 'Peaceful walks through tropical canopies, trees, and native plants.' },
    { title: 'Nature Photography Opportunities', category: 'Nature Activities', url: 'nature-activities.html', desc: 'Capture stunning landscapes and wildlife without disturbing animals.' },
    { title: 'Learning About Local Flora & Fauna', category: 'Nature Activities', url: 'nature-activities.html', desc: 'Discover native medicinal herbs, giant trees, and ecological balance.' },
    { title: 'Nature Explorer Package (2 Hours)', category: 'Tour Packages', url: 'tour-packages.html', desc: 'Short guided introduction to Habarana nature - LKR 3,500/person.' },
    { title: 'Wildlife Adventure Safari (4 Hours)', category: 'Tour Packages', url: 'tour-packages.html', desc: '4x4 safari excursion in elephant habitats - LKR 12,000/person.' },
    { title: 'Habarana Nature Day (6-7 Hours)', category: 'Tour Packages', url: 'tour-packages.html', desc: 'Complete full-day immersion with walks, safari, birdwatching, and lunch - LKR 18,000/person.' }
  ];

  if (searchTriggerBtn && searchModal) {
    searchTriggerBtn.addEventListener('click', function () {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput && searchInput.focus(), 100);

      if (window.trackTourismEvent) {
        window.trackTourismEvent('search_modal_open', { page: window.location.pathname });
      }
    });

    if (closeSearchModalBtn) {
      closeSearchModalBtn.addEventListener('click', closeSearch);
    }

    searchModal.addEventListener('click', function (e) {
      if (e.target === searchModal) closeSearch();
    });

    function closeSearch() {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (searchInput && searchResultsContainer) {
      searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();
        if (query.length === 0) {
          searchResultsContainer.innerHTML = '<p style="color:#7b9487; text-align:center; padding:20px;">Type to search wildlife, activities, or tour packages...</p>';
          return;
        }

        const matches = siteSearchIndex.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          searchResultsContainer.innerHTML = `<p style="color:#7b9487; text-align:center; padding:20px;">No experiences found matching "<strong>${escapeHtml(query)}</strong>".</p>`;
        } else {
          searchResultsContainer.innerHTML = matches.map(item => `
            <a href="${item.url}" class="search-result-item" style="display:block; padding:12px; border-bottom:1px solid #d6e2db; text-decoration:none;">
              <span style="font-size:0.75rem; color:#2d6a4f; font-weight:700; text-transform:uppercase;">${item.category}</span>
              <h4 style="font-family:'Outfit', sans-serif; font-size:1.05rem; color:#0f2b1d; margin:2px 0;">${item.title}</h4>
              <p style="font-size:0.85rem; color:#53675c; margin:0;">${item.desc}</p>
            </a>
          `).join('');

          if (window.trackTourismEvent && query.length >= 3) {
            window.trackTourismEvent('site_search', {
              search_term: query,
              results_count: matches.length
            });
          }
        }
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

});
