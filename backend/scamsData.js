/**
 * India Scam Defense Hub & DPDP Act Reference Data
 * 
 * Educates users on high-prevalence Indian cyber attacks,
 * emergency steps, and statutory rights under the DPDP Act 2023.
 */

const SCAM_PLAYBOOKS = [
  {
    id: 'digital_arrest',
    title: '"Digital Arrest" & Fake Police Video Scam',
    threatCategory: 'Extortion & Impersonation',
    riskLevel: 'CRITICAL',
    badgeColor: 'red',
    summary: 'Fraudsters impersonate CBI, Police, ED, or Customs officers over Skype/WhatsApp video calls claiming your Aadhaar or SIM was used in money laundering, threatening immediate arrest unless you transfer funds for "verification".',
    scamIndicators: [
      'Caller demands you stay on continuous video call in a closed room ("digital custody").',
      'They show fake arrest warrants, CBI letterheads, and uniformed actors in mock police station setups.',
      'They demand you transfer your entire savings into a "government escrow/RBI account" for auditing.'
    ],
    truthAndDefense: [
      'FACT: Indian Law and Police procedures DO NOT have any concept called "Digital Arrest". No police officer can arrest or interrogate you over video call.',
      'CBI, ED, and Police NEVER request money transfers for verification.',
      'IMMEDIATE ACTION: Disconnect the call immediately. Report the phone number to the National Cybercrime Portal (1930) or cybercrime.gov.in.'
    ],
    officialGuidance: 'MHA / I4C Advisory (2024): Disconnect and report to 1930 immediately. Indian law enforcement conducts summons in person, never over WhatsApp video.'
  },
  {
    id: 'upi_reverse_charge',
    title: 'UPI "Receive Money" QR Code Fraud',
    threatCategory: 'Financial Redirection',
    riskLevel: 'CRITICAL',
    badgeColor: 'red',
    summary: 'Commonly targeted on OLX, WhatsApp, or buyer-seller portals. The scammer poses as an eager buyer, offers to pay an advance, and sends a QR code or "Collect Request" via Google Pay / PhonePe / Paytm.',
    scamIndicators: [
      'Buyer insists on paying only via QR code or payment link rather than direct bank NEFT/IMPS.',
      'Claims: "Scan this QR code to claim your payment" or "Enter your PIN to verify your account to receive ₹10,000".',
      'Refuses to meet in person or inspect goods.'
    ],
    truthAndDefense: [
      'GOLDEN RULE: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money.',
      'Scanning a QR code and entering your PIN ALWAYS debits money from your account.',
      'IMMEDIATE ACTION: If you accidentally entered your PIN, call 1930 within the "Golden Hour" (first 2 hours) to freeze the transaction before the mule account is emptied.'
    ],
    officialGuidance: 'NPCI & RBI Consumer Alert: Entering a UPI PIN is exclusively for authorizing an outgoing transfer.'
  },
  {
    id: 'apk_sideloading',
    title: 'Fake Electricity Bill / Bank KYC APK Scam',
    threatCategory: 'Mobile Malware & SMS Theft',
    riskLevel: 'HIGH',
    badgeColor: 'amber',
    summary: 'You receive an urgent SMS: "Dear customer, your electricity power will be disconnected at 9:30 PM due to unpaid bill. Download our app to update: http://.../PowerPay.apk".',
    scamIndicators: [
      'Message arrives from an individual 10-digit mobile number instead of an official sender ID (e.g. from +91-98xxxxxx instead of VM-BESCOM or DZ-TNEB).',
      'Contains a link ending in .apk or directs to an unofficial download website.',
      'Once installed, the app requests "Accessibility" and "SMS" permissions.'
    ],
    truthAndDefense: [
      'FACT: Utility providers and banks NEVER distribute official software via WhatsApp APK links.',
      'Malicious APKs read your incoming OTPs and forward them to fraud command servers.',
      'IMMEDIATE ACTION: Do not download. If downloaded, switch phone to Airplane Mode immediately, go to Settings > Apps, and uninstall the suspicious file.'
    ],
    officialGuidance: 'CERT-In Vulnerability Note & Advisory on Android Sideloading Malwares (Cerberus/SOVA variants targeting Indian banks).'
  },
  {
    id: 'telegram_part_time_job',
    title: 'Work-From-Home / YouTube Like & Earn Scam',
    threatCategory: 'Task & Investment Fraud',
    riskLevel: 'HIGH',
    badgeColor: 'amber',
    summary: 'Unsolicited messages on WhatsApp offering ₹3,000–₹8,000/day for liking YouTube videos, reviewing hotels on Google Maps, or rating products on crypto portals.',
    scamIndicators: [
      'Initial "tasks" yield small real payouts (₹150–₹500) to build trust.',
      'You are moved to a Telegram group where "mentors" ask you to deposit money into a "prepaid merchant task" to unlock higher commissions.',
      'When you attempt to withdraw, they demand additional "tax fees" or "clearance deposits" and freeze your balance.'
    ],
    truthAndDefense: [
      'FACT: Legitimate corporate employers never recruit through random WhatsApp messages asking you to like videos.',
      'The initial small payout is bait designed to steal lakhs in subsequent "investment" rounds.',
      'IMMEDIATE ACTION: Do not send any funds. Report the Telegram group and UPI IDs to cybercrime.gov.in.'
    ],
    officialGuidance: 'Indian Cyber Crime Coordination Centre (I4C) Advisory on Fake Part-Time Job Schemes.'
  }
];

const DPDP_ACT_RIGHTS = [
  {
    title: 'Right to Notice and Clear Consent',
    section: 'Section 5 & 6',
    explanation: 'Companies must give you a separate, plain-English notice explaining exactly what data is collected and why. You can revoke this consent just as easily as giving it.'
  },
  {
    title: 'Right to Access & Summary',
    section: 'Section 11',
    explanation: 'You can demand any company operating in India provide a clear summary of all personal data they hold about you and the list of third parties they shared it with.'
  },
  {
    title: 'Right to Correction and Erasure ("Right to be Forgotten")',
    section: 'Section 12',
    explanation: 'You have the legal right to demand companies correct misleading data, complete partial data, or permanently erase your data once the original service is terminated.'
  },
  {
    title: 'Right to Grievance Redressal & Board Complaint',
    section: 'Section 13',
    explanation: 'If a company fails to protect your privacy or respond to your concerns within statutory deadlines, you can file a direct complaint before the Data Protection Board of India.'
  }
];

const EMERGENCY_RESOURCES = {
  nationalCyberHelpline: '1930',
  nationalPortal: 'https://cybercrime.gov.in',
  certInWebsite: 'https://www.cert-in.org.in',
  goldenHourTip: 'Reporting within the first 2 hours ("The Golden Hour") gives banks the highest chance of freezing mule accounts before funds are withdrawn at ATMs or converted to crypto.'
};

module.exports = {
  SCAM_PLAYBOOKS,
  DPDP_ACT_RIGHTS,
  EMERGENCY_RESOURCES
};
