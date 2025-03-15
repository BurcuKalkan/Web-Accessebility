import React from 'react';
import './AuditScore.css';

const AuditScore = ({ score }) => {
  return (
    <div className="audit-score">
      <h3>Audit Score:</h3>
      <div className="score-circle" data-score={`${score}%`}>
        <svg viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e9ecef"
            strokeWidth="2"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#4caf50"
            strokeWidth="2"
            strokeDasharray={`${score}, 100`}
          />
        </svg>
      </div>
      <p className="score-warning">
      Score is calculated by weighing issues<br />
      Higher score is better
      </p>
    </div>
  );
};

export default AuditScore;
