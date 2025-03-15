import React, { useState } from "react";
import "./AuditHeader.css";

const AuditHeader = ({ pa11yResult,url, onBackClick }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    setIsDownloading(true);
    
    // Create a dummy audit file
    const auditData = pa11yResult;

    // Convert to JSON string
    const json = JSON.stringify(auditData, null, 2);
    
    // Create a blob
    const blob = new Blob([json], { type: "application/json" });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accessibility-audit-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setIsDownloading(false);
  };

  return (
    <div className="audit-header">
      <div className="back-button" onClick={onBackClick}>
        <span>← Back to Home</span>
      </div>
      <div className="audit-title">
        <h2>Audit results for {url}</h2>
      </div>
      <button className="download-button" onClick={handleDownloadClick} disabled={isDownloading}>
        {isDownloading ? "Downloading..." : "↓ Download audit"}
      </button>
    </div>
  );
};

export default AuditHeader;
