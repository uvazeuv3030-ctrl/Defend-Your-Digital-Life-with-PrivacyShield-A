const assert = require('assert');
const { analyzeUrlThreat } = require('./threatEngine');
const { evaluatePermissions } = require('./permissionsData');
const { calculatePrivacyScore } = require('./quizData');

console.log('--- RUNNING PRIVACYSHIELD AI AUTOMATED TEST SUITE ---');

// Test 1: Legitimate safe URL
const cleanResult = analyzeUrlThreat('https://www.google.com/search');
assert.strictEqual(cleanResult.safetyRating, 'SAFE', 'Legitimate URL should be rated SAFE');
assert.strictEqual(cleanResult.riskScore, 0, 'Clean URL should have 0 risk score');
console.log('✓ Test 1 Passed: Legitimate clean URL parsed correctly as SAFE (0/100)');

// Test 2: High-risk TLD & Phishing keywords
const phishResult = analyzeUrlThreat('http://sbi-kyc-update-alert.xyz/verify-login');
assert.strictEqual(phishResult.safetyRating, 'DANGEROUS', 'High-risk phish should be rated DANGEROUS');
assert(phishResult.riskScore >= 70, 'Phishing lure should score >= 70 risk');
console.log('✓ Test 2 Passed: Phishing lure with .xyz TLD & keywords detected as DANGEROUS');

// Test 3: Raw IP Host
const ipResult = analyzeUrlThreat('http://192.168.1.1/login');
assert(ipResult.riskFactors.some(f => f.category === 'Direct IP Hostname'), 'Raw IP host should be flagged');
console.log('✓ Test 3 Passed: Direct IP host flagged accurately');

// Test 4: Punycode / Homograph deception
const punyResult = analyzeUrlThreat('https://xn--appl-43d.com/auth');
assert(punyResult.riskFactors.some(f => f.category === 'Homograph / Punycode Deception'), 'Punycode should be flagged');
console.log('✓ Test 4 Passed: Punycode homograph attack detected');

// Test 5: Malformed input rejection
assert.throws(() => {
  analyzeUrlThreat('javascript:alert(1)');
}, /Potentially harmful URI protocol detected/, 'Harmful protocols must throw error');
console.log('✓ Test 5 Passed: Malicious URI protocols rejected safely');

// Test 6: Toxic Permission Combination
const permResult = evaluatePermissions(['accessibility', 'sms_read'], 'utility');
assert(permResult.detectedCombos.length > 0, 'Accessibility + SMS should trigger toxic combo alert');
assert.strictEqual(permResult.grade, 'HIGH_DANGER', 'Toxic combo must produce HIGH_DANGER rating');
console.log('✓ Test 6 Passed: Toxic permission combo (Accessibility + SMS) correctly identified');

// Test 7: Privacy Quotient Scoring
const perfectQuiz = calculatePrivacyScore({
  q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0
});
assert.strictEqual(perfectQuiz.score, 100, 'All top options should yield 100/100 Privacy Quotient');
assert.strictEqual(perfectQuiz.tier, 'PRIVACY_GUARDIAN', '100 score should give PRIVACY_GUARDIAN tier');
console.log('✓ Test 7 Passed: Privacy Quotient quiz scoring accurately calibrated');

console.log('=====================================================');
console.log('ALL 7 SYSTEM TEST CASES PASSED WITH 100% SUCCESS RATE');
console.log('=====================================================');
