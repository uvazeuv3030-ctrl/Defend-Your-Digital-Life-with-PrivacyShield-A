import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UrlScanner from './components/UrlScanner';
import PermissionAuditor from './components/PermissionAuditor';
import PrivacyQuiz from './components/PrivacyQuiz';
import ScamDefenseHub from './components/ScamDefenseHub';
import ReportModal from './components/ReportModal';
import { ShieldCheck, ShieldAlert, Award, FileSpreadsheet, Lock, AlertOctagon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('url-scanner');
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Session state with localStorage persistence
  const [urlScans, setUrlScans] = useState(() => {
    try {
      const saved = localStorage.getItem('privacyshield_scans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [permissionAudit, setPermissionAudit] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('privacyshield_scans', JSON.stringify(urlScans.slice(0, 15)));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [urlScans]);

  const handleScanComplete = (scanResult) => {
    setUrlScans(prev => [scanResult, ...prev.filter(s => s.submittedUrl !== scanResult.submittedUrl)].slice(0, 15));
  };

  const handlePermissionAudit = (audit) => {
    setPermissionAudit(audit);
    alert('Permission evaluation updated in your session audit report!');
  };

  const handleQuizCompleted = (result) => {
    setQuizScore(result);
  };

  return (
    <div>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportOpen(true)}
      />

      <main className="app-container">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-tag">
                <Lock size={12} />
                <span>Zero-Data Retention • Advisory Privacy Defense</span>
              </div>
              <h1 className="hero-title">
                Defend Your Digital Life with <span>PrivacyShield AI</span>
              </h1>
              <p className="hero-desc">
                Demystifying app permissions, dissecting suspicious links without opening them, 
                and fortifying citizens against Indian cyber scams with real-time heuristic intelligence.
              </p>
            </div>

            <div className="hero-stats">
              <div className="stat-pill">
                <div className="stat-number">2.04M+</div>
                <div className="stat-label">CERT-In Incidents (2024)</div>
              </div>
              <div className="stat-pill">
                <div className="stat-number">₹250 Cr</div>
                <div className="stat-label">Max DPDP Act Penalty</div>
              </div>
              <div className="stat-pill">
                <div className="stat-number" style={{ color: '#00f0ff' }}>
                  {quizScore ? `${quizScore.score}/100` : '--'}
                </div>
                <div className="stat-label">Your Privacy Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Views */}
        <section>
          {activeTab === 'url-scanner' && (
            <UrlScanner onScanComplete={handleScanComplete} />
          )}

          {activeTab === 'permissions' && (
            <PermissionAuditor onPermissionAuditComplete={handlePermissionAudit} />
          )}

          {activeTab === 'quiz' && (
            <PrivacyQuiz onQuizCompleted={handleQuizCompleted} />
          )}

          {activeTab === 'scams' && (
            <ScamDefenseHub />
          )}
        </section>

        {/* Global Footer */}
        <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
          <div>
            <strong style={{ color: '#ffffff' }}>PrivacyShield AI (SurakshaLens)</strong> — Hackathon Prototype.
            <div style={{ marginTop: '0.25rem' }}>
              Built strictly in accordance with CERT-In Cybersecurity Advisories & DPDP Act, 2023.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span>Zero Tracking</span>
            <span>•</span>
            <span>Zero SSRF</span>
            <span>•</span>
            <span>Client-Safe Inspection</span>
          </div>
        </footer>
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        auditData={{
          urlScans,
          permissionAudit,
          quizScore
        }}
      />
    </div>
  );
}
