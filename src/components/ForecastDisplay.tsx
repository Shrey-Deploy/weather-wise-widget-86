
import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherIconUrl } from '../services/weatherApi';

const ForecastDisplay = () => {
  const { state } = useWeather();
  const { forecast, unit, isForecastLoading } = state;

  if (isForecastLoading) {
    return (
      <div className="forecast-display">
        <div className="forecast-card">
          <h3 className="forecast-title">5-Day Forecast</h3>
          <div className="forecast-loading">
            <div className="spinner"></div>
            <p>Loading forecast...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) return null;

  const convertTemperature = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getUnitSymbol = () => unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="forecast-display">
      <div className="forecast-card">
        <h3 className="forecast-title">5-Day Forecast</h3>
        <div className="forecast-grid">
          {forecast.map((day, index) => (
            <div key={day.date} className="forecast-item">
              <div className="forecast-day">{day.dayName}</div>
              <img 
                src={getWeatherIconUrl(day.icon)} 
                alt={day.description}
                className="forecast-icon"
              />
              <div className="forecast-temps">
                <span className="temp-max">
                  {convertTemperature(day.tempMax)}{getUnitSymbol()}
                </span>
                <span className="temp-min">
                  {convertTemperature(day.tempMin)}{getUnitSymbol()}
                </span>
              </div>
              <div className="forecast-description">
                {day.description.charAt(0).toUpperCase() + day.description.slice(1)}
              </div>
              <div className="forecast-humidity">
                {day.humidity}% humidity
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastDisplay;
