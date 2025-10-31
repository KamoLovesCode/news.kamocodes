import React, { useState, useEffect } from 'react';
import { Weather as WeatherType } from '../types';
import { fetchWeather } from '../services/geminiService';

const WeatherIcon: React.FC<{ condition: string; className?: string }> = ({ condition, className = 'w-16 h-16' }) => {
  const normalizedCondition = condition.toLowerCase();
  let iconName = 'thermostat'; // Default icon

  if (normalizedCondition.includes('sunny') || normalizedCondition.includes('clear')) {
    iconName = 'sunny';
  } else if (normalizedCondition.includes('partly cloudy')) {
    iconName = 'partly_cloudy_day';
  } else if (normalizedCondition.includes('cloudy') || normalizedCondition.includes('overcast')) {
    iconName = 'cloud';
  } else if (normalizedCondition.includes('rain') || normalizedCondition.includes('shower')) {
    iconName = 'rainy';
  } else if (normalizedCondition.includes('thunderstorm')) {
    iconName = 'thunderstorm';
  } else if (normalizedCondition.includes('snow')) {
    iconName = 'cloudy_snowing';
  }

  return <span className={`material-symbols-outlined ${className}`}>{iconName}</span>;
};


const WeatherSkeleton: React.FC = () => (
    <div className="bg-surface-dark p-6 rounded-xl border border-outline shimmer-bg">
        <div className="flex justify-between items-start">
            <div>
                <div className="h-7 w-40 bg-outline rounded mb-2"></div>
                <div className="h-4 w-24 bg-outline rounded"></div>
            </div>
            <div className="w-16 h-16 bg-outline rounded-full"></div>
        </div>
        <div className="mt-8 flex justify-around">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                    <div className="h-4 w-8 bg-outline rounded"></div>
                    <div className="w-8 h-8 bg-outline rounded-full"></div>
                    <div className="h-4 w-12 bg-outline rounded"></div>
                </div>
            ))}
        </div>
    </div>
);


const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeather('Johannesburg');
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not fetch weather data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, []);

  if (loading) {
    return <WeatherSkeleton />;
  }

  if (error || !weather) {
    return (
        <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-center" role="alert">
            <p><strong className="font-bold">Error: </strong>{error || 'Weather data is currently unavailable.'}</p>
        </div>
    );
  }

  return (
    <div className="bg-surface-dark p-6 rounded-xl border border-outline">
        <div className="flex justify-between items-start text-on-primary">
            <div>
                <p className="text-sm text-on-surface">{weather.current.condition}</p>
                <h3 className="text-xl font-bold">{weather.current.city}</h3>
                <p className="text-5xl font-extrabold tracking-tighter mt-1">{weather.current.temperature}°</p>
            </div>
            <div className="text-on-surface text-6xl">
                <WeatherIcon condition={weather.current.condition} className="text-7xl" />
            </div>
        </div>
        <div className="mt-6 pt-6 border-t border-outline flex justify-around">
            {weather.forecast.slice(0, 3).map((day) => (
                <div key={day.dayOfWeek} className="flex flex-col items-center space-y-2 text-center">
                    <p className="text-sm font-bold text-on-surface">{day.dayOfWeek}</p>
                    <div className="text-on-primary">
                      <WeatherIcon condition={day.condition} className="text-3xl" />
                    </div>
                    <p className="text-sm font-semibold text-on-primary">
                        {day.highTemp}° <span className="text-on-surface/50">{day.lowTemp}°</span>
                    </p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Weather;