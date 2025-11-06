'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Image as ImageIcon, Code } from 'lucide-react';
import { FileItem } from '@/types';
import Image from 'next/image';

interface DesktopIconProps {
  file: FileItem;
  onDoubleClick: (file: FileItem) => void;
}

export default function DesktopIcon({ file, onDoubleClick }: DesktopIconProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const getIcon = () => {
    if (file.imagePath) {
      return (
        <div className="w-24 h-24 relative pointer-events-none">
          <Image
            src={file.imagePath}
            alt={file.name}
            fill
            className="object-contain pointer-events-none select-none"
            draggable={false}
            unoptimized
          />
        </div>
      );
    }

    switch (file.type) {
      case 'folder':
        return <Folder size={72} className="text-blue-500" />;
      case 'text':
        return <FileText size={72} className="text-gray-600" />;
      case 'image':
        return <ImageIcon size={72} className="text-blue-500" />;
      case 'project':
        return <Code size={72} className="text-blue-600" />;
      default:
        return <FileText size={72} className="text-gray-500" />;
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent window
    e.preventDefault(); // Prevent default behavior
    if (!isDragging) {
      onDoubleClick(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent focusing parent window
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      x={position.x}
      y={position.y}
      onDragStart={() => setIsDragging(true)}
      onDrag={(_, info) => {
        setPosition({
          x: info.point.x - info.offset.x,
          y: info.point.y - info.offset.y,
        });
      }}
      onDragEnd={() => {
        setTimeout(() => setIsDragging(false), 100);
      }}
      whileHover={{ scale: 1.08 }}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      className="flex flex-col items-center justify-center p-4 cursor-grab active:cursor-grabbing w-32 group select-none"
    >
      <div className="mb-2">{getIcon()}</div>
      <p className="text-sm text-gray-700 font-semibold text-center break-words w-full group-hover:text-blue-600 transition-colors drop-shadow-md">
        {file.name}
      </p>
    </motion.div>
  );
}
