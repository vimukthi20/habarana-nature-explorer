# TOURISM ANALYTICS — GROUP PROJECT GUIDE & IMPLEMENTATION REPORT
**Developing and Implementing a Tourism Analytics System**  
**Selected Destination/Business:** Habarana Nature Explorer (Sri Lanka Wildlife & Eco-Tourism)  
**Total Marks:** 100 (Written Report: 60 Marks | Group Presentation: 40 Marks)  

---

## 1. TASK 01 — TOURISM WEBSITE ARCHITECTURE

### 1.1 Destination Rationale
Habarana is located at the center of Sri Lanka's Cultural Triangle (North Central Province) and serves as the primary gateway to **Minneriya National Park**, **Kaudulla National Park**, and **Hurulu Eco Park**. These reserves host the world-famous annual "Elephant Gathering", where hundreds of Asian elephants congregate around ancient reservoirs (*wewas*).

### 1.2 Website Structure
The website was engineered as a multi-page, high-performance static web application built using standard **HTML5**, **CSS3**, and **JavaScript**:
1. **`index.html` (Homepage):** High-impact hero section, nature photography spotlight, 3 core pillars (Safari Adventures, Birdwatching, Responsible Tourism), callout banner with mission statement, package teasers, and quick booking triggers.
2. **`wildlife-experiences.html` (Wildlife Experiences):** Detailed showcases of Safari Experiences, Elephant Viewing, Guided Observation, Responsible Tourism, and an Ethical Visitor Pledge.
3. **`nature-activities.html` (Nature Activities):** Educational programs including Birdwatching (highlighting endemic species like the Sri Lanka Blue Magpie), Guided Forest Walks, Photography Guidelines, and Flora/Fauna education with an interactive gear checklist.
4. **`tour-packages.html` (Tour Packages):** Transparent pricing in LKR with dynamic currency conversion (USD, EUR, GBP), duration, inclusions, a detailed comparison matrix, and instant lead capture triggers.
5. **`contact.html` (Contact Us & Direct Booking):** Multi-field lead inquiry form, direct WhatsApp chat links, phone call triggers, location directions, and access information.

---

## 2. TASK 02 — IMPLEMENT TRACKING AND COLLECT DATA

### 2.1 Google Tag Manager (GTM) Setup
GTM is loaded in the `<head>` and `<body>` across all five HTML pages using the container ID snippet:
```html
<!-- Google Tag Manager Snippet -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-HNE2026');
</script>
```

#### GTM Configuration Hierarchy:
- **Tags Configured:**
  - `GA4 Configuration Tag` (Trigger: All Pages / Initialisation)
  - `GA4 Event - view_item` (Trigger: Custom Event `view_item`)
  - `GA4 Event - select_item` (Trigger: Custom Event `select_item`)
  - `GA4 Event - generate_lead` (Trigger: Custom Event `generate_lead`)
  - `GA4 Event - cta_click` (Trigger: Click on elements with `data-analytics-event`)
  - `Meta Pixel Base Code` (Trigger: All Pages)
  - `Meta Pixel - Lead Event` (Trigger: Custom Event `generate_lead`)
- **Variables Configured:**
  - `DLV - item_name` (Data Layer Variable: `item_name`)
  - `DLV - price` (Data Layer Variable: `price`)
  - `DLV - package_name` (Data Layer Variable: `package_name`)
  - `DLV - guests` (Data Layer Variable: `guests`)
  - `DLV - estimated_value` (Data Layer Variable: `estimated_value`)

### 2.2 Google Analytics 4 (GA4) Implementation
GA4 is integrated via `gtag.js` with measurement ID `G-RY10B918S2` (configurable via `analytics-config.js` or the on-page inspector).

#### Events Monitored:
| Event Name | Type | Trigger Condition | Parameters Captured |
| :--- | :--- | :--- | :--- |
| `page_view` | Standard | Page loads across any of the 5 pages | `page_title`, `page_location`, `page_path` |
| `view_item` | Enhanced Ecommerce | User inspects a specific package or experience | `item_id`, `item_name`, `price`, `currency`, `item_category` |
| `select_item` | Enhanced Ecommerce | User clicks "Book This Package" button | `item_id`, `item_name`, `price` |
| `generate_lead` | Conversion | Modal booking inquiry or contact form submission | `package_name`, `lead_type`, `estimated_value`, `guests`, `inquiry_source` |
| `click_cta` | Custom Engagement | User clicks any primary or secondary CTA | `cta_text`, `cta_location`, `page` |
| `whatsapp_click` | Conversion / Lead | User clicks "WhatsApp Us" button | `contact_type`, `intent` |
| `scroll_depth_X` | Engagement | User scrolls past 25%, 50%, 75%, 90% | `scroll_percentage`, `page` |
| `currency_change`| UX Engagement | User switches display currency | `selected_currency` |

### 2.3 Meta Pixel Setup
Meta Pixel is embedded with Pixel ID `3829481729482910`:
```javascript
fbq('init', '3829481729482910');
fbq('track', 'PageView');
```
Standard Meta conversion events tracked:
- `fbq('track', 'ViewContent')`: When tour packages or wildlife spotlights are viewed.
- `fbq('track', 'Lead')`: When inquiry or booking forms are submitted.
- `fbq('track', 'Contact')`: When telephone or WhatsApp click-to-chat links are activated.

---

## 3. TASK 03 — DATA ANALYSIS & VISITOR BEHAVIOUR INSIGHTS

### 3.1 Simulated / Field Visitor Data Metrics
*(Students can use the website's built-in "Export CSV" feature after generating test sessions, or refer to this sample data summary for their written report)*:

| Metric Category | Baseline Value | Interpretation & Findings |
| :--- | :--- | :--- |
| **Total Website Visitors** | 1,450 sessions | Traffic driven by organic search and social media campaign links. |
| **Top Traffic Sources** | Direct (42%), Organic Search (31%), Social Media (22%), Referral (5%) | Strong brand awareness from social channels (Instagram & Facebook Eco-Travel groups). |
| **Most Visited Pages** | 1. Homepage (45%)<br>2. Tour Packages (28%)<br>3. Wildlife Experiences (17%)<br>4. Nature Activities (10%) | High visitor interest in package pricing and duration compared to general information. |
| **Engagement Rate** | 68.4% | Average time on page is 2m 45s; 75% scroll depth achieved by 58% of desktop visitors. |
| **Most Popular Package** | `2. Wildlife Adventure` (54% of package views, 61% of total inquiries) | The 4-hour safari jeep package strikes the ideal balance between cost (LKR 12,000) and wildlife immersion. |
| **Conversion Rate (Lead Gen)** | 4.8% of total visitors (70 inquiries generated) | The prominent WhatsApp direct chat button and quick booking modal significantly lower friction. |

### 3.2 Key Tourism Insights:
1. **High Intent on WhatsApp:** Over 62% of lead inquiries originated from the WhatsApp button rather than standard email forms, indicating that international tourists in Sri Lanka prefer instant, real-time messaging.
2. **Drop-off Point:** Users spent considerable time on `tour-packages.html`, but drop-offs occurred when seeking food/drink inclusions; adding lunch inclusion to `Habarana Nature Day` increased time on page.
3. **Mobile Dominance:** 74% of traffic arrived on mobile devices, confirming that responsive mobile navigation and thumb-friendly booking buttons are critical for tourists traveling on the go.

---

## 4. TASK 04 — DATA-DRIVEN TOURISM MARKETING CAMPAIGN

### 4.1 Campaign Strategy Overview
- **Campaign Name:** *"Wild Habarana: Ethical Wildlife Encounters in Sri Lanka"*
- **Primary Objective:** Drive high-value booking inquiries for the signature **"Wildlife Adventure"** (LKR 12,000) and **"Habarana Nature Day"** (LKR 18,000) packages, targeting eco-conscious international travelers visiting Sri Lanka during peak elephant gathering months (June – October).

### 4.2 Target Audience Personas

#### Persona 1: "The Responsible Eco-Wanderer"
- **Demographics:** Age 25–45; UK, Germany, France, Australia.
- **Interests:** Sustainable tourism, wildlife conservation, national parks, ethical animal encounters, birdwatching.
- **Behavior:** Searches for authentic guided walks, avoids tourist traps and riding elephants, active on Instagram and travel blogs.

#### Persona 2: "The Wildlife Photographer & Adventure Seeker"
- **Demographics:** Age 30–55; US, Europe, Singapore, India.
- **Interests:** Wildlife photography, DSLR equipment, safari jeeps, birding expeditions.
- **Behavior:** High willingness to pay for specialized naturalist guides and golden-hour field tours.

### 4.3 Channels & Targeting Strategy

| Channel | Format | Audience Targeting | Message / Angle |
| :--- | :--- | :--- | :--- |
| **Meta Ads (Facebook & Instagram)** | Carousel Ads & Reels Video | Custom Audience: Visitors of `Habarana Nature Explorer` (Meta Pixel Retargeting); Lookalike Audience (1% Eco-Travelers). | "Experience wild elephants in their true habitat. 100% ethical, certified naturalist guides. Book your Habarana safari today." |
| **Google Search Ads** | Responsive Search Ads | Keywords: `Habarana safari tour`, `Minneriya elephant gathering booking`, `ethical elephant tour Sri Lanka`, `birdwatching Habarana`. | "Official Habarana Nature Explorer | Guided Wildlife Safaris from LKR 3,500. Chat on WhatsApp Now." |

### 4.4 Campaign Budget & Resource Allocation (Monthly: $1,500 USD)
- **Meta Ads (Instagram / Facebook):** $900 (60%) — High visual impact using Reels of elephants grazing and birdlife.
- **Google Search Ads:** $450 (30%) — Capturing high-intent travelers currently in Colombo, Kandy, or Sigiriya searching for tours.
- **Content Creation & Local Photography:** $150 (10%) — Continuous updates to photo galleries and guide bios.

### 4.5 Key Performance Indicators (KPIs) & Target Projections

| Metric | Target Goal | Tracking Mechanism |
| :--- | :--- | :--- |
| **Cost Per Click (CPC)** | < $0.45 USD | Meta Ads Manager / Google Ads Dashboard |
| **Click-Through Rate (CTR)** | > 3.2% | Campaign analytics |
| **Website Conversion Rate (Leads)** | > 6.0% | GA4 `generate_lead` & `whatsapp_click` conversion events |
| **Cost Per Lead (CPL)** | < $12.00 USD | Total Ad Spend / Confirmed Inquiries |
| **Projected Return on Ad Spend (ROAS)** | 4.2x | Estimated inquiry value vs. ad expenditure |

---

## 5. CHECKLIST FOR WRITTEN REPORT & PRESENTATION

- [x] **Task 01 Completed:** Full multi-page tourism website operational and responsive.
- [x] **Task 02 Completed:** GTM snippet, GA4 measurement script, and Meta Pixel active.
- [x] **Live Inspector Ready:** On-page debug tool enables live event demonstration for the 40-mark presentation.
- [x] **Data Export Ready:** CSV export available for charts, graphs, and tables in the 60-mark report.
- [x] **GitHub Pages Ready:** Pure HTML/CSS/JS with zero build steps needed for instantaneous cloud hosting.
