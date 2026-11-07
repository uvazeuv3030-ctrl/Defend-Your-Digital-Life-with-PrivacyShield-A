import React, { useState } from 'react';
import { HelpCircle, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, ShieldCheck, Sparkles, Award } from 'lucide-react';

const QUIZ_QUESTIONS = [
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

export default function PrivacyQuiz({ onQuizCompleted }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const handleSelectOption = (optIndex) => {
    const qId = QUIZ_QUESTIONS[currentIdx].id;
    const newAnswers = { ...answers, [qId]: optIndex };
    setAnswers(newAnswers);

    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (finalAnswers) => {
    let score = 0;
    const feedback = [];
    const actionPlan = [];

    QUIZ_QUESTIONS.forEach(q => {
      const chosenIdx = finalAnswers[q.id];
      if (chosenIdx !== undefined) {
        const chosen = q.options[chosenIdx];
        score += chosen.score;
        feedback.push({
          category: q.category,
          tip: chosen.tip,
          scoreEarned: chosen.score
        });

        if (chosen.score < 10) {
          if (q.category === 'Authentication') {
            actionPlan.push({ priority: 'HIGH', task: 'Setup Two-Factor Authentication on primary email & WhatsApp.', time: '5m' });
          } else if (q.category === 'App Sideloading & Installation') {
            actionPlan.push({ priority: 'CRITICAL', task: 'Turn off "Install Unknown Apps" in phone settings.', time: '2m' });
          } else if (q.category === 'UPI & Payment Protection') {
            actionPlan.push({ priority: 'CRITICAL', task: 'Never enter UPI PIN to receive funds. PIN is debit-only.', time: 'Instant' });
          } else if (q.category === 'Public Wi-Fi & Network Security') {
            actionPlan.push({ priority: 'MEDIUM', task: 'Avoid public unencrypted Wi-Fi for sensitive activities.', time: 'Always' });
          }
        }
      }
    });

    let tier = 'CRITICAL_RISK';
    let badgeColor = '#ef4444';
    let title = 'Vulnerable Digital Footprint';

    if (score >= 80) {
      tier = 'PRIVACY_GUARDIAN';
      badgeColor = '#10b981';
      title = 'Privacy Guardian (High Hygiene)';
    } else if (score >= 60) {
      tier = 'MODERATE_HYGIENE';
      badgeColor = '#38bdf8';
      title = 'Moderate Hygiene (Actionable Gaps)';
    } else if (score >= 40) {
      tier = 'ELEVATED_RISK';
      badgeColor = '#f59e0b';
      title = 'Elevated Risk Exposure';
    }

    const evaluation = {
      score,
      maxScore: 100,
      tier,
      badgeColor,
      title,
      actionPlan: actionPlan.length > 0 ? actionPlan : [
        { priority: 'LOW', task: 'Maintain proactive quarterly permission audits.', time: '2m' }
      ]
    };

    setScoreResult(evaluation);
    setCompleted(true);
    if (onQuizCompleted) {
      onQuizCompleted(evaluation);
    }
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setCompleted(false);
    setScoreResult(null);
  };

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  return (
    <div className="card-glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
        <HelpCircle size={22} color="var(--accent-cyan)" />
        <h2>Digital Privacy Quotient (PQ) Assessment</h2>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
        Evaluate your daily habits across authentication, app permissions, UPI scams, and legal rights under India’s DPDP Act 2023.
      </p>

      {!completed ? (
        <div>
          {/* Progress bar */}
          <div className="quiz-stepper">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', color: 'var(--accent-cyan)' }}>
              Category: {currentQ.category}
            </span>
          </div>

          <div className="risk-meter-bar" style={{ marginBottom: '1.75rem' }}>
            <div 
              className="risk-meter-fill" 
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`, background: 'var(--accent-cyan)' }}
            />
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
            {currentQ.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQ.options.map((opt, oIdx) => (
              <div
                key={oIdx}
                className="quiz-option-card"
                onClick={() => handleSelectOption(oIdx)}
              >
                <div style={{ fontSize: '0.95rem', color: '#f1f5f9', lineHeight: 1.5 }}>
                  {opt.text}
                </div>
                <ArrowRight size={18} color="var(--text-dim)" style={{ flexShrink: 0 }} />
              </div>
            ))}
          </div>

          {currentIdx > 0 && (
            <button
              className="btn-secondary"
              style={{ marginTop: '1.25rem', fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
              onClick={() => setCurrentIdx(currentIdx - 1)}
            >
              Previous Question
            </button>
          )}
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <div className="score-gauge-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: scoreResult.badgeColor, fontWeight: 700, fontSize: '0.95rem' }}>
              <Award size={20} />
              <span>Assessment Completed</span>
            </div>
            <div className="score-big" style={{ color: scoreResult.badgeColor }}>
              {scoreResult.score}<span style={{ fontSize: '1.8rem', color: 'var(--text-dim)' }}>/100</span>
            </div>
            <h3 style={{ marginTop: '0.75rem', fontSize: '1.4rem' }}>
              {scoreResult.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', textAlign: 'center', marginTop: '0.35rem' }}>
              {scoreResult.score >= 80 ? 'You exhibit strong proactive security hygiene and awareness of modern threat vectors.' : 'You have critical exposure points that could leave you vulnerable to smishing and credential compromise.'}
            </p>
          </div>

          <h4 style={{ fontSize: '1.1rem', margin: '1.5rem 0 0.85rem' }}>
            Your Tailored Priority Action Checklist:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {scoreResult.actionPlan.map((act, aIdx) => (
              <div key={aIdx} className="finding-item" style={{ borderLeft: `3px solid ${act.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b'}` }}>
                <CheckCircle size={18} color={act.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b'} className="finding-icon" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: act.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b' }}>
                      [{act.priority} PRIORITY]
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Est: {act.time}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {act.task}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={restartQuiz}>
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
