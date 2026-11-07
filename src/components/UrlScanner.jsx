import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, AlertCircle, ArrowRight, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { clientAnalyzeUrl } from '../data/fallbackData';

const SAMPLE_URLS = [
  { label: 'Safe Banking', url: 'https://www.onlinesbi.sbi' },
  { label: 'Simulated KYC Phish', url: 'http://sbi-kyc-update-alert.xyz/verify-pan' },
  { label: 'Homograph Spoof', url: 'https://xn--appl-43d.com/login' },
  { label: 'Raw IP Host', url: 'http://185.190.140.22/secure/banking' },
  { label: 'SafeBrowsing Test', url: 'http://testsafebrowsing.appspot.com/s/malware.html' }
];

export default function UrlScanner({ onScanComplete }) {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = async (urlToScan) => {
    const target = (urlToScan || inputUrl).trim();
    if (!target) {
      setErrorMsg('Please enter a web address or link to analyze.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      // Attempt backend API call first
      let analysisData = null;
      try {
        const response = await fetch('/api/analyze-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: target })
        });
        if (response.ok) {
          analysisData = await response.json();
        }
      } catch (networkErr) {
        // Fall back to client heuristic engine if server is unreachable
        console.warn('Backend unavailable, running client-side heuristic engine:', networkErr);
      }

      // If backend was not reached or returned an error, run client analyzer
      if (!analysisData) {
        analysisData = clientAnalyzeUrl(target);
      }

      setResult(analysisData);
      if (onScanComplete) {
        onScanComplete(analysisData);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to inspect link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sample) => {
    setInputUrl(sample.url);
    handleScan(sample.url);
  };

  return (
    <div className="card-glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
        <Sparkles size={20} color="var(--accent-cyan)" />
        <h2>Suspicious Link & Phishing Inspector</h2>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
        Inspect suspicious links sent via SMS, WhatsApp, or email <strong>without visiting them</strong>. 
        Our zero-SSRF engine identifies lookalike domains, punycode spoofing, and credential traps safely.
      </p>

      <form 
        onSubmit={(e) => { e.preventDefault(); handleScan(); }}
        className="input-group"
      >
        <input
          type="text"
          className="text-input"
          placeholder="Paste suspicious link here (e.g. sbi-kyc-update.xyz or bit.ly/offer)..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          <Search size={18} />
          <span>{loading ? 'Inspecting...' : 'Analyze Safely'}</span>
        </button>
      </form>

      {errorMsg && (
        <div style={{ color: '#ef4444', marginTop: '0.85rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="quick-samples">
        <span className="quick-sample-label">Try test cases:</span>
        {SAMPLE_URLS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            className="sample-chip"
            onClick={() => handleSampleClick(s)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {result && (
        <div className={`result-box ${result.badgeColor === 'red' ? 'danger' : result.badgeColor === 'amber' ? 'amber' : 'safe'}`}>
          <div className="result-header">
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Inspection Verdict
              </div>
              <h3 style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>
                {result.safetyRating === 'DANGEROUS' && 'High Threat Detected'}
                {result.safetyRating === 'SUSPICIOUS' && 'Caution: Suspicious Indicators'}
                {result.safetyRating === 'LOW_RISK' && 'Low Risk / Advisory Flags'}
                {result.safetyRating === 'SAFE' && 'Clean / No Known Threats'}
              </h3>
            </div>

            <div className={`rating-badge ${result.badgeColor === 'red' ? 'danger' : result.badgeColor === 'amber' ? 'amber' : 'safe'}`}>
              {result.badgeColor === 'red' && <ShieldAlert size={16} />}
              {result.badgeColor === 'amber' && <AlertCircle size={16} />}
              {result.badgeColor === 'green' && <ShieldCheck size={16} />}
              <span>{result.safetyRating} (Risk: {result.riskScore}/100)</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            {result.summary}
          </p>

          <div className="risk-meter-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
              <span>Threat Probability</span>
              <span>{result.riskScore}%</span>
            </div>
            <div className="risk-meter-bar">
              <div 
                className="risk-meter-fill"
                style={{ 
                  width: `${result.riskScore}%`,
                  background: result.badgeColor === 'red' ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : result.badgeColor === 'amber' ? '#f59e0b' : '#10b981'
                }}
              />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
              Parsed URL Components:
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.86rem' }}>
              <div><strong>Protocol:</strong> <span style={{ color: result.parsed.protocol === 'http:' ? '#ef4444' : '#10b981' }}>{result.parsed.protocol}</span></div>
              <div><strong>Hostname:</strong> <span style={{ color: 'var(--accent-cyan)' }}>{result.parsed.hostname}</span></div>
              {result.parsed.pathname !== '/' && <div><strong>Path:</strong> <span>{result.parsed.pathname}</span></div>}
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
            Heuristic Breakdown & Findings ({result.riskFactors.length}):
          </h4>

          {result.riskFactors.length === 0 ? (
            <div className="finding-item" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle2 size={18} color="#10b981" className="finding-icon" />
              <div className="finding-text">
                <div className="finding-title" style={{ color: '#10b981' }}>Standard Domain Structure</div>
                No homographs, punycode deception, or abusive TLDs detected.
              </div>
            </div>
          ) : (
            <div className="findings-list">
              {result.riskFactors.map((factor, idx) => (
                <div key={idx} className="finding-item">
                  <AlertCircle size={18} color={factor.severity === 'CRITICAL' || factor.severity === 'HIGH' ? '#ef4444' : '#f59e0b'} className="finding-icon" />
                  <div className="finding-text">
                    <div className="finding-title" style={{ color: factor.severity === 'CRITICAL' || factor.severity === 'HIGH' ? '#ef4444' : '#f59e0b' }}>
                      {factor.category} [{factor.severity}]
                    </div>
                    {factor.details}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'rgba(0, 240, 255, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0, 240, 255, 0.2)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Actionable Recommendation:</strong> {
              result.riskScore >= 50 
                ? 'Do not open this URL on your device. Never submit phone numbers, passwords, OTPs, or bank details. Report this link to your mobile telecom provider or 1930.'
                : 'If this link was received from an unknown sender promising prizes or asking for urgent action, verify with the official service directly before proceeding.'
            }
          </div>
        </div>
      )}
    </div>
  );
}
