'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import MenuBar from './MenuBar';
import AboutModal from './AboutModal';
import WeatherWidget from './WeatherWidget';
import { FileItem, WindowState } from '@/types';
import Image from 'next/image';

// Constantes de resolución
const MIN_WIDTH = 1280;
const MIN_HEIGHT = 720;
const REFERENCE_WIDTH = 1920;
const REFERENCE_HEIGHT = 1080;

// Sistema de archivos del portfolio
const fileSystem: FileItem[] = [
  {
    id: 'settings',
    name: 'Settings',
    type: 'text',
    imagePath: '/icons/settings.png',
    content: 'soon...',
  },
  {
    id: 'readme',
    name: 'readme.txt',
    type: 'text',
    imagePath: '/icons/txt.png',
    content: `readme.txt

Welcome to my Portfolio (OS)!

This is an interactive portfolio designed as an operating system.

HOW TO NAVIGATE:
- Double click on icons to open files and folders
- Drag windows to move them
- Use the buttons in the top bar to close, minimize or maximize
- Check the Projects folder to see my work (empty 😭)
- Look at the Hobbies folder to get to know me better (working on it...)
- Open my CV for professional information (hehe, it's empty too)


`,
  },
  {
    id: 'browser',
    name: 'Browser',
    type: 'text',
    imagePath: '/icons/browser.png',
    content: 'soon...',
  },
  {
    id: 'cv',
    name: 'CV.pdf',
    type: 'text',
    imagePath: '/icons/cv.png',
    content: `cv.pdf

hai
`,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    type: 'text',
    imagePath: '/icons/terminal.png',
    content: 'soon...',
  },
  {
    id: 'proyectos',
    name: 'Projects',
    type: 'folder',
    imagePath: '/icons/folder-projects.png', // PLACEHOLDER
    children: [
      {
        id: 'proyecto1',
        name: 'Project 1',
        type: 'project',
        description: 'Description of project 1',
        technologies: ['React', 'Next.js', 'Tailwind CSS'],
        url: 'https://github.com/your-username/project1',
        imagePath: '/images/proyecto1.png', // PLACEHOLDER
        content: 'soon...',
      },
      {
        id: 'proyecto2',
        name: 'Project 2',
        type: 'project',
        description: 'Description of project 2',
        technologies: ['TypeScript', 'Node.js', 'PostgreSQL'],
        url: 'https://github.com/your-username/project2',
        imagePath: '/images/proyecto2.png', // PLACEHOLDER
        content: 'soon...',
      },
      {
        id: 'proyecto3',
        name: 'Project 3',
        type: 'project',
        description: 'Description of project 3',
        technologies: ['React Native', 'Firebase', 'Redux'],
        url: 'https://github.com/your-username/project3',
        imagePath: '/images/proyecto3.png', // PLACEHOLDER
        content: 'soon...',
      },
    ],
  },
  {
    id: 'gallery',
    name: 'Gallery',
    type: 'text',
    imagePath: '/icons/gallery.png',
    content: 'soon...',
  },
  {
    id: 'gustos',
    name: 'Hobbies',
    type: 'folder',
    imagePath: '/icons/folder-hobbies.png', // PLACEHOLDER
    children: [
      {
        id: 'musica',
        name: 'Music.txt',
        type: 'text',
        imagePath: '/icons/music.png',
        content: 'soon...',
      },
      {
        id: 'hobbies',
        name: 'Hobbies.txt',
        type: 'text',
        imagePath: '/icons/hobbies.png',
        content: 'soon...',
      },
    ],
  },
];

interface DesktopProps {
  onLogout: () => void;
}

export default function Desktop({ onLogout }: DesktopProps) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });
  const [initialWindowPositions, setInitialWindowPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [meetsMinResolution, setMeetsMinResolution] = useState(true);

  const openFile = (file: FileItem) => {
    // Get the highest zIndex from all existing windows
    const maxExistingZIndex = windows.length > 0
      ? Math.max(...windows.map(w => w.zIndex))
      : 99;

    // Check if window already exists
    const existingWindow = windows.find((w) => w.id === file.id);
    if (existingWindow) {
      // Bring to front and restore if minimized with highest zIndex
      const topZIndex = Math.max(maxExistingZIndex + 1, nextZIndex);
      setWindows((prev) =>
        prev.map((w) =>
          w.id === file.id
            ? { ...w, isMinimized: false, zIndex: topZIndex }
            : w
        )
      );
      setNextZIndex(topZIndex + 1);
      return;
    }

    // Create new window centered
    const windowWidth = 600;
    const windowHeight = 400;
    const screenWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1400;
    const screenHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight : 900;
    const centerX = (screenWidth - windowWidth) / 2;
    const centerY = (screenHeight - windowHeight) / 2;

    // Ensure new window always has the highest zIndex
    const newZIndex = Math.max(maxExistingZIndex + 1, nextZIndex);
    setNextZIndex(newZIndex + 1);

    const newWindow: WindowState = {
      id: file.id,
      title: file.name,
      content: renderFileContent(file),
      isMinimized: false,
      isMaximized: false,
      position: {
        x: centerX,
        y: centerY - 50, // Slightly higher to account for dock
      },
      size: { width: windowWidth, height: windowHeight },
      zIndex: newZIndex,
      imagePath: file.imagePath,
    };

    setWindows((prev) => [...prev, newWindow]);

    // Guardar posición inicial relativa
    setInitialWindowPositions((prev) => {
      const newMap = new Map(prev);
      newMap.set(file.id, {
        x: centerX / screenWidth,
        y: (centerY - 50) / screenHeight,
      });
      return newMap;
    });

    // Force focus on the new window after a microtask to ensure it's on top
    Promise.resolve().then(() => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === file.id
            ? { ...w, zIndex: Math.max(...prev.map(win => win.zIndex)) + 1 }
            : w
        )
      );
      setNextZIndex((prev) => Math.max(prev, Math.max(...windows.map(w => w.zIndex), newZIndex)) + 2);
    });
  };

  // Detectar tamaño de pantalla inicial y cambios
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

  // Reposicionar ventanas cuando cambia el tamaño de la pantalla
  useEffect(() => {
    if (!meetsMinResolution) return;

    setWindows((prev) =>
      prev.map((w) => {
        const initialPos = initialWindowPositions.get(w.id);
        if (!initialPos) return w;

        // Calcular nueva posición basada en la proporción de la pantalla
        const newX = initialPos.x * screenSize.width;
        const newY = initialPos.y * screenSize.height;

        return {
          ...w,
          position: { x: newX, y: newY },
        };
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize, meetsMinResolution]);

  const renderFileContent = (file: FileItem): React.ReactNode => {
    if (file.type === 'folder' && file.children) {
      return (
        <div
          className="grid grid-cols-3 gap-4 p-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {file.children.map((child) => (
            <DesktopIcon key={child.id} file={child} onDoubleClick={openFile} />
          ))}
        </div>
      );
    }

    if (file.type === 'text' || file.type === 'project') {
      // Si el contenido es "soon...", mostrar pantalla en blanco centrada
      if (file.content === 'soon...') {
        return (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <p className="text-gray-400 text-2xl font-light">soon...</p>
          </div>
        );
      }

      return (
        <div className="max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            {file.content}
          </pre>
          {file.imagePath && (
            <div className="mt-4 relative w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
              <p className="text-gray-500 font-medium">
                PLACEHOLDER: Imagen del proyecto en {file.imagePath}
              </p>
            </div>
          )}
          {file.technologies && (
            <div className="mt-4 flex flex-wrap gap-2">
              {file.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold border border-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <div>File type not supported</div>;
  };

  const closeWindow = (windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  const focusWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? { ...w, zIndex: nextZIndex, isMinimized: false }
          : w
      )
    );
    setNextZIndex((prev) => prev + 1);
  };

  const updateWindowPosition = (
    windowId: string,
    position: { x: number; y: number }
  ) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, position } : w))
    );
  };

  const updateWindowSize = (
    windowId: string,
    size: { width: number; height: number }
  ) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, size } : w))
    );
  };

  const showAbout = () => {
    setShowAboutModal(true);
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
      className="h-screen w-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/wallpaper.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#fef5ff', // Fallback pastel background
      }}
    >
      {/* Pastel overlay - adjust opacity to see wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-purple-100/30 to-blue-100/30" />

      {/* Menu Bar */}
      <MenuBar onLogout={onLogout} onOpenGear={showAbout} />

      {/* Weather Widget */}
      <WeatherWidget screenWidth={screenSize.width} screenHeight={screenSize.height} />

      {/* Desktop Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-12 left-4 grid grid-cols-2 grid-rows-4 gap-2 z-10"
      >
        {fileSystem.map((file) => (
          <DesktopIcon key={file.id} file={file} onDoubleClick={openFile} />
        ))}
      </motion.div>

      {/* Windows */}
      <div className="absolute inset-0">
        {windows.map((window) => (
          <Window
            key={window.id}
            window={window}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            onUpdatePosition={(pos) => updateWindowPosition(window.id, pos)}
            onUpdateSize={(size) => updateWindowSize(window.id, size)}
          />
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar windows={windows} onWindowClick={focusWindow} />

      {/* About Modal */}
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
    </div>
  );
}
