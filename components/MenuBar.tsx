'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Battery, Volume2, Circle } from 'lucide-react';

interface MenuBarProps {
  onLogout: () => void;
  onOpenGear: () => void;
}

export default function MenuBar({ onLogout, onOpenGear }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
    });
  };

  const systemMenuItems = ['About Portfolio', 'My Computer', 'Log Out'];

  const menuItems = [
    { name: 'File', items: ['New', 'Open', 'Close'] },
    { name: 'Edit', items: ['Undo', 'Copy', 'Paste'] },
    { name: 'View', items: ['Zoom', 'Full Screen'] },
  ];

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleSystemMenuClick = (itemName: string) => {
    if (itemName === 'Log Out') {
      onLogout();
    } else if (itemName === 'My Computer') {
      onOpenGear();
    }
    setActiveMenu(null);
  };

  const handleMenuItemClick = (menuName: string, itemName: string) => {
    // Handle other menu items here in the future
    setActiveMenu(null);
  };

  return (
    <>
      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-[45]"
          onClick={() => setActiveMenu(null)}
        />
      )}

      <div className="absolute top-0 left-0 right-0 z-50">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/20 backdrop-blur-2xl border-b border-white/30 px-4 py-1 flex items-center justify-between"
        >
        {/* Left side - Logo and Menus */}
        <div className="flex items-center gap-1">
          {/* System Logo Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('system')}
              className={`px-2 py-1 rounded-md transition-colors ${
                activeMenu === 'system'
                  ? 'bg-white/40'
                  : 'hover:bg-white/20'
              }`}
            >
              <Circle size={16} className="text-gray-700 fill-gray-700" />
            </button>

            {/* System Dropdown Menu */}
            {activeMenu === 'system' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-1 bg-white/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/50 overflow-hidden min-w-[200px] z-[60]"
              >
                {systemMenuItems.map((item, index) => (
                  <div key={item}>
                    <button
                      onClick={() => handleSystemMenuClick(item)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-100/80 transition-colors"
                      style={{ fontFamily: 'var(--font-mochibop)' }}
                    >
                      {item}
                    </button>
                    {index === 1 && (
                      <div className="h-px bg-gray-300 mx-2 my-1" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex items-center gap-1">
            {menuItems.map((menu) => (
              <div key={menu.name} className="relative">
                <button
                  onClick={() => handleMenuClick(menu.name)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeMenu === menu.name
                      ? 'bg-white/40 text-gray-800'
                      : 'text-gray-700 hover:bg-white/20'
                  }`}
                  style={{ fontFamily: 'var(--font-mochibop)' }}
                >
                  {menu.name}
                </button>

                {/* Dropdown Menu */}
                {activeMenu === menu.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-1 bg-white/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/50 overflow-hidden min-w-[180px] z-[60]"
                  >
                    {menu.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleMenuItemClick(menu.name, item)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-100/80 transition-colors"
                        style={{ fontFamily: 'var(--font-mochibop)' }}
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Status Icons and Clock */}
        <div className="flex items-center gap-3">
          {/* Status Icons */}
          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-gray-700" />
            <Battery size={16} className="text-gray-700" />
            <Volume2 size={16} className="text-gray-700" />
          </div>

          {/* Clock */}
          <div className="text-xs text-gray-700 font-medium" style={{ fontFamily: 'var(--font-mochibop)' }}>
            {formatDate(currentTime)} {formatTime(currentTime)}
          </div>
        </div>
      </motion.div>
      </div>
    </>
  );
}
