import React from 'react';
import './AuditScore.css';

const getGaugeColor = (score) => {
  if (score <= 200) return "#48bb78";
  if (score <= 400) return "#ecc94b";
  return "#f56565";
};

const AuditScore = ({ score }) => {
  const percentage = Math.min(Math.max(score / 500, 0), 1);
  const angle = percentage * 180;
  const color = getGaugeColor(score);

  // Calculate the arc path for the fill
  const largeArcFlag = angle > 90 ? 1 : 0;
  const endX = 50 + 40 * Math.cos(Math.PI * (1 - percentage));
  const endY = 50 - 40 * Math.sin(Math.PI * (1 - percentage));
  const arcPath = `M 50 50 L 50 10 A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

  return (
    <div className="gauge-chart">
      <h3>Audit Score:</h3>
      <div className="gauge-svg-container">
        <svg viewBox="0 0 100 50" className="gauge-svg">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#48bb78', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#ecc94b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#f56565', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            className="gauge-background"
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="4"
          />
          <path
            className="gauge-fill"
            d={arcPath}
            fill="url(#gaugeGradient)"
            opacity="0.2"
          />
          <path
            className="gauge-fill"
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="4"
            strokeDasharray={`${percentage * 251.2}, 251.2`}
          />
          <circle className="gauge-needle" cx="50" cy="50" r="2" fill={color} />
          <line
            className="gauge-needle-line"
            x1="50"
            y1="50"
            x2={endX}
            y2={endY}
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="score-value" style={{ color }}>{score}</div>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color green"></div>
          <div className="legend-text">Good (0-200)</div>
        </div>
        <div className="legend-item">
          <div className="legend-color yellow"></div>
          <div className="legend-text">Caution (201-400)</div>
        </div>
        <div className="legend-item">
          <div className="legend-color red"></div>
          <div className="legend-text">Critical (401+)</div>
        </div>
      </div>
      <p className="score-warning">
        Score is calculated by weighing issues <br /> based on their severity level
      </p>
    </div>
  );
};

export default AuditScore;