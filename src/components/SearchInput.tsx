
import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { fetchWeatherData } from '../services/weatherApi';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { state, dispatch } = useWeather();

  const handleSearch = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    setIsSearching(true);
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const weatherData = await fetchWeatherData(cityName);
      dispatch({ type: 'SET_WEATHER', payload: weatherData });
      dispatch({ type: 'SET_LAST_SEARCHED_CITY', payload: cityName });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Load last searched city on component mount
  useEffect(() => {
    if (state.lastSearchedCity && !state.currentWeather) {
      setQuery(state.lastSearchedCity);
      handleSearch(state.lastSearchedCity);
    }
  }, []);

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="search-input"
            disabled={isSearching}
          />
          <button 
            type="submit" 
            disabled={isSearching || !query.trim()}
            className="search-button"
          >
            {isSearching ? (
              <div className="spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
