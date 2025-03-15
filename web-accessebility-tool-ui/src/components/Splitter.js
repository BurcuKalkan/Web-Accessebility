import React, { useState, useEffect } from 'react';
import './Splitter.css';

const Splitter = ({ onResize }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const container = document.querySelector('.audit-container');
        const containerRect = container.getBoundingClientRect();
        const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        const clampedPercentage = Math.min(Math.max(percentage, 30), 70);
        onResize(clampedPercentage);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.classList.remove('dragging-splitter');
      enableIframePointerEvents();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.classList.add('dragging-splitter');
      disableIframePointerEvents();
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('dragging-splitter');
      enableIframePointerEvents();
    };
  }, [isDragging, onResize]);

  const disableIframePointerEvents = () => {
    const iframe = document.querySelector('.iframe-container iframe');
    if (iframe) {
      iframe.style.pointerEvents = 'none';
    }
  };

  const enableIframePointerEvents = () => {
    const iframe = document.querySelector('.iframe-container iframe');
    if (iframe) {
      iframe.style.pointerEvents = 'auto';
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div 
      className={`splitter ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={70}
      aria-valuemin={30}
      aria-valuemax={70}
      tabIndex={0}
    >
      <div className="splitter-handle"></div>
    </div>
  );
};

export default Splitter;
