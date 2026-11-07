import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Scale, PhoneCall, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';
import { FALLBACK_SCAMS, FALLBACK_DPDP_RIGHTS } from '../data/fallbackData';

export default function ScamDefenseHub() {
  const [openScamId, setOpenScamId] = useState('digital_arrest');
  const [activeSection, setActiveSection] = useState('playbooks'); // 'playbooks' | 'dpdp'

  return (
    <div className="card-glass">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={22} color="#f59e0b" />
            <h2>India Cyber Scam Defense & DPDP Act Hub</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Official threat intelligence advisories from CERT-In and I4C (MHA) translated into simple defense rules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`nav-tab-btn ${activeSection === 'playbooks' ? 'active' : ''}`}
            onClick={() => setActiveSection('playbooks')}
          >
            <Zap size={15} />
            <span>Active Threats</span>
          </button>
          <button
            className={`nav-tab-btn ${activeSection === 'dpdp' ? 'active' : ''}`}
            onClick={() => setActiveSection('dpdp')}
          >
            <Scale size={15} />
            <span>DPDP Act 2023 Rights</span>
          </button>
        </div>
      </div>

      {/* Emergency Hotline Alert Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: 'var(--radius-md)', padding: '1.1rem 1.4rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 800, fontSize: '0.95rem' }}>
            <PhoneCall size={18} />
            <span>National Cyber Crime Emergency Protocol</span>
          </div>
          <div style={{ fontSize: '0.86rem', color: '#fecaca', marginTop: '0.25rem' }}>
            Fell victim to a financial scam? Dial <strong>1930</strong> immediately. Reporting within the <strong>"Golden Hour" (first 2 hours)</strong> enables banks to freeze transit accounts before cashout.
          </div>
        </div>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ background: '#ef4444', color: '#ffffff', padding: '0.6rem 1.1rem', fontSize: '0.82rem', boxShadow: 'none' }}
        >
          <span>cybercrime.gov.in</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {activeSection === 'playbooks' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FALLBACK_SCAMS.map(scam => {
            const isOpen = openScamId === scam.id;
            return (
              <div key={scam.id} className="playbook-card">
                <div 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setOpenScamId(isOpen ? null : scam.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: scam.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b' }} />
                    <div>
                      <h3 style={{ fontSize: '1.15rem' }}>{scam.title}</h3>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Category: {scam.threatCategory}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: scam.riskLevel === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: scam.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b' }}>
                      {scam.riskLevel}
                    </span>
                    {isOpen ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.85rem', lineHeight: 1.5 }}>
                  {scam.summary}
                </p>

                {isOpen && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', animation: 'fadeIn 0.25s ease-out' }}>
                    <h4 style={{ fontSize: '0.92rem', color: '#fca5a5', marginBottom: '0.5rem' }}>
                      Scammer Red Flags:
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                      {scam.scamIndicators.map((ind, iIdx) => (
                        <li key={iIdx} style={{ marginBottom: '0.35rem' }}>{ind}</li>
                      ))}
                    </ul>

                    <h4 style={{ fontSize: '0.92rem', color: '#86efac', marginBottom: '0.5rem' }}>
                      Truth & Defense Playbook:
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                      {scam.truthAndDefense.map((td, tIdx) => (
                        <li key={tIdx} style={{ marginBottom: '0.35rem' }}>{td}</li>
                      ))}
                    </ul>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      Official Source: {scam.officialGuidance}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#d8b4fe', marginBottom: '0.4rem' }}>
              Digital Personal Data Protection (DPDP) Act, 2023
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Enacted by the Parliament of India, the DPDP Act gives citizens enforceable rights over their personal data. 
              Companies failing to safeguard your digital data face statutory penalties up to <strong>₹250 crore</strong>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {FALLBACK_DPDP_RIGHTS.map((r, rIdx) => (
              <div key={rIdx} style={{ background: 'rgba(16, 22, 35, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.98rem' }}>{r.title}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', fontWeight: 700, background: 'rgba(168, 85, 247, 0.15)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    {r.section}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {r.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
