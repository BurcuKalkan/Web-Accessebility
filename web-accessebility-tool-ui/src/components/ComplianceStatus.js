import React from 'react';
import './ComplianceStatus.css';

const ComplianceStatus = () => {
  return (
    <div className="compliance-status">
      <div className="scan-notice">
        <span className="scan-icon">⚪</span>
        You've scanned 1 page so far. Scan your entire domain to uncover all critical accessibility issues.
        <button className="scan-button">Scan full domain</button>
      </div>
      
      <div className="status-box not-compliant">
        <div className="status-header">
          <span className="status-icon">✕</span>
          <span className="status-text">NOT COMPLIANT</span>
        </div>
        <p className="status-message">Your site may be at risk of accessibility lawsuits.</p>
        <button className="fix-issues-button">
          <span className="fix-icon">+</span>
          Fix 34 Issues
        </button>
      </div>
    </div>
  );
};

export default ComplianceStatus;
