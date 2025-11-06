'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

// Constantes de resolución
const MIN_WIDTH = 1280;
const MIN_HEIGHT = 720;

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [password, setPassword] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });
  const [meetsMinResolution, setMeetsMinResolution] = useState(true);
  const targetPassword = '********';

  // Detectar tamaño de pantalla
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
      setMeetsMinResolution(width >= MIN_WIDTH && height >= MIN_HEIGHT);
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isTyping && password.length < targetPassword.length) {
      const timer = setTimeout(() => {
        setPassword(prev => prev + '*');
      }, 150);
      return () => clearTimeout(timer);
    } else if (password.length === targetPassword.length) {
      const timer = setTimeout(() => {
        onLogin();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isTyping, password, onLogin]);

  const handleClick = () => {
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  // Minimum resolution screen
  if (!meetsMinResolution) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Unsupported Resolution</h1>
          <p className="text-gray-600 text-lg mb-2">
            This application requires a minimum resolution of {MIN_WIDTH}x{MIN_HEIGHT}
          </p>
          <p className="text-gray-500">
            Current resolution: {screenSize.width}x{screenSize.height}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen relative overflow-hidden cursor-pointer"
      onClick={handleClick}
      style={{
        backgroundImage: 'url(/images/wallpaper.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#fef5ff',
      }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-purple-100/20 to-blue-100/20" />

      {/* Clock at top center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-16 left-0 right-0 text-center flex flex-col items-center"
      >
        <h1 className="text-8xl font-bold text-white drop-shadow-2xl tracking-tight" style={{ fontFamily: 'var(--font-mochibop)' }}>
          {formatTime(currentTime)}
        </h1>
        <p className="text-xl text-white/90 mt-2 drop-shadow-lg capitalize" style={{ fontFamily: 'var(--font-mochibop)' }}>
          {formatDate(currentTime)}
        </p>
      </motion.div>

      {/* Login section */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-6">
        {/* User Avatar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-white/40 backdrop-blur-xl flex items-center justify-center shadow-2xl border-4 border-white/60"
        >
          <User size={40} className="text-white" />
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-mochibop)' }}>
            Guest
          </h2>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-80"
        >
          <div className="relative">
            <input
              type="password"
              value={password}
              readOnly
              placeholder={isTyping ? '' : 'Click to continue'}
              className="w-full px-6 py-3 bg-white/30 backdrop-blur-xl border-2 border-white/50 rounded-full text-white placeholder-white/70 text-center focus:outline-none focus:ring-2 focus:ring-white/60 transition-all font-medium shadow-xl"
              style={{ fontFamily: 'var(--font-mochibop)' }}
            />
            {isTyping && password.length < targetPassword.length && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-2 h-4 bg-white rounded-full"
              />
            )}
          </div>
        </motion.div>

        {/* Hint Text */}
        {isTyping && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-white/90 text-center font-semibold drop-shadow-lg"
            style={{ fontFamily: 'var(--font-mochibop)' }}
          >
            Authenticating...
          </motion.p>
        )}
      </div>
    </div>
  );
}
