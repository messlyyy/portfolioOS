'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';

interface WeatherData {
  current: {
    temperature_2m: number;
    weathercode: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}

const getWeatherIcon = (code: number, size = 24) => {
  const props = { size, strokeWidth: 1.5 };
  if (code === 0) return <Sun {...props} />;
  if (code <= 3) return <Cloud {...props} />;
  if (code >= 51 && code <= 67) return <CloudRain {...props} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...props} />;
  if (code >= 80) return <CloudRain {...props} />;
  return <Cloud {...props} />;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=34.0522&longitude=-118.2437&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=America/Los_Angeles&forecast_days=7');
        const data = await res.json();
        console.log('Weather data:', data);
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="absolute top-14 right-6 z-50">
        <div className="rounded-3xl shadow-2xl backdrop-blur-2xl border border-white/30 p-6" style={{ width: '450px', background: 'rgba(255, 255, 255, 0.2)' }}>
          <span className="text-gray-700">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (!weather || !weather.current || !weather.daily) {
    console.log('Weather data incomplete:', weather);
    return null;
  }

  const currentTemp = Math.round(weather.current.temperature_2m);
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weather.daily.time[i]);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({
      day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      high: Math.round(weather.daily.temperature_2m_max[i]),
      low: Math.round(weather.daily.temperature_2m_min[i]),
      code: weather.daily.weathercode[i]
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute top-14 right-6 z-50"
    >
      <div
        className="rounded-3xl shadow-2xl backdrop-blur-2xl border border-white/30"
        style={{
          width: '450px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-4 pb-3 border-b border-gray-600/30">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-gray-700 text-xl font-bold">Los Angeles</span>
            <div className="text-gray-700">
              {getWeatherIcon(weather.current.weathercode, 40)}
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-gray-700 text-6xl font-extralight tracking-tight">
              {currentTemp}
            </span>
            <span className="text-gray-700 text-3xl font-light">°</span>
          </div>
        </div>

        {/* Daily forecast */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-gray-700 text-xs font-bold">
                  {day.day}
                </span>
                <div className="text-gray-700">
                  {getWeatherIcon(day.code, 24)}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-700 text-sm font-bold">
                    {day.high}°
                  </span>
                  <span className="text-gray-600 text-xs font-semibold">
                    {day.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glossy effect */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%)',
          }}
        />
      </div>
    </motion.div>
  );
}
