'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import MenuBar from './MenuBar';
import AboutModal from './AboutModal';
import WeatherWidget from './WeatherWidget';
import { FileItem, WindowState } from '@/types';
import Image from 'next/image';

// Sistema de archivos del portfolio
const fileSystem: FileItem[] = [
  {
    id: 'readme',
    name: 'readme.txt',
    type: 'text',
    imagePath: '/images/txt.png',
    content: `=== README ===

Welcome to my Portfolio OS!

This is an interactive portfolio designed as an operating system.

HOW TO NAVIGATE:
- Double click on icons to open files and folders
- Drag windows to move them
- Use the buttons in the top bar to close, minimize or maximize
- Check the Projects folder to see my work
- Look at the Hobbies folder to get to know me better
- Open my CV for professional information

CONTACT:
- Email: [your@email.com]
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]

Thanks for visiting!
`,
  },
  {
    id: 'cv',
    name: 'CV.pdf',
    type: 'text',
    imagePath: '/images/cv.png',
    content: `=== CURRICULUM VITAE ===

Name: [Your Name]
Email: [your@email.com]
Phone: [Your Phone]
LinkedIn: [Your LinkedIn]
GitHub: [Your GitHub]

=== PROFESSIONAL SUMMARY ===
[Brief description of your professional profile]

=== EXPERIENCE ===
[Company 1] - [Position] (Date - Date)
- [Achievement or responsibility 1]
- [Achievement or responsibility 2]

[Company 2] - [Position] (Date - Date)
- [Achievement or responsibility 1]
- [Achievement or responsibility 2]

=== EDUCATION ===
[University/Institution] - [Degree] (Year)

=== SKILLS ===
- Languages: JavaScript, TypeScript, Python, etc.
- Frameworks: React, Next.js, Node.js, etc.
- Tools: Git, Docker, AWS, etc.

=== LANGUAGES ===
- Spanish: Native
- English: [Level]
`,
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
        content: `# Project 1

## Description
This is an example project that showcases [main features].

## Technologies Used
- React
- Next.js
- Tailwind CSS

## Features
- Feature 1
- Feature 2
- Feature 3

## Demo
[Link to project]

## Repository
[Link to repository]
`,
      },
      {
        id: 'proyecto2',
        name: 'Project 2',
        type: 'project',
        description: 'Description of project 2',
        technologies: ['TypeScript', 'Node.js', 'PostgreSQL'],
        url: 'https://github.com/your-username/project2',
        imagePath: '/images/proyecto2.png', // PLACEHOLDER
        content: `# Project 2

## Description
This is a backend project that implements [main features].

## Technologies Used
- TypeScript
- Node.js
- PostgreSQL

## Features
- RESTful API
- JWT Authentication
- Relational database

## Repository
[Link to repository]
`,
      },
      {
        id: 'proyecto3',
        name: 'Project 3',
        type: 'project',
        description: 'Description of project 3',
        technologies: ['React Native', 'Firebase', 'Redux'],
        url: 'https://github.com/your-username/project3',
        imagePath: '/images/proyecto3.png', // PLACEHOLDER
        content: `# Project 3

## Description
Mobile application that allows [main features].

## Technologies Used
- React Native
- Firebase
- Redux

## Features
- Cross-platform application
- Authentication with Firebase
- Global state with Redux

## Repository
[Link to repository]
`,
      },
    ],
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
        content: `=== MY MUSICAL TASTES ===

Favorite Genres:
- [Genre 1]
- [Genre 2]
- [Genre 3]

Favorite Artists:
- [Artist 1]
- [Artist 2]
- [Artist 3]

Songs that inspire me while coding:
- [Song 1] - [Artist]
- [Song 2] - [Artist]
- [Song 3] - [Artist]
`,
      },
      {
        id: 'hobbies',
        name: 'Hobbies.txt',
        type: 'text',
        content: `=== MY HOBBIES ===

Activities I enjoy:
- [Hobby 1]: [Brief description]
- [Hobby 2]: [Brief description]
- [Hobby 3]: [Brief description]

Interests:
- [Interest 1]
- [Interest 2]
- [Interest 3]

Currently learning:
- [Topic or skill 1]
- [Topic or skill 2]
`,
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

  const openFile = (file: FileItem) => {
    // Check if window already exists
    const existingWindow = windows.find((w) => w.id === file.id);
    if (existingWindow) {
      // Bring to front and restore if minimized
      setWindows((prev) =>
        prev.map((w) =>
          w.id === file.id
            ? { ...w, isMinimized: false, zIndex: nextZIndex }
            : w
        )
      );
      setNextZIndex((prev) => prev + 1);
      return;
    }

    // Create new window centered
    const windowWidth = 600;
    const windowHeight = 400;
    const screenWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1400;
    const screenHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight : 900;
    const centerX = (screenWidth - windowWidth) / 2;
    const centerY = (screenHeight - windowHeight) / 2;

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
      zIndex: nextZIndex,
      imagePath: file.imagePath,
    };

    setWindows((prev) => [...prev, newWindow]);
    setNextZIndex((prev) => prev + 1);
  };

  const renderFileContent = (file: FileItem): React.ReactNode => {
    if (file.type === 'folder' && file.children) {
      return (
        <div className="grid grid-cols-3 gap-4 p-4">
          {file.children.map((child) => (
            <DesktopIcon key={child.id} file={child} onDoubleClick={openFile} />
          ))}
        </div>
      );
    }

    if (file.type === 'text' || file.type === 'project') {
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
      <WeatherWidget />

      {/* Desktop Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-12 left-4 grid grid-cols-1 gap-2 z-10"
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
