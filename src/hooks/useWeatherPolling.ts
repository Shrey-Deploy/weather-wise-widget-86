
import { useEffect, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { fetchWeatherData } from '../services/weatherApi';

export const useWeatherPolling = () => {
  const { state, dispatch } = useWeather();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pollWeatherData = async () => {
      if (!state.lastSearchedCity || state.isLoading) return;

      try {
        const weatherData = await fetchWeatherData(state.lastSearchedCity);
        dispatch({ type: 'SET_WEATHER', payload: weatherData });
        console.log('Weather data updated via polling');
      } catch (error) {
        console.error('Polling error:', error);
        // Don't show error to user for polling failures to avoid interrupting UX
      }
    };

    // Start polling if we have a city and current weather data
    if (state.lastSearchedCity && state.currentWeather) {
      intervalRef.current = setInterval(pollWeatherData, 30000); // 30 seconds
      console.log('Weather polling started for:', state.lastSearchedCity);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('Weather polling stopped');
      }
    };
  }, [state.lastSearchedCity, state.currentWeather, state.isLoading, dispatch]);

  return null;
};
