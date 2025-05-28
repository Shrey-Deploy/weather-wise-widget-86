
import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { fetchWeatherData, fetchForecastData } from '../services/weatherApi';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const { state, dispatch } = useWeather();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_FORECAST_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Fetch current weather
      const weatherData = await fetchWeatherData(query.trim());
      dispatch({ type: 'SET_WEATHER', payload: weatherData });
      dispatch({ type: 'SET_LAST_SEARCHED_CITY', payload: query.trim() });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Fetch forecast data
      const forecastData = await fetchForecastData(query.trim());
      dispatch({ type: 'SET_FORECAST', payload: forecastData });
      dispatch({ type: 'SET_FORECAST_LOADING', payload: false });
      
      setQuery('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
            disabled={state.isLoading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={state.isLoading || !query.trim()}
          >
            {state.isLoading ? (
              <div className="spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
