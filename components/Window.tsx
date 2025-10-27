'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { WindowState } from '@/types';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
}

export default function Window({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  if (window.isMinimized) return null;

  const handleDragStart = (e: React.MouseEvent) => {
    if (window.isMaximized || isResizing) return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - window.position.x, y: e.clientY - window.position.y });
  };

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || window.isMaximized || isResizing) return;
    e.preventDefault();
    onUpdatePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, window.isMaximized, isResizing, dragStart, onUpdatePosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(false); // Ensure dragging is disabled
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || window.isMaximized || isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const minWidth = 400;
    const minHeight = 300;
    const screenWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1400;
    const screenHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight : 900;
    const maxWidth = Math.min(1200, screenWidth * 0.85);
    const maxHeight = Math.min(750, screenHeight * 0.75);

    const deltaX = e.movementX;
    const deltaY = e.movementY;

    let newWidth = window.size.width;
    let newHeight = window.size.height;
    let newX = window.position.x;
    let newY = window.position.y;

    if (resizeDirection.includes('e')) {
      newWidth = Math.max(minWidth, Math.min(maxWidth, window.size.width + deltaX));
    }
    if (resizeDirection.includes('w')) {
      const proposedWidth = window.size.width - deltaX;
      if (proposedWidth >= minWidth && proposedWidth <= maxWidth) {
        newWidth = proposedWidth;
        newX = window.position.x + deltaX;
      }
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(minHeight, Math.min(maxHeight, window.size.height + deltaY));
    }
    if (resizeDirection.includes('n')) {
      const proposedHeight = window.size.height - deltaY;
      if (proposedHeight >= minHeight && proposedHeight <= maxHeight) {
        newHeight = proposedHeight;
        newY = window.position.y + deltaY;
      }
    }

    onUpdateSize({ width: newWidth, height: newHeight });
    if (newX !== window.position.x || newY !== window.position.y) {
      onUpdatePosition({ x: newX, y: newY });
    }
  }, [isResizing, window.isMaximized, isDragging, window.size, window.position, resizeDirection, onUpdateSize, onUpdatePosition]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const windowStyle = window.isMaximized
    ? { width: '100%', height: 'calc(100% - 100px)' }
    : {
        width: window.size.width,
        height: window.size.height,
      };

  return (
    <motion.div
      onMouseDown={onFocus}
      className={`absolute bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-200/50 ${isResizing || isDragging ? 'select-none' : ''}`}
      style={{
        ...windowStyle,
        zIndex: window.zIndex,
        left: window.isMaximized ? 0 : window.position.x,
        top: window.isMaximized ? 0 : window.position.y,
        userSelect: (isResizing || isDragging) ? 'none' : 'auto',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Title Bar */}
      <div
        ref={dragRef}
        onMouseDown={handleDragStart}
        className="bg-gray-50/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between cursor-move select-none border-b border-gray-200/50"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
          />
        </div>
        <h3 className="absolute left-1/2 transform -translate-x-1/2 text-gray-700 font-semibold text-sm">
          {window.title}
        </h3>
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-49px)] overflow-auto p-6 bg-white/50">
        {window.content}
      </div>

      {/* Resize Handles */}
      {!window.isMaximized && (
        <>
          {/* Edges */}
          <div
            onMouseDown={handleResizeStart('n')}
            className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize hover:bg-blue-500/20"
          />
          <div
            onMouseDown={handleResizeStart('s')}
            className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize hover:bg-blue-500/20"
          />
          <div
            onMouseDown={handleResizeStart('w')}
            className="absolute top-2 bottom-2 left-0 w-1 cursor-ew-resize hover:bg-blue-500/20"
          />
          <div
            onMouseDown={handleResizeStart('e')}
            className="absolute top-2 bottom-2 right-0 w-1 cursor-ew-resize hover:bg-blue-500/20"
          />

          {/* Corners */}
          <div
            onMouseDown={handleResizeStart('nw')}
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10"
          />
          <div
            onMouseDown={handleResizeStart('ne')}
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10"
          />
          <div
            onMouseDown={handleResizeStart('sw')}
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10"
          />
          <div
            onMouseDown={handleResizeStart('se')}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
          />
        </>
      )}
    </motion.div>
  );
}
