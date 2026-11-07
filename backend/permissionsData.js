/**
 * App Permission Risk Registry & Toxic Combination Rules
 * 
 * Educates users on:
 * - What the permission actually allows
 * - Why a legitimate app needs it vs. how malware abuses it
 * - "Toxic Combinations" (e.g. Accessibility + Read SMS = automated banking OTP theft)
 * - Exact Android / iOS navigation paths to inspect and revoke
 */

const PERMISSIONS_DIRECTORY = [
  {
    id: 'accessibility',
    name: 'Accessibility Services',
    riskLevel: 'CRITICAL',
    badgeColor: 'red',
    technicalName: 'android.permission.BIND_ACCESSIBILITY_SERVICE',
    laymanSummary: 'Allows an app to read EVERYTHING displayed on your screen and click buttons on your behalf.',
    legitimateUse: 'Screen readers for visually impaired users, automated accessibility tools.',
    maliciousAbuse: 'Banking trojans and spyware use this to silently bypass two-factor authentication, click "Allow" on permission prompts without your knowledge, and record sensitive passwords as you type them.',
    toxicPartners: ['sms_read', 'system_alert_window'],
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
    technicalName: 'android.permission.READ_SMS',
    laymanSummary: 'Enables an app to read all your incoming and archived SMS text messages.',
    legitimateUse: 'Default SMS messaging app, auto-filling OTP during account registration.',
    maliciousAbuse: 'Extracts one-time banking PINs, login codes, and personal financial transaction alerts to initiate unauthorized transfers.',
    toxicPartners: ['accessibility', 'system_alert_window', 'internet'],
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
    technicalName: 'android.permission.SYSTEM_ALERT_WINDOW',
    laymanSummary: 'Allows an app to display floating windows or invisible transparent covers over other open apps.',
    legitimateUse: 'Chat heads (Messenger), Truecaller caller ID popups, blue light filters.',
    maliciousAbuse: 'Clickjacking and phishing overlays: when you open your real banking app, the malware displays an identical fake login window on top to capture your credentials.',
    toxicPartners: ['sms_read', 'accessibility'],
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
    technicalName: 'android.permission.ACCESS_BACKGROUND_LOCATION',
    laymanSummary: 'Tracks your physical geographic coordinates 24/7, even when the app is completely closed.',
    legitimateUse: 'Emergency navigation, fitness running trackers, ride-hailing while waiting for a driver.',
    maliciousAbuse: 'Stalkerware builds complete personal schedules, home/work addresses, and daily routines, frequently sold to data brokers or used for surveillance.',
    toxicPartners: ['camera', 'microphone'],
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
    technicalName: 'android.permission.CAMERA / RECORD_AUDIO',
    laymanSummary: 'Allows recording photos, video footage, and audio conversations.',
    legitimateUse: 'Video calling, camera apps, voice messaging.',
    maliciousAbuse: 'Covert eavesdropping on confidential meetings, room audio surveillance, and unauthorized photo capture.',
    toxicPartners: ['background_location', 'read_contacts'],
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
    technicalName: 'android.permission.REQUEST_INSTALL_PACKAGES',
    laymanSummary: 'Allows an app (like WhatsApp, Chrome, or Telegram) to download and install new applications outside Google Play Store.',
    legitimateUse: 'Enterprise deployment apps, open-source app stores like F-Droid.',
    maliciousAbuse: 'Primary vector for Indian cyber scams (e.g. fake "Electricity Bill Update.apk" or "SBI KYC.apk" forwarded on WhatsApp). Once permitted, it installs trojans directly.',
    toxicPartners: ['sms_read', 'accessibility'],
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
    technicalName: 'android.permission.READ_CONTACTS / READ_CALL_LOG',
    laymanSummary: 'Reads your entire address book, phone numbers, and call history.',
    legitimateUse: 'Contact managers, dialer apps, payment apps syncing friend lists.',
    maliciousAbuse: 'Predatory lending apps in India upload contact books to remote servers and harass friends and family with abusive messages if payments are disputed.',
    toxicPartners: ['sms_read'],
    remediationSteps: {
      android: 'Settings > Privacy > Permission Manager > Contacts > Revoke from games, photo editors, and loan apps.',
      ios: 'Settings > Privacy & Security > Contacts > Toggle off.'
    }
  }
];

// Toxic Permission Combinations that represent compounded risk
const TOXIC_COMBINATIONS = [
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

function evaluatePermissions(selectedPermissionIds = [], appCategory = 'general') {
  const selectedSet = new Set(selectedPermissionIds);
  const matchedPermissions = PERMISSIONS_DIRECTORY.filter(p => selectedSet.has(p.id));

  // Detect toxic combinations
  const detectedCombos = [];
  for (const combo of TOXIC_COMBINATIONS) {
    const hasAll = combo.permissions.every(pid => selectedSet.has(pid));
    if (hasAll) {
      detectedCombos.push(combo);
    }
  }

  // Calculate score (0 to 100 risk)
  let riskScore = 0;
  matchedPermissions.forEach(p => {
    if (p.riskLevel === 'CRITICAL') riskScore += 35;
    else if (p.riskLevel === 'HIGH') riskScore += 20;
    else if (p.riskLevel === 'MEDIUM') riskScore += 10;
  });

  if (detectedCombos.length > 0) {
    riskScore += detectedCombos.length * 20;
  }

  riskScore = Math.min(100, Math.max(0, riskScore));

  let grade = 'LOW_RISK';
  if (riskScore >= 70) grade = 'HIGH_DANGER';
  else if (riskScore >= 35) grade = 'SUSPICIOUS';

  return {
    selectedCount: matchedPermissions.length,
    matchedPermissions,
    detectedCombos,
    riskScore,
    grade,
    categoryAdvice: getCategoryAdvice(appCategory, selectedSet)
  };
}

function getCategoryAdvice(category, selectedSet) {
  if (category === 'utility' && (selectedSet.has('sms_read') || selectedSet.has('read_contacts'))) {
    return 'Red Flag: A utility app (like a calculator, cleaner, or flashlight) has zero functional justification for SMS or Contacts access.';
  }
  if (category === 'game' && selectedSet.has('background_location')) {
    return 'Warning: Casual games do not require background 24/7 location tracking.';
  }
  return 'Review each permission individually. Always prefer "Allow only while using the app" over "Allow all the time".';
}

module.exports = {
  PERMISSIONS_DIRECTORY,
  TOXIC_COMBINATIONS,
  evaluatePermissions
};
