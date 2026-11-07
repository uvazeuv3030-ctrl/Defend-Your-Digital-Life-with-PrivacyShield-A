import React from 'react';
import { X, Download, Printer, Shield, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, auditData }) {
  if (!isOpen) return null;

  const { urlScans = [], permissionAudit = null, quizScore = null } = auditData || {};

  const handleDownload = () => {
    const reportText = `=====================================================
PRIVACYSHIELD AI - PERSONAL DIGITAL PRIVACY AUDIT REPORT
Generated: ${new Date().toLocaleString()}
Framework: CERT-In Advisory Guidelines & DPDP Act, 2023
=====================================================

1. PRIVACY QUOTIENT (PQ) ASSESSMENT
-----------------------------------------------------
Score: ${quizScore ? `${quizScore.score}/100 (${quizScore.title})` : 'Not completed yet'}
${quizScore ? quizScore.actionPlan.map(a => `• [${a.priority}] ${a.task}`).join('\n') : ''}

2. APP PERMISSION AUDIT
-----------------------------------------------------
Evaluated Permissions: ${permissionAudit ? permissionAudit.selectedIds.join(', ') : 'None audited'}
Toxic Combinations Detected: ${permissionAudit && permissionAudit.detectedCombos.length > 0 ? permissionAudit.detectedCombos.map(c => c.title).join('; ') : 'None'}
Risk Score: ${permissionAudit ? `${permissionAudit.riskScore}/100` : 'N/A'}

3. RECENT LINK INSPECTIONS (${urlScans.length} Scans)
-----------------------------------------------------
${urlScans.length > 0 ? urlScans.map(u => `• [${u.safetyRating}] ${u.submittedUrl} (Risk: ${u.riskScore}%)`).join('\n') : 'No URLs scanned in current session.'}

4. EMERGENCY ASSISTANCE (INDIA)
-----------------------------------------------------
• National Cybercrime Reporting Portal: https://cybercrime.gov.in
• National Cyber Fraud Helpline: Dial 1930 (Golden Hour: Within 2 hours)
• Statutory Law: Digital Personal Data Protection Act, 2023

DISCLAIMER: This report is generated strictly on your local device without sending personal inputs to external cloud logs. Link scans and permission evaluations are advisory heuristics.
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PrivacyShield_Audit_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileText size={22} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.35rem' }}>Personalized Privacy Audit Summary</h3>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section 1: Privacy Quotient */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.98rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
              1. Digital Privacy Quotient (PQ)
            </h4>
            {quizScore ? (
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: quizScore.badgeColor }}>
                  Score: {quizScore.score}/100 — {quizScore.title}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Action items:
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                    {quizScore.actionPlan.map((a, i) => (
                      <li key={i}><strong style={{ color: '#ffffff' }}>[{a.priority}]</strong> {a.task}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                You have not completed the Privacy Quotient Quiz yet. Go to the "Privacy Quotient" tab to diagnose your risk.
              </p>
            )}
          </div>

          {/* Section 2: Permissions Audit */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.98rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
              2. App Permission Assessment
            </h4>
            {permissionAudit ? (
              <div style={{ fontSize: '0.86rem' }}>
                <div><strong>Audited Permissions:</strong> {permissionAudit.selectedIds.join(', ')}</div>
                <div style={{ marginTop: '0.3rem' }}>
                  <strong>Risk Level:</strong> <span style={{ color: permissionAudit.riskScore >= 70 ? '#ef4444' : '#f59e0b' }}>{permissionAudit.riskScore}/100</span>
                </div>
                {permissionAudit.detectedCombos.length > 0 && (
                  <div style={{ marginTop: '0.4rem', color: '#ef4444', fontWeight: 600 }}>
                    ⚠️ Toxic Combination: {permissionAudit.detectedCombos.map(c => c.title).join(', ')}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                No custom app permissions bundle audited in this session.
              </p>
            )}
          </div>

          {/* Section 3: Link Scans */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.98rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
              3. Link Inspections in Session ({urlScans.length})
            </h4>
            {urlScans.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.84rem' }}>
                {urlScans.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>{s.submittedUrl}</span>
                    <span style={{ fontWeight: 700, color: s.badgeColor === 'red' ? '#ef4444' : s.badgeColor === 'amber' ? '#f59e0b' : '#10b981' }}>
                      {s.safetyRating}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                No URLs scanned yet. Use "Link Inspector" to verify links.
              </p>
            )}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            🔒 Privacy by Design Guarantee: This report was assembled locally in your browser session. None of this data was tracked or transmitted to external servers.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button className="btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Report</span>
          </button>
          <button className="btn-primary" onClick={handleDownload}>
            <Download size={16} />
            <span>Download Report (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
