import React, { useState } from 'react';
import './LandingPage.css';

function LandingPage({ onUrlSubmit }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        throw new Error('URL must start with http:// or https://');
      }
      onUrlSubmit(url);
      setError('');
    } catch (err) {
      setError('Please enter a valid URL (e.g., https://example.com)');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Accessibility Audit Tool</h1>
        <p>Enter a website URL to analyze its accessibility compliance</p>
        
        <form onSubmit={handleSubmit}>
          <div className="url-input-container">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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

export default LandingPage;
