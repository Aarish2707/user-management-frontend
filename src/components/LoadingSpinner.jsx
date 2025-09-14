import React from 'react';

const LoadingSpinner = ({ size = 'medium', overlay = true }) => {
  const sizeClass = `spinner-${size}`;
  
  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className={`spinner ${sizeClass}`}>
          <div className="spinner-circle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`spinner ${sizeClass}`}>
      <div className="spinner-circle"></div>
    </div>
  );
};

export default LoadingSpinner;