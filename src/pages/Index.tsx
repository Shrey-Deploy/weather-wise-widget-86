
import React from 'react';
import { WeatherProvider } from '../context/WeatherContext';
import SearchInput from '../components/SearchInput';
import WeatherDisplay from '../components/WeatherDisplay';
import ForecastDisplay from '../components/ForecastDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { useWeather } from '../context/WeatherContext';
import { useWeatherPolling } from '../hooks/useWeatherPolling';
import '../styles/WeatherDashboard.css';

const WeatherDashboardContent = () => {
  const { state } = useWeather();
  useWeatherPolling();

  return (
    <div className="weather-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Weather Dashboard</h1>
          <p className="dashboard-subtitle">
            Get real-time weather updates for any city around the world
          </p>
        </header>

        <SearchInput />
        <ErrorDisplay />
        
        {state.isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <WeatherDisplay />
            <ForecastDisplay />
          </>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <WeatherProvider>
      <WeatherDashboardContent />
    </WeatherProvider>
  );
};

export default Index;
