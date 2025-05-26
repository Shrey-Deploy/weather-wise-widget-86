
import React from 'react';
import { useWeather } from '../context/WeatherContext';

const ErrorDisplay = () => {
  const { state, dispatch } = useWeather();
  const { error } = state;

  if (!error) return null;

  const handleDismiss = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <div className="error-display">
      <div className="error-card">
        <div className="error-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="error-content">
          <h3 className="error-title">Oops! Something went wrong</h3>
          <p className="error-message">{error}</p>
        </div>
        <button onClick={handleDismiss} className="error-dismiss">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
