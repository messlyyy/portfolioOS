'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import MenuBar from './MenuBar';
import AboutModal from './AboutModal';
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

Bienvenido a mi Portfolio OS!

Este es un portfolio interactivo disenado como un sistema operativo.

COMO NAVEGAR:
- Haz doble click en los iconos para abrir archivos y carpetas
- Arrastra las ventanas para moverlas
- Usa los botones de la barra superior para cerrar, minimizar o maximizar
- Revisa la carpeta Proyectos para ver mis trabajos
- Mira la carpeta Gustos para conocerme mejor
- Abre mi CV para informacion profesional

CONTACTO:
- Email: [tu@email.com]
- LinkedIn: [Tu LinkedIn]
- GitHub: [Tu GitHub]

Gracias por visitar!
`,
  },
  {
    id: 'cv',
    name: 'CV.pdf',
    type: 'text',
    imagePath: '/images/cv.png',
    content: `=== CURRICULUM VITAE ===

Nombre: [Tu Nombre]
Email: [tu@email.com]
Telefono: [Tu Telefono]
LinkedIn: [Tu LinkedIn]
GitHub: [Tu GitHub]

=== RESUMEN PROFESIONAL ===
[Descripcion breve de tu perfil profesional]

=== EXPERIENCIA ===
[Empresa 1] - [Puesto] (Fecha - Fecha)
- [Logro o responsabilidad 1]
- [Logro o responsabilidad 2]

[Empresa 2] - [Puesto] (Fecha - Fecha)
- [Logro o responsabilidad 1]
- [Logro o responsabilidad 2]

=== EDUCACION ===
[Universidad/Institucion] - [Titulo] (Ano)

=== HABILIDADES ===
- Lenguajes: JavaScript, TypeScript, Python, etc.
- Frameworks: React, Next.js, Node.js, etc.
- Herramientas: Git, Docker, AWS, etc.

=== IDIOMAS ===
- Espanol: Nativo
- Ingles: [Nivel]
`,
  },
  {
    id: 'proyectos',
    name: 'Proyectos',
    type: 'folder',
    imagePath: '/icons/folder-projects.png', // PLACEHOLDER
    children: [
      {
        id: 'proyecto1',
        name: 'Proyecto 1',
        type: 'project',
        description: 'Descripcion del proyecto 1',
        technologies: ['React', 'Next.js', 'Tailwind CSS'],
        url: 'https://github.com/tu-usuario/proyecto1',
        imagePath: '/images/proyecto1.png', // PLACEHOLDER
        content: `# Proyecto 1

## Descripcion
Este es un proyecto ejemplo que muestra [caracteristicas principales].

## Tecnologias Utilizadas
- React
- Next.js
- Tailwind CSS

## Caracteristicas
- Feature 1
- Feature 2
- Feature 3

## Demo
[Enlace al proyecto]

## Repositorio
[Enlace al repositorio]
`,
      },
      {
        id: 'proyecto2',
        name: 'Proyecto 2',
        type: 'project',
        description: 'Descripcion del proyecto 2',
        technologies: ['TypeScript', 'Node.js', 'PostgreSQL'],
        url: 'https://github.com/tu-usuario/proyecto2',
        imagePath: '/images/proyecto2.png', // PLACEHOLDER
        content: `# Proyecto 2

## Descripcion
Este es un proyecto backend que implementa [caracteristicas principales].

## Tecnologias Utilizadas
- TypeScript
- Node.js
- PostgreSQL

## Caracteristicas
- API RESTful
- Autenticacion JWT
- Base de datos relacional

## Repositorio
[Enlace al repositorio]
`,
      },
      {
        id: 'proyecto3',
        name: 'Proyecto 3',
        type: 'project',
        description: 'Descripcion del proyecto 3',
        technologies: ['React Native', 'Firebase', 'Redux'],
        url: 'https://github.com/tu-usuario/proyecto3',
        imagePath: '/images/proyecto3.png', // PLACEHOLDER
        content: `# Proyecto 3

## Descripcion
Aplicacion movil que permite [caracteristicas principales].

## Tecnologias Utilizadas
- React Native
- Firebase
- Redux

## Caracteristicas
- Aplicacion multiplataforma
- Autenticacion con Firebase
- Estado global con Redux

## Repositorio
[Enlace al repositorio]
`,
      },
    ],
  },
  {
    id: 'gustos',
    name: 'Gustos',
    type: 'folder',
    imagePath: '/icons/folder-hobbies.png', // PLACEHOLDER
    children: [
      {
        id: 'musica',
        name: 'Musica.txt',
        type: 'text',
        content: `=== MIS GUSTOS MUSICALES ===

Generos Favoritos:
- [Genero 1]
- [Genero 2]
- [Genero 3]

Artistas Favoritos:
- [Artista 1]
- [Artista 2]
- [Artista 3]

Canciones que me inspiran mientras codifico:
- [Cancion 1] - [Artista]
- [Cancion 2] - [Artista]
- [Cancion 3] - [Artista]
`,
      },
      {
        id: 'hobbies',
        name: 'Hobbies.txt',
        type: 'text',
        content: `=== MIS HOBBIES ===

Actividades que disfruto:
- [Hobby 1]: [Descripcion breve]
- [Hobby 2]: [Descripcion breve]
- [Hobby 3]: [Descripcion breve]

Intereses:
- [Interes 1]
- [Interes 2]
- [Interes 3]

Aprendiendo actualmente:
- [Tema o habilidad 1]
- [Tema o habilidad 2]
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

    return <div>Tipo de archivo no soportado</div>;
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
