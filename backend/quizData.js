/**
 * Privacy Quotient (PQ) Assessment Engine
 * 
 * Provides an evidence-based, 7-question digital privacy assessment.
 * Generates transparent score calculation (0 - 100), risk tier,
 * and actionable personalized checklist based on identified vulnerabilities.
 */

const PRIVACY_QUESTIONS = [
  {
    id: 'q1',
    category: 'Authentication',
    question: 'How do you protect your primary personal email and social media accounts?',
    options: [
      { text: 'I use Two-Factor Authentication (Authenticator app or hardware key) with unique passwords.', score: 15, tip: 'Excellent! Authenticator apps protect you even if passwords are leaked in public database breaches.' },
      { text: 'I use SMS-based OTP verification with different passwords.', score: 10, tip: 'Good, but consider switching to an Authenticator app (like Google/Microsoft Authenticator) to prevent SIM-swap risks.' },
      { text: 'I use the same or similar passwords across multiple websites without two-factor codes.', score: 0, tip: 'Critical Risk: When one service gets breached, attackers use credential-stuffing tools to unlock all your other accounts.' }
    ]
  },
  {
    id: 'q2',
    category: 'App Sideloading & Installation',
    question: 'Where do you download mobile applications from?',
    options: [
      { text: 'Strictly from the official Google Play Store or Apple App Store.', score: 15, tip: 'Great practice. Official stores enforce automated security scans via Google Play Protect or Apple App Review.' },
      { text: 'Occasionally from APK links sent by friends on WhatsApp or Telegram channels.', score: 0, tip: 'Dangerous: Sideloaded APKs bypass security gates and are the primary source of banking trojans in India.' },
      { text: 'From alternative verified stores like F-Droid or Samsung Galaxy Store.', score: 12, tip: 'Acceptable if the repository is well-maintained, but avoid unvetted third-party mirrors.' }
    ]
  },
  {
    id: 'q3',
    category: 'Permissions & Device Hygiene',
    question: 'When a freshly installed app asks for Camera, Location, or Contacts, what is your reaction?',
    options: [
      { text: 'I carefully consider if the app really needs it and choose "Only while using the app".', score: 15, tip: 'Smart! Limiting permissions prevents background tracking and covert sensor activation.' },
      { text: 'I quickly tap "Allow" to get into the app without thinking much.', score: 2, tip: 'High Risk: Many adware and data-harvesting apps rely on permission fatigue to obtain full access.' },
      { text: 'I routinely review and revoke unused permissions in my device settings.', score: 15, tip: 'Outstanding proactive hygiene. Continue auditing permissions every month.' }
    ]
  },
  {
    id: 'q4',
    category: 'Public Wi-Fi & Network Security',
    question: 'How do you handle connecting to free Wi-Fi at airports, cafes, or railway stations?',
    options: [
      { text: 'I use mobile data instead, or connect through a trusted VPN and never do banking.', score: 15, tip: 'Safest choice. Public open Wi-Fi can be easily spoofed with "Evil Twin" hotspots to snoop on traffic.' },
      { text: 'I connect to any available free Wi-Fi and browse normally, including shopping.', score: 0, tip: 'Risky: Unencrypted Wi-Fi allows packet sniffing and DNS spoofing that can route you to fake portals.' },
      { text: 'I only connect if the Wi-Fi requires a password, but do not use a VPN.', score: 8, tip: 'Shared Wi-Fi passwords do not protect you from other connected users on the same local subnet.' }
    ]
  },
  {
    id: 'q5',
    category: 'Suspicious Links & Phishing Awareness',
    question: 'You receive an urgent message: "Your electricity connection will be disconnected tonight. Update bill immediately at bit.ly/power-upd". What do you do?',
    options: [
      { text: 'I ignore and block the number, and check directly through the official provider app or bill.', score: 15, tip: 'Correct! Urgency and shortened links (bit.ly, tinyurl) are hallmark psychological manipulation tactics.' },
      { text: 'I click the link to see what bill is pending, but stop if it asks for payment.', score: 3, tip: 'Warning: Merely clicking unknown links can expose your device IP, browser fingerprint, or trigger drive-by downloads.' },
      { text: 'I call the phone number mentioned in the SMS to ask what happened.', score: 2, tip: 'Do not call numbers provided in unsolicited alerts. Scammers impersonate customer care representatives.' }
    ]
  },
  {
    id: 'q6',
    category: 'UPI & Payment Protection',
    question: 'Someone on OLX or Facebook Marketplace wants to buy your item and sends you a QR code saying: "Scan this and enter your UPI PIN to receive money".',
    options: [
      { text: 'I refuse immediately! You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money.', score: 15, tip: 'Spot on! Entering your UPI PIN is solely for AUTHORIZING DEBITS from your bank account.' },
      { text: 'I scan the QR code to check if the payment goes through.', score: 0, tip: 'CRITICAL HAZARD: Scanning a QR code and entering your PIN will instantly deduct money from your account!' },
      { text: 'I ask them for their bank details instead.', score: 10, tip: 'Good caution, but remember to never entertain buyers insisting on QR codes for incoming transfers.' }
    ]
  },
  {
    id: 'q7',
    category: 'Legal Rights & DPDP Act Awareness',
    question: 'Under India\'s Digital Personal Data Protection (DPDP) Act, 2023, do you know what rights you possess?',
    options: [
      { text: 'Yes, I know I have the right to withdraw consent, demand data erasure, and complain to the Data Protection Board.', score: 10, tip: 'Empowered! You have legal statutory rights to stop apps from retaining your personal information.' },
      { text: 'I have heard of the law, but have no idea how it protects me in practice.', score: 5, tip: 'Good start. PrivacyShield AI provides clear templates to exercise your rights under DPDP Act 2023.' },
      { text: 'I did not know India had a data protection law.', score: 0, tip: 'Explore our DPDP Act guide below to learn how Indian law penalizes companies up to ₹250 Cr for data breaches.' }
    ]
  }
];

function calculatePrivacyScore(answers = {}) {
  let totalScore = 0;
  const maxPossible = 100;
  const feedbackList = [];

  PRIVACY_QUESTIONS.forEach(q => {
    const selectedIndex = answers[q.id];
    if (selectedIndex !== undefined && q.options[selectedIndex]) {
      const chosen = q.options[selectedIndex];
      totalScore += chosen.score;
      feedbackList.push({
        questionId: q.id,
        category: q.category,
        question: q.question,
        scoreEarned: chosen.score,
        tip: chosen.tip,
        isVulnerable: chosen.score < 10
      });
    } else {
      feedbackList.push({
        questionId: q.id,
        category: q.category,
        question: q.question,
        scoreEarned: 0,
        tip: 'Question skipped or unattempted.',
        isVulnerable: true
      });
    }
  });

  totalScore = Math.min(100, Math.max(0, totalScore));

  let tier = 'CRITICAL_RISK';
  let badge = 'red';
  let title = 'Vulnerable Digital Footprint';
  let overview = 'Your digital privacy posture has major exposures. Attackers could easily compromise accounts or mislead you with social engineering.';

  if (totalScore >= 80) {
    tier = 'PRIVACY_GUARDIAN';
    badge = 'emerald';
    title = 'Strong Digital Hygiene';
    overview = 'Excellent security practices! You exhibit proactive permission auditing, resilient authentication, and strong scam awareness.';
  } else if (totalScore >= 60) {
    tier = 'MODERATE_HYGIENE';
    badge = 'blue';
    title = 'Reasonable with Actionable Gaps';
    overview = 'You have good foundational intuition, but a few critical blindspots (e.g. UPI scams or permission audits) require attention.';
  } else if (totalScore >= 40) {
    tier = 'ELEVATED_RISK';
    badge = 'amber';
    title = 'Elevated Risk Exposure';
    overview = 'Multiple everyday habits leave your device and personal data susceptible to phishing, spyware, or data broker accumulation.';
  }

  // Generate personalized action recommendations
  const actionPlan = [];
  const vulnerableItems = feedbackList.filter(f => f.isVulnerable);

  if (vulnerableItems.some(i => i.category === 'Authentication')) {
    actionPlan.push({
      priority: 'HIGH',
      task: 'Enable Two-Factor Authentication via Authenticator App on primary Google/Apple and email accounts.',
      timeEstimate: '5 mins'
    });
  }
  if (vulnerableItems.some(i => i.category === 'App Sideloading & Installation')) {
    actionPlan.push({
      priority: 'CRITICAL',
      task: 'Disable "Install Unknown Apps" permission on WhatsApp and Chrome immediately to block drive-by APK malware.',
      timeEstimate: '2 mins'
    });
  }
  if (vulnerableItems.some(i => i.category === 'UPI & Payment Protection')) {
    actionPlan.push({
      priority: 'CRITICAL',
      task: 'Memorize the core UPI rule: You NEVER need to input your PIN to receive money into your account.',
      timeEstimate: 'Instant'
    });
  }
  if (vulnerableItems.some(i => i.category === 'Permissions & Device Hygiene')) {
    actionPlan.push({
      priority: 'MEDIUM',
      task: 'Open Device Settings > Privacy Manager and revoke background location access for all non-navigation apps.',
      timeEstimate: '4 mins'
    });
  }

  if (actionPlan.length === 0) {
    actionPlan.push({
      priority: 'LOW',
      task: 'Conduct a monthly privacy checkup and stay informed on new CERT-In scam advisories.',
      timeEstimate: '2 mins'
    });
  }

  return {
    score: totalScore,
    maxScore: maxPossible,
    tier,
    badge,
    title,
    overview,
    feedbackList,
    actionPlan,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  PRIVACY_QUESTIONS,
  calculatePrivacyScore
};
