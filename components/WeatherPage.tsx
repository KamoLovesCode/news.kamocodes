import React, { useState, useEffect } from 'react';
import { Weather as WeatherType } from '../types';
import { fetchWeather } from '../services/geminiService';
import ErrorMessage from './ErrorMessage';

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
  } else if (normalizedCondition.includes('mist') || normalizedCondition.includes('fog')) {
    iconName = 'foggy';
  }

  return <span className={`material-symbols-outlined ${className}`}>{iconName}</span>;
};

const WeatherSkeleton: React.FC = () => (
    <div className="space-y-6 shimmer-bg p-6 rounded-xl">
        <div className="h-20 bg-outline rounded-lg"></div>
        <div className="h-48 bg-outline rounded-lg"></div>
        <div className="h-32 bg-outline rounded-lg"></div>
    </div>
);


const WeatherPage: React.FC = () => {
    const [city, setCity] = useState('Johannesburg');
    const [inputCity, setInputCity] = useState('Johannesburg');
    const [weather, setWeather] = useState<WeatherType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWeather = async () => {
            if (!city) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchWeather(city);
                setWeather(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Could not fetch weather data.');
                setWeather(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadWeather();
    }, [city]);
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputCity.trim()) {
            setCity(inputCity.trim());
        }
    };
    
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-on-primary mb-8">Weather</h1>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
                 <input
                    type="text"
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                    placeholder="Search for a city..."
                    className="flex-1 bg-surface-dark border-2 border-outline focus:border-accent-orange focus:ring-0 text-on-primary rounded-lg py-3 px-4 transition-colors"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !inputCity.trim()} className="px-6 py-3 font-semibold rounded-lg bg-accent-orange text-primary-dark hover:bg-accent-orange-dark disabled:opacity-50 shrink-0">
                    {isLoading ? 'Loading...' : 'Search'}
                </button>
            </form>
            
            {error && <ErrorMessage message={error} />}

            {isLoading && <WeatherSkeleton />}
            
            {!isLoading && weather && (
                <div className="space-y-6">
                    {/* Current Weather */}
                    <div className="bg-surface-dark p-6 rounded-xl border border-outline">
                        <div className="flex flex-col sm:flex-row justify-between items-center text-on-primary gap-6">
                           <div className="text-center sm:text-left">
                               <h2 className="text-3xl font-bold">{weather.current.city}</h2>
                               <p className="text-on-surface">{weather.current.condition}</p>
                               <p className="text-7xl font-extrabold tracking-tighter mt-1">{weather.current.temperature}°C</p>
                           </div>
                           <div className="text-on-surface text-9xl">
                               <WeatherIcon condition={weather.current.condition} className="text-9xl" />
                           </div>
                           <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-center sm:text-left">
                                <div className="font-semibold text-on-surface">Humidity</div>
                                <div className="font-bold text-on-primary">{weather.current.humidity}%</div>
                                <div className="font-semibold text-on-surface">Wind</div>
                                <div className="font-bold text-on-primary">{weather.current.windSpeed}</div>
                           </div>
                        </div>
                    </div>
                    {/* Forecast */}
                     <div className="bg-surface-dark p-6 rounded-xl border border-outline">
                        <h3 className="text-xl font-bold text-on-primary mb-4">5-Day Forecast</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {weather.forecast.map((day) => (
                                <div key={day.dayOfWeek} className="flex flex-col items-center space-y-2 text-center bg-primary-dark p-4 rounded-lg">
                                    <p className="text-md font-bold text-on-surface">{day.dayOfWeek}</p>
                                    <div className="text-on-primary text-5xl">
                                      <WeatherIcon condition={day.condition} className="text-5xl" />
                                    </div>
                                    <p className="text-lg font-semibold text-on-primary">
                                        {day.highTemp}° <span className="text-on-surface/50">{day.lowTemp}°</span>
                                    </p>
                                     <p className="text-xs text-on-surface capitalize">{day.condition}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherPage;