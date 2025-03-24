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

  // Calculate end point for gauge fill
  const endX = 50 + 40 * Math.cos(Math.PI * (1 - percentage));
  const endY = 50 - 40 * Math.sin(Math.PI * (1 - percentage));

  return (
    <div className="gauge-chart">
      <h3>Audit Score:</h3>
      <div className="gauge-svg-container">
        <svg viewBox="0 0 100 50" className="gauge-svg">
          <path
            className="gauge-background"
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="4"
          />
          <path
            className="gauge-fill"
            d={`M 50 50 L ${endX} ${endY}`}
            stroke={color}
            strokeWidth="4"
            fill="none"
          />
          <circle className="gauge-needle" cx="50" cy="50" r="2" fill={color} />
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