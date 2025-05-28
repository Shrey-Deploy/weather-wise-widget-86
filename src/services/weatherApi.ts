
import { WeatherData } from '../context/WeatherContext';

const API_KEY = '8c5b6c8e3f8a7a2b4f8e5c6d9a2b4f8e'; // Demo API key - users will need to replace
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface ApiWeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface ApiForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
  city: {
    name: string;
  };
}

export interface ForecastDay {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
}

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      } else if (response.status === 401) {
        throw new Error('API key is invalid. Please check your configuration.');
      } else {
        throw new Error('Failed to fetch weather data. Please try again later.');
      }
    }
    
    const data: ApiWeatherData = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching weather data.');
  }
};

export const fetchForecastData = async (city: string): Promise<ForecastDay[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      } else if (response.status === 401) {
        throw new Error('API key is invalid. Please check your configuration.');
      } else {
        throw new Error('Failed to fetch forecast data. Please try again later.');
      }
    }
    
    const data: ApiForecastData = await response.json();
    
    // Group forecast data by day (API returns 3-hour intervals)
    const dailyForecasts: { [key: string]: any[] } = {};
    
    data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });
    
    // Convert to 5-day forecast format
    const forecastDays: ForecastDay[] = [];
    const dates = Object.keys(dailyForecasts).slice(0, 5);
    
    dates.forEach(date => {
      const dayData = dailyForecasts[date];
      const temps = dayData.map(item => item.main.temp);
      const tempMin = Math.round(Math.min(...temps));
      const tempMax = Math.round(Math.max(...temps));
      
      // Use the most common weather condition for the day
      const weatherConditions = dayData.map(item => item.weather[0]);
      const mostCommonWeather = weatherConditions[Math.floor(weatherConditions.length / 2)];
      
      // Calculate average humidity
      const avgHumidity = Math.round(
        dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length
      );
      
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      
      forecastDays.push({
        date,
        dayName,
        tempMin,
        tempMax,
        description: mostCommonWeather.description,
        icon: mostCommonWeather.icon,
        humidity: avgHumidity,
      });
    });
    
    return forecastDays;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching forecast data.');
  }
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
