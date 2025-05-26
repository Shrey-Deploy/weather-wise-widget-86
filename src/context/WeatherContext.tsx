
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
  pressure: number;
}

interface WeatherState {
  currentWeather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  unit: 'celsius' | 'fahrenheit';
  lastSearchedCity: string | null;
}

type WeatherAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_WEATHER'; payload: WeatherData }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_UNIT'; payload: 'celsius' | 'fahrenheit' }
  | { type: 'SET_LAST_SEARCHED_CITY'; payload: string };

const initialState: WeatherState = {
  currentWeather: null,
  isLoading: false,
  error: null,
  unit: 'celsius',
  lastSearchedCity: localStorage.getItem('lastSearchedCity'),
};

const weatherReducer = (state: WeatherState, action: WeatherAction): WeatherState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_WEATHER':
      return { ...state, currentWeather: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_UNIT':
      return { ...state, unit: action.payload };
    case 'SET_LAST_SEARCHED_CITY':
      localStorage.setItem('lastSearchedCity', action.payload);
      return { ...state, lastSearchedCity: action.payload };
    default:
      return state;
  }
};

const WeatherContext = createContext<{
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
} | null>(null);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
