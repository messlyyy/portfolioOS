'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';

// Resolución de referencia (1920x1080)
const REFERENCE_WIDTH = 1920;
const REFERENCE_HEIGHT = 1080;

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

interface WeatherWidgetProps {
  screenWidth: number;
  screenHeight: number;
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

export default function WeatherWidget({ screenWidth, screenHeight }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Calcular factor de escala basado en la resolución actual vs referencia
  const scale = useMemo(() => {
    const scaleX = screenWidth / REFERENCE_WIDTH;
    const scaleY = screenHeight / REFERENCE_HEIGHT;
    // Usar el menor de los dos para mantener proporciones
    return Math.min(scaleX, scaleY);
  }, [screenWidth, screenHeight]);

  // Tamaños escalados
  const scaledSizes = useMemo(() => {
    return {
      width: 450 * scale,
      mainIconSize: 40 * scale,
      dayIconSize: 24 * scale,
      padding: 6 * scale,
      borderRadius: 30 * scale,
      topOffset: 56, // Mantener distancia fija desde arriba (no escalar)
      rightOffset: 24, // Mantener distancia fija desde la derecha (no escalar)
      fontSize: {
        cityName: 20 * scale,
        temperature: 60 * scale,
        degree: 30 * scale,
        dayName: 12 * scale,
        high: 14 * scale,
        low: 12 * scale,
      },
      spacing: {
        gap: 2 * scale,
        headerBottom: 3 * scale,
        dailyPadding: 4 * scale,
      },
    };
  }, [scale]);

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
      <div
        className="absolute z-50"
        style={{
          top: `${scaledSizes.topOffset}px`,
          right: `${scaledSizes.rightOffset}px`,
        }}
      >
        <div
          className="shadow-2xl backdrop-blur-2xl border border-white/30"
          style={{
            width: `${scaledSizes.width}px`,
            padding: `${scaledSizes.padding}px`,
            borderRadius: `${scaledSizes.borderRadius}px`,
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <span className="text-gray-700" style={{ fontSize: `${scaledSizes.fontSize.dayName}px` }}>
            Loading weather...
          </span>
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
      className="absolute z-50"
      style={{
        top: `${scaledSizes.topOffset}px`,
        right: `${scaledSizes.rightOffset}px`,
      }}
    >
      <div
        className="shadow-2xl backdrop-blur-2xl border border-white/30"
        style={{
          width: `${scaledSizes.width}px`,
          borderRadius: `${scaledSizes.borderRadius}px`,
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Header */}
        <div
          className="border-b border-gray-600/30"
          style={{
            padding: `${scaledSizes.padding * 4}px ${scaledSizes.padding * 6}px ${scaledSizes.spacing.headerBottom}px`,
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: `${0.5 * scale}px` }}>
            <span className="text-gray-700 font-bold" style={{ fontSize: `${scaledSizes.fontSize.cityName}px` }}>
              Los Angeles
            </span>
            <div className="text-gray-700">
              {getWeatherIcon(weather.current.weathercode, scaledSizes.mainIconSize)}
            </div>
          </div>
          <div className="flex items-baseline" style={{ gap: `${1 * scale}px` }}>
            <span
              className="text-gray-700 font-extralight tracking-tight"
              style={{ fontSize: `${scaledSizes.fontSize.temperature}px` }}
            >
              {currentTemp}
            </span>
            <span className="text-gray-700 font-light" style={{ fontSize: `${scaledSizes.fontSize.degree}px` }}>
              °
            </span>
          </div>
        </div>

        {/* Daily forecast */}
        <div style={{ padding: `${scaledSizes.spacing.dailyPadding * 4}px ${scaledSizes.padding * 6}px` }}>
          <div className="grid grid-cols-7" style={{ gap: `${scaledSizes.spacing.gap}px` }}>
            {days.map((day, i) => (
              <div key={i} className="flex flex-col items-center" style={{ gap: `${scaledSizes.spacing.gap}px` }}>
                <span className="text-gray-700 font-bold" style={{ fontSize: `${scaledSizes.fontSize.dayName}px` }}>
                  {day.day}
                </span>
                <div className="text-gray-700">
                  {getWeatherIcon(day.code, scaledSizes.dayIconSize)}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-700 font-bold" style={{ fontSize: `${scaledSizes.fontSize.high}px` }}>
                    {day.high}°
                  </span>
                  <span className="text-gray-600 font-semibold" style={{ fontSize: `${scaledSizes.fontSize.low}px` }}>
                    {day.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glossy effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: `${scaledSizes.borderRadius}px`,
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%)',
          }}
        />
      </div>
    </motion.div>
  );
}
