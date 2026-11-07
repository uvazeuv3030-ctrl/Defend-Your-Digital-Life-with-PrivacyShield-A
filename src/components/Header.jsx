import React from 'react';
import { Shield, Link2, KeyRound, HelpCircle, AlertTriangle, FileText, PhoneCall } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenReportModal }) {
  return (
    <header className="header-nav">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-icon-box">
            <Shield size={24} />
          </div>
          <div>
            <div className="brand-title">
              PrivacyShield <span>AI</span>
            </div>
            <div className="brand-subtitle">
              SurakshaLens • India Digital Defense
            </div>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Main Navigation">
          <button
            className={`nav-tab-btn ${activeTab === 'url-scanner' ? 'active' : ''}`}
            onClick={() => setActiveTab('url-scanner')}
          >
            <Link2 size={16} />
            <span>Link Inspector</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            <KeyRound size={16} />
            <span>App Permissions</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <HelpCircle size={16} />
            <span>Privacy Quotient</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'scams' ? 'active' : ''}`}
            onClick={() => setActiveTab('scams')}
          >
            <AlertTriangle size={16} />
            <span>Scam Hub (India)</span>
          </button>
        </nav>

        <div className="header-badges">
          <button 
            className="btn-secondary" 
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            onClick={onOpenReportModal}
            title="Download or view your privacy audit summary"
          >
            <FileText size={14} />
            <span>Export Audit</span>
          </button>

          <a 
            href="tel:1930" 
            className="badge-live" 
            style={{ textDecoration: 'none', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            title="National Cyber Crime Reporting Helpline (MHA / I4C)"
          >
            <PhoneCall size={13} />
            <span>Helpline: 1930</span>
          </a>
        </div>
      </div>
    </header>
  );
}
