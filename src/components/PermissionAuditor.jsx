import React, { useState } from 'react';
import { KeyRound, AlertTriangle, ShieldAlert, CheckCircle, Smartphone, HelpCircle, Layers, XCircle } from 'lucide-react';
import { FALLBACK_PERMISSIONS, FALLBACK_TOXIC_COMBINATIONS } from '../data/fallbackData';

export default function PermissionAuditor({ onPermissionAuditComplete }) {
  const [selectedIds, setSelectedIds] = useState(['sms_read', 'accessibility']);
  const [appCategory, setAppCategory] = useState('utility');
  const [activeOS, setActiveOS] = useState('android');

  const togglePermission = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const clearAll = () => setSelectedIds([]);
  const selectAll = () => setSelectedIds(FALLBACK_PERMISSIONS.map(p => p.id));

  // Evaluate Toxic Combinations
  const detectedCombos = FALLBACK_TOXIC_COMBINATIONS.filter(combo => 
    combo.permissions.every(pid => selectedIds.includes(pid))
  );

  // Calculate Risk
  let riskScore = 0;
  FALLBACK_PERMISSIONS.forEach(p => {
    if (selectedIds.includes(p.id)) {
      if (p.riskLevel === 'CRITICAL') riskScore += 35;
      else if (p.riskLevel === 'HIGH') riskScore += 20;
      else if (p.riskLevel === 'MEDIUM') riskScore += 10;
    }
  });

  if (detectedCombos.length > 0) {
    riskScore += detectedCombos.length * 25;
  }
  riskScore = Math.min(100, Math.max(0, riskScore));

  const getCategoryWarning = () => {
    if (appCategory === 'utility' && (selectedIds.includes('sms_read') || selectedIds.includes('accessibility') || selectedIds.includes('read_contacts'))) {
      return '🚨 High Risk Mismatch: Simple utilities (calculator, torch, cleaner) NEVER have legitimate reasons for SMS or Accessibility privileges.';
    }
    if (appCategory === 'game' && selectedIds.includes('background_location')) {
      return '⚠️ Unnecessary Tracking: Casual offline/online games do not require 24/7 background geolocation.';
    }
    return null;
  };

  const categoryWarning = getCategoryWarning();

  return (
    <div className="card-glass">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <KeyRound size={22} color="var(--accent-cyan)" />
            <h2>Interactive App Permission Risk Auditor</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Select the permissions an app asks for. We translate confusing Android/iOS technical jargon into plain-English risks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }} onClick={clearAll}>
            Clear
          </button>
          <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }} onClick={selectAll}>
            Select All
          </button>
        </div>
      </div>

      {/* Honest Architectural Transparency Callout */}
      <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <HelpCircle size={20} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ color: '#ffffff' }}>Why manual selection?</strong> Modern web browsers strictly sandbox web applications to protect your device. Web applications cannot silently audit your installed APKs without specialized native Android packages and user-granted platform permissions.
        </div>
      </div>

      {/* Category & OS selectors */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            App Type / Category:
          </label>
          <select 
            className="text-input" 
            style={{ width: '100%', padding: '0.6rem 0.8rem' }}
            value={appCategory}
            onChange={(e) => setAppCategory(e.target.value)}
          >
            <option value="utility">Utility / Tool (Flashlight, Calculator, PDF Viewer)</option>
            <option value="game">Casual Game / Entertainment</option>
            <option value="social">Social Networking & Messaging</option>
            <option value="finance">Banking / UPI / Loan Application</option>
            <option value="other">General Application</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Remediation Device Guide:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
            <button
              className={`nav-tab-btn ${activeOS === 'android' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setActiveOS('android')}
            >
              <Smartphone size={15} />
              <span>Android</span>
            </button>
            <button
              className={`nav-tab-btn ${activeOS === 'ios' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setActiveOS('ios')}
            >
              <Smartphone size={15} />
              <span>Apple iOS</span>
            </button>
          </div>
        </div>
      </div>

      {categoryWarning && (
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.1rem', marginBottom: '1.25rem', color: '#fca5a5', fontSize: '0.88rem', fontWeight: 600 }}>
          {categoryWarning}
        </div>
      )}

      {/* Toxic Combo Warning Banner */}
      {detectedCombos.map((combo, idx) => (
        <div key={idx} className="toxic-alert-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ef4444', fontWeight: 800, fontSize: '0.98rem' }}>
            <ShieldAlert size={20} />
            <span>CRITICAL RISK: Toxic Permission Combination Detected!</span>
          </div>
          <h4 style={{ color: '#ffffff', margin: '0.4rem 0 0.2rem' }}>{combo.title}</h4>
          <p style={{ fontSize: '0.86rem', color: '#fecaca', lineHeight: 1.5 }}>
            {combo.explanation}
          </p>
        </div>
      ))}

      {/* Permission Cards Grid */}
      <div className="perm-grid">
        {FALLBACK_PERMISSIONS.map(p => {
          const isSelected = selectedIds.includes(p.id);
          const badgeStyle = p.riskLevel === 'CRITICAL'
            ? { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }
            : p.riskLevel === 'HIGH'
            ? { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }
            : { background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)' };

          return (
            <div
              key={p.id}
              className={`perm-card ${isSelected ? 'selected' : ''}`}
              onClick={() => togglePermission(p.id)}
            >
              <div className="perm-card-header">
                <span className="perm-name">{p.name}</span>
                <span className="perm-badge" style={badgeStyle}>
                  {p.riskLevel}
                </span>
              </div>

              <p className="perm-desc">
                <strong>Plain English:</strong> {p.laymanSummary}
              </p>

              <div style={{ fontSize: '0.8rem', color: '#fca5a5', marginBottom: '0.6rem' }}>
                <strong>Malware Vector:</strong> {p.maliciousAbuse}
              </div>

              <div className="perm-meta">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: isSelected ? 'var(--accent-cyan)' : 'var(--text-dim)', fontWeight: 600 }}>
                    {isSelected ? '✓ Selected in Audit' : '+ Tap to select'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {activeOS === 'android' ? 'Android Settings' : 'iOS Settings'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                  {activeOS === 'android' ? p.remediationSteps.android : p.remediationSteps.ios}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(14, 20, 32, 0.9)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Audited Bundle Risk Score</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: riskScore >= 70 ? '#ef4444' : riskScore >= 35 ? '#f59e0b' : '#10b981' }}>
            {riskScore}/100 Risk Index ({selectedIds.length} permissions evaluated)
          </div>
        </div>
        <div>
          <button 
            className="btn-primary" 
            style={{ fontSize: '0.88rem', padding: '0.65rem 1.25rem' }}
            onClick={() => onPermissionAuditComplete && onPermissionAuditComplete({ selectedIds, riskScore, detectedCombos })}
          >
            Save to Session Audit
          </button>
        </div>
      </div>
    </div>
  );
}
