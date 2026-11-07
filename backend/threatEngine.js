/**
 * Safe Threat Intelligence & URL Heuristic Analysis Engine
 * 
 * SECURITY MANDATE:
 * - NEVER perform an HTTP request / fetch to the user-submitted URL (Prevents SSRF & malware execution).
 * - Analyze strictly via lexical decomposition, punycode/IDN inspection, IP resolution syntax,
 *   known high-risk TLD frequency, phishing path entropy, and synthetic reputation heuristics.
 * - Always label results as ADVISORY rather than a guarantee of safety.
 */

// Suspicious / high-abuse Top Level Domains (frequently exploited for disposable phishing campaigns)
const HIGH_RISK_TLDS = new Set([
  'top', 'xyz', 'click', 'buzz', 'club', 'work', 'link', 'gq', 'cf', 'tk', 'ml', 'ga', 
  'rest', 'surf', 'zip', 'mov', 'cam', 'sbs', 'bond', 'fit', 'country'
]);

// High-value brand spoofing targets commonly targeted in credential harvesting
const TARGETED_BRANDS = [
  'sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'gpay', 'google', 
  'apple', 'microsoft', 'netflix', 'amazon', 'aadhaar', 'uidai', 'incometax', 
  'epfo', 'cybercrime', 'digilocker', 'irctc', 'whatsapp', 'instagram', 'facebook'
];

// Suspicious lexical tokens in subdomains/paths
const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'update', 'secure', 'account',
  'banking', 'wallet', 'reward', 'cashback', 'lottery', 'bonus', 'kyc', 
  'pan-link', 'aadhaar-link', 'sim-block', 'refund', 'unfreeze', 'gift', 'free'
];

// Synthetic / Known malicious demonstration indicators (for safe hackathon validation)
const SYNTHETIC_THREAT_DATABASE = [
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

/**
 * Sanitizes and normalizes an input URL candidate safely.
 */
function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Please enter a valid URL.');
  }

  let trimmed = rawUrl.trim();

  // Guard against javascript: or data: URIs
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) {
    throw new Error('Potentially harmful URI protocol detected. Only HTTP/HTTPS URLs are permitted.');
  }

  // Prepend https:// if protocol is missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (err) {
    throw new Error('Invalid URL format. Please ensure proper domain syntax (e.g., example.com).');
  }

  return parsed;
}

/**
 * Detects if hostname uses Punycode / IDN Homograph obfuscation
 */
function checkHomographPunycode(hostname) {
  // Check for Punycode prefix
  if (hostname.includes('xn--')) {
    return {
      flagged: true,
      reason: 'Punycode (Internationalized Domain Name) detected. Attackers use this to mimic legitimate characters with lookalike Unicode symbols (homograph spoofing).'
    };
  }

  // Check for non-ASCII characters directly in hostname
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(hostname)) {
    return {
      flagged: true,
      reason: 'Non-ASCII Unicode characters found in hostname. This is a common homoglyph deception technique.'
    };
  }

  return { flagged: false };
}

/**
 * Detects if the hostname is a raw IP address (IPv4 or IPv6)
 */
function checkIpHost(hostname) {
  // IPv4 regex pattern
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    return {
      flagged: true,
      reason: 'Host is a direct raw IPv4 address rather than a registered domain name. Legitimate consumer services rarely ask users to browse raw IP addresses.'
    };
  }

  // IPv6 check
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    return {
      flagged: true,
      reason: 'Host is a raw IPv6 address. This frequently indicates evasion of domain-name reputation blacklists.'
    };
  }

  return { flagged: false };
}

/**
 * Analyzes Top-Level Domain (TLD) risk
 */
function checkTld(hostname) {
  const parts = hostname.split('.');
  if (parts.length < 2) return { flagged: false };

  const tld = parts[parts.length - 1].toLowerCase();
  if (HIGH_RISK_TLDS.has(tld)) {
    return {
      flagged: true,
      tld: `.${tld}`,
      reason: `Domain uses '.${tld}', which is statistically associated with high rates of disposable fraud, phishing, or malware campaigns.`
    };
  }

  return { flagged: false, tld: `.${tld}` };
}

/**
 * Inspects subdomains for suspicious depth and brand spoofing
 */
function checkSubdomainsAndBrands(hostname) {
  const parts = hostname.split('.');
  const findings = [];

  // Deep subdomain nesting (e.g. login.sbi.com.attacker-controlled.net)
  if (parts.length > 3) {
    findings.push({
      flagged: true,
      weight: 15,
      reason: `Excessive subdomain nesting detected (${parts.length} domain parts). Scammers often place familiar brand names into subdomains to trick mobile viewers where URL bars are truncated.`
    });
  }

  // Check if a prominent brand appears in a subdomain while the root domain belongs to someone else
  const mainDomain = parts.slice(-2).join('.').toLowerCase();
  for (const brand of TARGETED_BRANDS) {
    if (hostname.toLowerCase().includes(brand) && !mainDomain.includes(brand)) {
      findings.push({
        flagged: true,
        weight: 35,
        reason: `Targeted brand keyword '${brand.toUpperCase()}' detected in subdomain, but main domain is '${mainDomain}'. This is a classic brand impersonation pattern.`
      });
      break;
    }
  }

  return findings;
}

/**
 * Inspects pathname and query string for sensitive keyword traps
 */
function checkPathAndQuery(pathname, search) {
  const findings = [];
  const combined = (pathname + search).toLowerCase();

  const detectedKeywords = SUSPICIOUS_KEYWORDS.filter(kw => combined.includes(kw));
  if (detectedKeywords.length >= 2) {
    findings.push({
      flagged: true,
      weight: 20,
      reason: `Multiple high-urgency keywords detected in URL path (${detectedKeywords.slice(0, 3).join(', ')}). Phishing lures frequently simulate account locks, rewards, or urgent verification.`
    });
  }

  // Embedded redirect URL parameter detection (open redirect lure)
  if (/[?&](redirect|url|dest|next|return|target)=https?:\/\//i.test(search)) {
    findings.push({
      flagged: true,
      weight: 25,
      reason: 'Potential open-redirect parameter detected. This technique can abuse legitimate domain trust to redirect victims to malicious secondary sites.'
    });
  }

  return findings;
}

/**
 * Core analysis engine that aggregates heuristics and synthetic reputation data.
 */
function analyzeUrlThreat(inputUrl, options = {}) {
  const parsed = normalizeUrl(inputUrl);
  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol;
  const pathname = parsed.pathname;
  const search = parsed.search;

  const riskFactors = [];
  let riskScore = 0; // 0 = Clean / Low Risk, 100 = Critical Threat

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

  // 2. Protocol check
  if (protocol === 'http:') {
    riskFactors.push({
      category: 'Insecure Transmission',
      severity: 'MEDIUM',
      details: 'URL uses unencrypted HTTP. Any credentials or personal data entered can be intercepted in transit on public Wi-Fi.'
    });
    riskScore += 15;
  }

  // 3. IP host check
  const ipCheck = checkIpHost(hostname);
  if (ipCheck.flagged) {
    riskFactors.push({
      category: 'Direct IP Hostname',
      severity: 'HIGH',
      details: ipCheck.reason
    });
    riskScore += 30;
  }

  // 4. Punycode / Homograph check
  const homograph = checkHomographPunycode(hostname);
  if (homograph.flagged) {
    riskFactors.push({
      category: 'Homograph / Punycode Deception',
      severity: 'HIGH',
      details: homograph.reason
    });
    riskScore += 35;
  }

  // 5. TLD Risk check
  const tldCheck = checkTld(hostname);
  if (tldCheck.flagged) {
    riskFactors.push({
      category: 'High-Abuse TLD',
      severity: 'MEDIUM',
      details: tldCheck.reason
    });
    riskScore += 20;
  }

  // 6. Subdomain & Brand Spoofing check
  const subFindings = checkSubdomainsAndBrands(hostname);
  for (const f of subFindings) {
    riskFactors.push({
      category: 'Domain Structure Anomaly',
      severity: f.weight >= 30 ? 'HIGH' : 'MEDIUM',
      details: f.reason
    });
    riskScore += f.weight;
  }

  // 7. Path and Query heuristics
  const pathFindings = checkPathAndQuery(pathname, search);
  for (const f of pathFindings) {
    riskFactors.push({
      category: 'Credential Harvesting Pattern',
      severity: f.weight >= 25 ? 'HIGH' : 'MEDIUM',
      details: f.reason
    });
    riskScore += f.weight;
  }

  // Normalize final score
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
    submittedUrl: inputUrl,
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

module.exports = {
  analyzeUrlThreat,
  SYNTHETIC_THREAT_DATABASE
};
