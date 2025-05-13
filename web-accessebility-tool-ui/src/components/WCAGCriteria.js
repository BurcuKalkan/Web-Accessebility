import React, { useState, useRef, useEffect } from 'react';
import './WCAGCriteria.css';

const WCAGCriteria = ({pa11yResult}) => {
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelectedCriteria(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCriteriaClick = (criteriaType) => {
    setSelectedCriteria(prevSelected => 
      prevSelected === criteriaType ? null : criteriaType
    );
  };

  const criteriaInfo = {
    'Errors': {
      description: 'These are accessibility violations that severely impact users and need immediate attention.',
      examples: ['Missing alt text for images', 'Keyboard traps', 'Invalid ARIA attributes'],
      impact: 'High - These issues make content inaccessible to many users'
    },
    'Warnings': {
      description: 'Aspects that need human verification as they cannot be automatically tested.',
      examples: ['Alt text accuracy', 'Video captions quality', 'Logical reading order'],
      impact: 'Medium - Manual verification ensures complete accessibility coverage'
    },
    'Notices': {
      description: 'Guidelines that do not apply to the current content or context.',
      examples: ['Video captions for pages without videos', 'Audio descriptions for static content'],
      impact: 'None - These guidelines are not relevant for the current content'
    }
  };

  return (
    <div className="wcag-criteria" ref={containerRef}>
      <div className="criteria-header">
        <h3>WCAG 2.1 Criteria:</h3>
        <button
          className="info-button"
          onClick={() =>
            window.open(
              "https://www.w3.org/WAI/standards-guidelines/wcag/",
              "_blank"
            )
          }
          aria-label="Learn more about WCAG"
        >
          ⓘ What is WCAG?
        </button>
      </div>

      <div className="criteria-list">
        {Object.entries({
          Errors: pa11yResult.errorCount,
          Warnings: pa11yResult.warningCount,
          Notices: pa11yResult.noticeCount,
        }).map(([type, count]) => (
          <div
            key={type}
            className={`criteria-item ${
              selectedCriteria === type ? "selected" : ""
            }`}
            onClick={() => handleCriteriaClick(type)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCriteriaClick(type);
              }
            }}
          >
            <span className="criteria-label">{type}</span>
            <span className="criteria-count">{count}</span>
          </div>
        ))}
      </div>

      {selectedCriteria && (
        <div className="criteria-details">
          <button
            className="close-button"
            onClick={() => setSelectedCriteria(null)}
            aria-label="Close details"
          >
            ×
          </button>
          <h4>{selectedCriteria}</h4>
          <p>
            <strong>Description:</strong>{" "}
            {criteriaInfo[selectedCriteria].description}
          </p>
          <p>
            <strong>Examples:</strong>
          </p>
          <ul>
            {criteriaInfo[selectedCriteria].examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
          <p>
            <strong>Impact Level:</strong>{" "}
            {criteriaInfo[selectedCriteria].impact}
          </p>
        </div>
      )}
    </div>
  );
};

export default WCAGCriteria;
