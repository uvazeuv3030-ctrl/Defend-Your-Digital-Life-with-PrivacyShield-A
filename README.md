# PrivacyShield AI (SurakshaLens AI)
### Beginner-Friendly Digital Privacy & Cyber Threat Defense Assistant

> Built for Hackathons | Aligned with **CERT-In Advisory Guidelines** & the **Digital Personal Data Protection (DPDP) Act, 2023**

---

## 🌟 Overview
Many everyday smartphone users, seniors, students, and small-business owners unknowingly expose personal credentials and financial data through confusing app permission dialogues, deceptive phishing links, and active Indian scam patterns (such as UPI reverse-charge fraud, fake electricity bill APKs, and "Digital Arrest" extortion).

**PrivacyShield AI** bridges the technical comprehension gap by providing:
1. **Zero-SSRF Suspicious Link Inspector:** Lexical decomposition, punycode homoglyph detection, abusive TLD checking, and credential-trap classification without ever fetching or visiting the destination URL.
2. **Interactive App Permission Risk Auditor:** Transparent translations of Android/iOS permissions with immediate alerts on **Toxic Combinations** (e.g. Accessibility + SMS = Automated OTP Theft).
3. **Transparent Privacy Quotient (PQ) Score:** A gamified 7-question assessment delivering an explainable 0–100 score and a personalized remediation checklist.
4. **India Cyber Scam Defense Hub:** Practical playbooks on active domestic threat vectors and enforceable statutory rights under the DPDP Act 2023.
5. **Local-First Privacy by Design:** 100% client-safe execution, zero data harvesting, and exportable markdown audit reports.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run Automated Test Suite
Verify that all 7 security heuristic rules, toxic permission combinations, and scoring algorithms pass:
```bash
npm test
```

### 3. Run Development Server (Frontend + Backend)
To run the full-stack server (serving both the REST API and the React SPA on a single port):
```bash
npm run server
```
Then open your browser at **`http://localhost:5000`**.

For active frontend development with Hot Module Replacement (HMR):
```bash
npm run dev
```
Then visit **`http://localhost:3000`**.

---

## 🛠️ Project Structure

```text
hack1/
├── backend/
│   ├── threatEngine.js        # Zero-SSRF URL heuristic analyzer & punycode detector
│   ├── permissionsData.js     # Android/iOS permission registry & toxic combos
│   ├── quizData.js            # 7-Question PQ assessment & weighted scoring logic
│   ├── scamsData.js           # India threat playbooks & DPDP Act 2023 summaries
│   ├── server.js              # Express REST API & unified static file server
│   └── threatEngine.test.js   # Automated unit and integration test suite
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Sticky navigation, live threat stats, 1930 hotline
│   │   ├── UrlScanner.jsx     # Suspicious link analyzer with sample pills
│   │   ├── PermissionAuditor.jsx # Interactive permission selector & toxic combo alert
│   │   ├── PrivacyQuiz.jsx    # Privacy Quotient quiz & prioritized action checklist
│   │   ├── ScamDefenseHub.jsx # India Scam Playbooks & DPDP Act 2023 rights
│   │   └── ReportModal.jsx    # Local-first printable/downloadable audit summary
│   ├── data/
│   │   └── fallbackData.js    # Client-side fallback data for offline resilience
│   ├── App.jsx                # Root layout & session localStorage management
│   ├── main.jsx               # React entry point
│   └── index.css              # Custom cybersecurity design system (glassmorphism)
├── dist/                      # Pre-built production bundle
├── package.json               # Dependencies and npm scripts
├── vite.config.js             # Vite configuration with API proxy
└── README.md                  # Comprehensive project documentation
```

---

## 🔒 Security & Privacy Guarantees
- **Zero SSRF (Server-Side Request Forgery):** The backend never connects to user-submitted links. Inspection is purely structural and heuristic.
- **Zero Credential Harvesting:** PrivacyShield AI never requests passwords, PINs, OTPs, or phone numbers.
- **Advisory Rating Clarity:** Clearly communicates that link inspection is heuristic and an unflagged link is never a 100% guarantee of safety.
- **National Emergency Integration:** Features direct access to the **1930 National Cyber Fraud Helpline** and `cybercrime.gov.in`.
