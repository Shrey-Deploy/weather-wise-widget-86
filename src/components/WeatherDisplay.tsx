
import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherIconUrl } from '../services/weatherApi';

const WeatherDisplay = () => {
  const { state, dispatch } = useWeather();
  const { currentWeather, unit } = state;

  if (!currentWeather) return null;

  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    dispatch({ type: 'SET_UNIT', payload: newUnit });
  };

  const convertTemperature = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getUnitSymbol = () => unit === 'celsius' ? '°C' : '°F';

  const getWindSpeedUnit = () => unit === 'celsius' ? 'm/s' : 'mph';

  const convertWindSpeed = (speed: number) => {
    if (unit === 'fahrenheit') {
      return Math.round(speed * 2.237); // Convert m/s to mph
    }
    return speed;
  };

  return (
    <div className="weather-display">
      <div className="weather-card">
        <div className="weather-header">
          <h2 className="location">{currentWeather.location}</h2>
          <button onClick={toggleUnit} className="unit-toggle">
            {getUnitSymbol()}
          </button>
        </div>
        
        <div className="weather-main">
          <div className="temperature-section">
            <img 
              src={getWeatherIconUrl(currentWeather.icon)} 
              alt={currentWeather.description}
              className="weather-icon"
            />
            <div className="temperature">
              {convertTemperature(currentWeather.temperature)}{getUnitSymbol()}
            </div>
          </div>
          <div className="weather-description">
            {currentWeather.description.charAt(0).toUpperCase() + currentWeather.description.slice(1)}
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Feels like</span>
            <span className="detail-value">
              {convertTemperature(currentWeather.feelsLike)}{getUnitSymbol()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{currentWeather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">
              {convertWindSpeed(currentWeather.windSpeed)} {getWindSpeedUnit()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{currentWeather.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
