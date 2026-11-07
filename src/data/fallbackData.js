/**
 * Client-Side Heuristic & Knowledge Fallback Data
 * Ensures 100% offline-first resilience for hackathon demonstrations.
 */

export const HIGH_RISK_TLDS = new Set([
  'top', 'xyz', 'click', 'buzz', 'club', 'work', 'link', 'gq', 'cf', 'tk', 'ml', 'ga', 
  'rest', 'surf', 'zip', 'mov', 'cam', 'sbs', 'bond', 'fit', 'country'
]);

export const TARGETED_BRANDS = [
  'sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'gpay', 'google', 
  'apple', 'microsoft', 'netflix', 'amazon', 'aadhaar', 'uidai', 'incometax', 
  'epfo', 'cybercrime', 'digilocker', 'irctc', 'whatsapp', 'instagram', 'facebook'
];

export const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'update', 'secure', 'account',
  'banking', 'wallet', 'reward', 'cashback', 'lottery', 'bonus', 'kyc', 
  'pan-link', 'aadhaar-link', 'sim-block', 'refund', 'unfreeze', 'gift', 'free'
];

export const SYNTHETIC_THREAT_DATABASE = [
  {
    pattern: 'testsafebrowsing.appspot.com',
    threatType: 'Malware Distribution Test Vector',
    severity: 'CRITICAL',
    description: 'Known public Google Safe Browsing test indicator for browser malware response validation.'
  },
  {
    pattern: 'malware.wicar.org',
    threatType: 'Exploit Test Vector',
    severity: 'CRITICAL',
    description: 'Standard safe industry malware test domain (EICAR-equivalent for web exploits).'
  },
  {
    pattern: 'sbi-kyc-update-alert.xyz',
    threatType: 'Phishing Credential Harvester',
    severity: 'CRITICAL',
    description: 'Simulated high-risk Indian banking KYC smishing lure targeting one-time credentials.'
  },
  {
    pattern: 'free-recharge-offer.click',
    threatType: 'Social Engineering Scam',
    severity: 'HIGH',
    description: 'Simulated WhatsApp viral forward phishing lure harvesting mobile numbers.'
  }
];

export function clientAnalyzeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Please enter a valid URL.');
  }

  let trimmed = rawUrl.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) {
    throw new Error('Potentially harmful URI protocol detected. Only HTTP/HTTPS URLs are permitted.');
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (e) {
    throw new Error('Invalid URL format. Please ensure proper domain syntax (e.g. example.com).');
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol;
  const pathname = parsed.pathname;
  const search = parsed.search;

  const riskFactors = [];
  let riskScore = 0;

  // 1. Synthetic reputation match
  for (const threat of SYNTHETIC_THREAT_DATABASE) {
    if (hostname.includes(threat.pattern)) {
      riskFactors.push({
        category: 'Threat Intelligence Match',
        severity: threat.severity,
        details: threat.description
      });
      riskScore = threat.severity === 'CRITICAL' ? 95 : 80;
    }
  }

  // 2. Protocol
  if (protocol === 'http:') {
    riskFactors.push({
      category: 'Insecure Transmission',
      severity: 'MEDIUM',
      details: 'URL uses unencrypted HTTP. Data entered can be intercepted in transit on public Wi-Fi.'
    });
    riskScore += 15;
  }

  // 3. Raw IP Host
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || (hostname.startsWith('[') && hostname.endsWith(']'))) {
    riskFactors.push({
      category: 'Direct IP Hostname',
      severity: 'HIGH',
      details: 'Host is a raw IP address rather than a domain name. Legitimate services do not ask users to browse raw IP addresses.'
    });
    riskScore += 30;
  }

  // 4. Punycode
  if (hostname.includes('xn--') || /[^\x00-\x7F]/.test(hostname)) {
    riskFactors.push({
      category: 'Homograph / Punycode Deception',
      severity: 'HIGH',
      details: 'Punycode or non-ASCII characters detected. Attackers use this to mimic letters with lookalike Unicode symbols.'
    });
    riskScore += 35;
  }

  // 5. TLD Risk
  const parts = hostname.split('.');
  const tld = parts[parts.length - 1];
  if (HIGH_RISK_TLDS.has(tld)) {
    riskFactors.push({
      category: 'High-Abuse TLD',
      severity: 'MEDIUM',
      details: `Domain uses '.${tld}', which is statistically associated with high rates of disposable fraud and phishing.`
    });
    riskScore += 20;
  }

  // 6. Subdomain & Brand Spoofing
  if (parts.length > 3) {
    riskFactors.push({
      category: 'Domain Structure Anomaly',
      severity: 'MEDIUM',
      details: `Excessive subdomain nesting (${parts.length} levels). Scammers often hide real domains behind familiar words.`
    });
    riskScore += 15;
  }

  const mainDomain = parts.slice(-2).join('.').toLowerCase();
  for (const brand of TARGETED_BRANDS) {
    if (hostname.includes(brand) && !mainDomain.includes(brand)) {
      riskFactors.push({
        category: 'Targeted Brand Spoofing',
        severity: 'HIGH',
        details: `Brand '${brand.toUpperCase()}' detected in subdomain, but main domain is '${mainDomain}'. This is a classic brand impersonation pattern.`
      });
      riskScore += 35;
      break;
    }
  }

  // 7. Path heuristics
  const combined = (pathname + search).toLowerCase();
  const detectedKeywords = SUSPICIOUS_KEYWORDS.filter(kw => combined.includes(kw));
  if (detectedKeywords.length >= 2) {
    riskFactors.push({
      category: 'Credential Harvesting Pattern',
      severity: 'MEDIUM',
      details: `High-urgency keywords detected in URL path (${detectedKeywords.slice(0, 3).join(', ')}). Phishing lures simulate urgent verification.`
    });
    riskScore += 20;
  }

  riskScore = Math.min(100, Math.max(0, riskScore));

  let safetyRating = 'SAFE';
  let badgeColor = 'green';
  let summary = 'No prominent deceptive heuristics or threat markers detected in URL structure.';

  if (riskScore >= 70) {
    safetyRating = 'DANGEROUS';
    badgeColor = 'red';
    summary = 'High probability of phishing, social engineering, or credential harvesting.';
  } else if (riskScore >= 35) {
    safetyRating = 'SUSPICIOUS';
    badgeColor = 'amber';
    summary = 'Multiple risk indicators detected. Exercise extreme caution; do not enter passwords or personal data.';
  } else if (riskScore > 0) {
    safetyRating = 'LOW_RISK';
    badgeColor = 'blue';
    summary = 'Minor advisory flags noted (e.g. unencrypted HTTP or high-frequency keywords).';
  }

  return {
    submittedUrl: rawUrl,
    parsed: {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      pathname: parsed.pathname,
      search: parsed.search || null
    },
    safetyRating,
    riskScore,
    badgeColor,
    summary,
    riskFactors,
    advisoryDisclaimer: 'Notice: URL inspection is advisory and based on structural heuristics and threat patterns. An unflagged link is never a 100% guarantee of safety.',
    timestamp: new Date().toISOString()
  };
}

export const FALLBACK_PERMISSIONS = [
  {
    id: 'accessibility',
    name: 'Accessibility Services',
    riskLevel: 'CRITICAL',
    badgeColor: 'red',
    laymanSummary: 'Allows an app to read EVERYTHING displayed on your screen and click buttons on your behalf.',
    legitimateUse: 'Screen readers for visually impaired users, automated accessibility tools.',
    maliciousAbuse: 'Banking trojans and spyware use this to silently bypass two-factor authentication, click "Allow" on permission prompts without your knowledge, and record sensitive passwords as you type them.',
    remediationSteps: {
      android: 'Settings > Accessibility > Installed Apps > Inspect unknown apps and toggle OFF.',
      ios: 'iOS does not allow third-party apps full screen-control accessibility privileges like Android.'
    }
  },
  {
    id: 'sms_read',
    name: 'Read SMS / One-Time Passwords',
    riskLevel: 'HIGH',
    badgeColor: 'red',
    laymanSummary: 'Enables an app to read all your incoming and archived SMS text messages.',
    legitimateUse: 'Default SMS messaging app, auto-filling OTP during account registration.',
    maliciousAbuse: 'Extracts one-time banking PINs, login codes, and personal financial transaction alerts to initiate unauthorized transfers.',
    remediationSteps: {
      android: 'Settings > Apps > Special App Access > SMS Apps, or Settings > Privacy > Permission Manager > SMS.',
      ios: 'Settings > Privacy & Security > Messages (iOS restricts full SMS reading to default iMessage).'
    }
  },
  {
    id: 'system_alert_window',
    name: 'Draw Over Other Apps (Overlay)',
    riskLevel: 'HIGH',
    badgeColor: 'amber',
    laymanSummary: 'Allows an app to display floating windows or invisible transparent covers over other open apps.',
    legitimateUse: 'Chat heads (Messenger), Truecaller caller ID popups, blue light filters.',
    maliciousAbuse: 'Clickjacking and phishing overlays: when you open your real banking app, the malware displays an identical fake login window on top to capture your credentials.',
    remediationSteps: {
      android: 'Settings > Apps > Special App Access > Display over other apps > Revoke for games, calculators, and flashlight apps.',
      ios: 'iOS strictly prohibits apps drawing over other applications.'
    }
  },
  {
    id: 'background_location',
    name: 'Background Location (Always Allow)',
    riskLevel: 'HIGH',
    badgeColor: 'amber',
    laymanSummary: 'Tracks your physical geographic coordinates 24/7, even when the app is completely closed.',
    legitimateUse: 'Emergency navigation, fitness running trackers, ride-hailing while waiting for a driver.',
    maliciousAbuse: 'Stalkerware builds complete personal schedules, home/work addresses, and daily routines, frequently sold to data brokers or used for surveillance.',
    remediationSteps: {
      android: 'Settings > Privacy > Permission Manager > Location > Switch from "Allow all the time" to "Allow only while using the app".',
      ios: 'Settings > Privacy & Security > Location Services > Set app to "While Using the App" or "Never", and turn off "Precise Location".'
    }
  },
  {
    id: 'camera_mic',
    name: 'Camera & Microphone',
    riskLevel: 'MEDIUM',
    badgeColor: 'blue',
    laymanSummary: 'Allows recording photos, video footage, and audio conversations.',
    legitimateUse: 'Video calling, camera apps, voice messaging.',
    maliciousAbuse: 'Covert eavesdropping on confidential meetings, room audio surveillance, and unauthorized photo capture.',
    remediationSteps: {
      android: 'Look for green dot indicator in the top right corner when mic/camera is active. Manage via Settings > Privacy > Permission Manager.',
      ios: 'Look for orange dot (mic) or green dot (camera) in the Dynamic Island / status bar. Revoke in Settings > Privacy & Security.'
    }
  },
  {
    id: 'request_install_packages',
    name: 'Install Unknown Apps (Sideloading)',
    riskLevel: 'CRITICAL',
    badgeColor: 'red',
    laymanSummary: 'Allows an app (like WhatsApp, Chrome, or Telegram) to download and install new applications outside Google Play Store.',
    legitimateUse: 'Enterprise deployment apps, open-source app stores like F-Droid.',
    maliciousAbuse: 'Primary vector for Indian cyber scams (e.g. fake "Electricity Bill Update.apk" or "SBI KYC.apk" forwarded on WhatsApp). Once permitted, it installs trojans directly.',
    remediationSteps: {
      android: 'Settings > Apps > Special App Access > Install Unknown Apps > Set ALL apps (especially WhatsApp, Chrome, Telegram) to "Not Allowed".',
      ios: 'Not applicable on standard iOS (sandboxed App Store).'
    }
  },
  {
    id: 'read_contacts',
    name: 'Read Contacts & Call Logs',
    riskLevel: 'MEDIUM',
    badgeColor: 'blue',
    laymanSummary: 'Reads your entire address book, phone numbers, and call history.',
    legitimateUse: 'Contact managers, dialer apps, payment apps syncing friend lists.',
    maliciousAbuse: 'Predatory lending apps in India upload contact books to remote servers and harass friends and family with abusive messages if payments are disputed.',
    remediationSteps: {
      android: 'Settings > Privacy > Permission Manager > Contacts > Revoke from games, photo editors, and loan apps.',
      ios: 'Settings > Privacy & Security > Contacts > Toggle off.'
    }
  }
];

export const FALLBACK_TOXIC_COMBINATIONS = [
  {
    permissions: ['accessibility', 'sms_read'],
    severity: 'CRITICAL',
    title: 'Automated 2FA / Banking OTP Hijacker',
    explanation: 'When an app possesses both Accessibility and SMS access, it can silently intercept banking OTPs and programmatically interact with financial apps without showing anything on screen.'
  },
  {
    permissions: ['system_alert_window', 'sms_read'],
    severity: 'CRITICAL',
    title: 'Phishing Overlay + Credential Interception',
    explanation: 'The app can pop up an invisible or spoofed credential-harvesting prompt over genuine apps, then capture incoming recovery codes via SMS.'
  },
  {
    permissions: ['request_install_packages', 'accessibility'],
    severity: 'CRITICAL',
    title: 'Malware Dropper & Device Takeover',
    explanation: 'The app can download arbitrary APK payloads and use Accessibility to automatically tap "Install" and grant itself all runtime permissions without user consent.'
  },
  {
    permissions: ['background_location', 'camera_mic'],
    severity: 'HIGH',
    title: 'Persistent Stalkerware / Covert Surveillance',
    explanation: 'Allows continuous real-world geolocation tracking combined with potential unauthorized audiovisual recording.'
  }
];

export const FALLBACK_SCAMS = [
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

export const FALLBACK_DPDP_RIGHTS = [
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
