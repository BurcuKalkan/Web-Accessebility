import React, { useState, useEffect } from 'react';
import './App.css';
import AuditHeader from './components/AuditHeader';
import AuditScore from './components/AuditScore';
import WCAGCriteria from './components/WCAGCriteria';
import IssueDetails from './components/IssueDetails';
import Splitter from './components/Splitter';
import axios from 'axios';

function App() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [leftPanelWidth, setLeftPanelWidth] = useState(70);
  const [pa11yResult, setPa11yResult] = useState('');
  const [isPa11yLoading, setIsPa11yLoading] = useState(true);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    try {
      const urlObj = new URL(websiteUrl);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        throw new Error('URL must start with http:// or https://');
      }
      setIsAnalyzing(true);
      fetchPa11y()
      setError('');
    } catch (err) {
      setError('Please enter a valid URL (e.g., https://example.com)');
    }
  };

  const fetchPa11y = () => {
    const pa11yUrl = websiteUrl ? `http://localhost:3001/pa11y?url=${encodeURIComponent(websiteUrl)}` : '';
    setIsPa11yLoading(true);
    axios.get(pa11yUrl)
      .then(response => {
        setPa11yResult(response.data);
        setIsPa11yLoading(false);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching Pa11y results:', error);
       // setIsPa11yLoading(false);
      })   
  }

  const handleBackClick = () => {
    setIsAnalyzing(false);
    setWebsiteUrl('');
    setError('');
    setIframeLoading(true);
  };

  const handleSplitterResize = (percentage) => {
    setLeftPanelWidth(percentage);
  };

  const calcScore = () => {
    return (pa11yResult.errorCount*3 + pa11yResult.warningCount*1 + pa11yResult.noticeCount*0.5).toFixed(2)
  };
  const proxyUrl = websiteUrl ? `http://localhost:3001/proxy?url=${encodeURIComponent(websiteUrl)}` : ''

  if (!isAnalyzing) {
    return (
      <div className="App">
        <div className="url-input-screen">
          <h1>Accessibility Audit Tool</h1>
          <p>Enter a website URL to analyze its accessibility compliance</p>
          
          <form onSubmit={handleUrlSubmit}>
            <div className="url-input-container">
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className={error ? 'error' : ''}
                aria-label="Website URL"
                aria-describedby={error ? 'url-error' : undefined}
              />
              <button type="submit">
                Analyze Website
                <span className="icon">→</span>
              </button>
            </div>
            {error && (
              <div className="error-message" id="url-error" role="alert">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="audit-container">
        <div className="audit-content">
        <div className="left-panel" style={{ width: `${100 - leftPanelWidth}%` }}>
            {isPa11yLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Analyzing accessibility...</p>
              </div>
            ) : (
              <>
                <div className="criteria-score-section">
                  <WCAGCriteria pa11yResult={pa11yResult} />
                  <AuditScore score={calcScore()} />
                </div>
                <IssueDetails  pa11yResult={pa11yResult}/>
              </>
            )}
          </div>
          <Splitter onResize={handleSplitterResize} />
          <div className="right-panel" style={{ width: `${leftPanelWidth}%` }}>
            <AuditHeader pa11yResult={pa11yResult} url={websiteUrl} onBackClick={handleBackClick} />            
            <div className="website-preview">
              <div className="iframe-container">
                {iframeLoading && (
                  <div className="iframe-loading">
                    Loading website preview...
                  </div>
                )}
                <iframe
                  src={proxyUrl}
                  title="Website Preview"
                  onLoad={() => setIframeLoading(false)}
                  loading="lazy"
                  
                  sandbox="allow-scripts allow-same-origin"
                ></iframe>
              </div>
            </div>
          </div>
         

        </div>
      </div>
    </div>
  );
}

export default App;
