'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalBootProps {
  onComplete: () => void;
}

const bootMessages = [
  'Portfolio OS v1.0.0',
  'Starting system...',
  '',
  'Loading kernel modules...',
  '[OK] CPU initialized',
  '[OK] RAM: 16GB available',
  '[OK] File system mounted',
  '[OK] Network drivers loaded',
  '[OK] Graphics interface started',
  '',
  'Preparing user experience...',
  '[OK] UI components loaded',
  '[OK] Animations enabled',
  '[OK] Window system ready',
  '',
  'System started successfully.',
  'Press any key to continue...',
];

export default function TerminalBoot({ onComplete }: TerminalBootProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentIndex < bootMessages.length) {
      const delay = bootMessages[currentIndex] === '' ? 100 : Math.random() * 100 + 50;
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, bootMessages[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (currentIndex >= bootMessages.length) {
        onComplete();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('click', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      window.removeEventListener('click', handleKeyPress);
    };
  }, [currentIndex, onComplete]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 overflow-auto font-mono flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-pink-200">
        <div className="space-y-2">
          {displayedLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-purple-600 font-medium"
            >
              {line && <span className="text-pink-400 mr-2">♡</span>}
              {line}
            </motion.div>
          ))}
          {currentIndex < bootMessages.length && (
            <div className="inline-block">
              {showCursor && <span className="text-purple-400 animate-pulse">✦</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
