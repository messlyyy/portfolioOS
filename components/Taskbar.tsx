'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Folder, FileText } from 'lucide-react';
import { WindowState } from '@/types';

interface TaskbarProps {
  windows: WindowState[];
  onWindowClick: (windowId: string) => void;
}

export default function Taskbar({ windows, onWindowClick }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-2 z-50 pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto bg-white/30 backdrop-blur-3xl rounded-2xl px-3 py-2 shadow-xl border border-white/40 flex items-center gap-1"
      >
        {/* Start Menu Button */}
        <motion.button
          whileHover={{ scale: 1.15, y: -6 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all"
        >
          <Menu size={26} className="text-gray-700" />
        </motion.button>

        {/* Separator */}
        <div className="w-px h-10 bg-gray-400/30 mx-1" />

        {/* Window Icons */}
        {windows.map((window) => (
          <motion.button
            key={window.id}
            whileHover={{ scale: 1.15, y: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onWindowClick(window.id)}
            className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
              window.isMinimized
                ? 'bg-white/40'
                : 'bg-white/60 shadow-md'
            }`}
          >
            {window.imagePath ? (
              <img
                src={window.imagePath}
                alt={window.title}
                className="w-10 h-10 object-contain"
              />
            ) : window.title.includes('Proyectos') || window.title.includes('Gustos') ? (
              <Folder size={30} className="text-blue-500" />
            ) : (
              <FileText size={30} className="text-blue-600" />
            )}
            {!window.isMinimized && (
              <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-gray-700" />
            )}
          </motion.button>
        ))}

        {/* Separator */}
        {windows.length > 0 && <div className="w-px h-10 bg-gray-400/30 mx-1" />}

        {/* Clock */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1 rounded-xl bg-white/40"
        >
          <div className="text-gray-700 text-xs font-semibold text-center">
            {formatTime(currentTime)}
          </div>
          <div className="text-gray-600 text-[9px] font-medium text-center">
            {currentTime.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
