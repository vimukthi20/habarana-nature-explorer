# Habarana Nature Explorer 🌿🐘
> **Tourism Analytics Group Project** — Developing and Implementing a Tourism Analytics System  
> **Topic:** Habarana Nature Explorer (Sri Lanka Wildlife & Eco-Tourism)  
> **Tech Stack:** Semantic HTML5, Vanilla Modern CSS3, JavaScript (ES6+), GTM, GA4, Meta Pixel  

---

## 📋 Project Overview & Assignment Alignment

This website is specifically developed to fulfill all requirements for the **Tourism Analytics Group Assignment**:

| Assignment Task | Website Implementation | Verification Method |
| :--- | :--- | :--- |
| **Task 01 – Develop a Tourism Website** | Complete multi-page responsive website featuring Wildlife Experiences, Nature Activities, Tour Packages, Contact Us, Nature Photography, and Responsible Tourism. | Open `index.html` in any web browser or deploy to GitHub Pages. |
| **Task 02 – Implement Tracking & Collect Data** | Fully configured Google Tag Manager (`GTM`), Google Analytics 4 (`GA4`), and Meta Pixel scripts with custom `dataLayer` events, conversion tracking, scroll depth, and CTA monitoring. | Live on-page **Analytics Inspector** widget + GTM Preview / GA4 DebugView. |
| **Task 03 – Analyse & Interpret Data** | Built-in CSV & JSON export of visitor interaction events, package views, leads, and engagement metrics for reporting. | Click **"Export CSV (Report)"** in the on-page inspector. |
| **Task 04 – Data-Driven Campaign** | Campaign-ready landing pages with UTM parameter support, lead forms, WhatsApp click tracking, and audience segmentation triggers. | See [ANALYTICS_SETUP_GUIDE.md](file:///c:/Users/User/Desktop/Habarana%20Nature%20Explorer/ANALYTICS_SETUP_GUIDE.md). |

---

## 🚀 How to Deploy on GitHub Pages (Step-by-Step)

This website uses pure HTML, CSS, and JavaScript with relative asset paths, making it **100% ready for free, instant deployment on GitHub Pages**!

### Step 1: Initialize Git Repository
In your terminal or command prompt inside this folder:
```bash
git init
git add .
git commit -m "Initial commit of Habarana Nature Explorer tourism website"
```

### Step 2: Push to GitHub
1. Create a new repository on [GitHub.com](https://github.com) named `habarana-nature-explorer`.
2. Link your local folder to GitHub and push:
```bash
git remote add origin https://github.com/<YOUR-USERNAME>/habarana-nature-explorer.git
git branch -M main
git push -u origin main
```

### Step 3: Turn on GitHub Pages (3 Clicks)
1. In your GitHub repository, click on **Settings** (top menu).
2. In the left sidebar, click on **Pages**.
3. Under **Branch**, select `main` branch and `/ (root)` folder.
4. Click **Save**.
5. Within 1 minute, GitHub will give you your live URL:  
   👉 `https://<YOUR-USERNAME>.github.io/habarana-nature-explorer/`

You can submit this live link directly in your group report and present it live in class!

---

## 📊 How to Configure Your Group's Tracking IDs (Task 02)

You can customize the tracking IDs in **two easy ways**:

### Method A: Directly in the Browser (No Code Editing Needed!)
1. Open any page of the website.
2. Click the floating green button at the bottom-left: **"Tourism Analytics Inspector"**.
3. Switch to the **"Tracking IDs"** tab.
4. Paste your group's **GA4 Measurement ID** (`G-XXXXXXXXXX`) and **GTM Container ID** (`GTM-XXXXXXX`).
5. Click **"Save & Update IDs"**. The IDs are automatically remembered!

### Method B: In the Configuration File
Open [assets/js/analytics-config.js](file:///c:/Users/User/Desktop/Habarana%20Nature%20Explorer/assets/js/analytics-config.js) and update the values:
```javascript
const ANALYTICS_CONFIG = {
  gtmId: 'GTM-YOURID123',          // Your Google Tag Manager ID
  ga4Id: 'G-YOURID456',           // Your Google Analytics 4 Measurement ID
  metaPixelId: 'YOUR_PIXEL_ID',   // Your Meta (Facebook) Pixel ID
  debugMode: true
};
```

---

## 🎯 Interactive Features Built for High Marks

- 🐘 **Authentic Wildlife & Safari Content:** Exact copy and themes matching the Habarana project brief (Wildlife Safari, Elephant Viewing, Guided Observation, Responsible Tourism, Birdwatching, Nature Walks, Nature Photography).
- 💱 **Dynamic Currency Switcher:** Converts all package prices between **LKR (Rs.)**, **USD ($)**, **EUR (€)**, and **GBP (£)** in real-time.
- 📱 **Direct WhatsApp Integration:** Floating and inline WhatsApp inquiry buttons with pre-filled tour booking messages.
- 🔍 **Interactive Search Modal:** Live keyword search across all wildlife activities and tour packages.
- 📋 **Tour Comparison Matrix:** Detailed feature comparison table for all 3 tour packages.
- 📝 **Lead Capture & Booking Modals:** Interactive booking modal with package pre-selection, guest counter, and date picker that pushes `generate_lead` events to `window.dataLayer`.
- 📊 **Real-time Live Analytics Inspector:** On-screen debug drawer displaying live dataLayer events, timestamp, payload, and an export button to download CSV data for your 60-mark report!

---

## 📁 Project Structure

```text
Habarana Nature Explorer/
├── index.html                   # Main landing page (Image 2)
├── wildlife-experiences.html    # Wildlife Experiences page (Image 3)
├── nature-activities.html       # Nature Activities page (Image 4)
├── tour-packages.html           # Tour Packages page (Image 5)
├── contact.html                 # Contact Us & Booking page
├── README.md                    # Setup & GitHub deployment guide
├── ANALYTICS_SETUP_GUIDE.md     # Detailed Assignment Report Guide (Tasks 01-04)
└── assets/
    ├── css/
    │   └── styles.css           # Modern, responsive design system
    ├── js/
    │   ├── analytics-config.js  # Tracking IDs & currency config
    │   ├── analytics-tracker.js # GTM, GA4, Meta Pixel tracker & live inspector
    │   └── main.js              # UI interactivity, modals, forms & search
    └── images/
        ├── hero-elephants.jpg
        ├── safari-adventure.jpg
        ├── birdwatching.jpg
        ├── elephant-viewing.jpg
        ├── guided-observation.jpg
        ├── nature-explorer-walk.jpg
        ├── nature-photography.jpg
        └── responsible-tourism.jpg
```

---

## 🎓 Group Presentation Tips (40 Marks)

1. **Demonstrate the Live Inspector:** Click on the **"Tourism Analytics Inspector"** button at the bottom-left during your presentation to show the evaluators that every click on "Book Tour", package selection, or form submission fires an authentic event into `window.dataLayer` and GA4!
2. **Showcase Mobile Responsiveness:** Press `F12` and toggle Device Mode to demonstrate how smoothly the navigation and cards adapt to smartphones and tablets.
3. **Trigger Test Events:** Use the "Test Triggers" tab in the inspector to show instant conversion dispatching.
4. **Export CSV:** Demonstrate how the website enables instant export of visitor interaction datasets for data analysis in Excel or SPSS.

*Created for University Tourism Analytics Group Project &bull; Habarana, Sri Lanka*
