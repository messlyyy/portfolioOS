'use client';

import { motion } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-200/50 w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="bg-gray-50/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white/50 text-center">
          {/* Laptop Image */}
          <div className="flex justify-center mb-1">
            <div className="w-24 h-24 relative flex items-center justify-center">
              <div className="text-6xl">💻</div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-mochibop)' }}>
            My Setup
          </h2>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Laptop Specs */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-1" style={{ fontFamily: 'var(--font-mochibop)' }}>
                Laptop
              </h3>
              <p className="text-sm text-gray-700 font-medium mb-1">MacBook Air 14"</p>

              <div className="space-y-0.5 text-sm">
                <div className="flex justify-between">
                  <div className="text-gray-600">Processor</div>
                  <div className="text-gray-800 font-medium">M1</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-600">Memory</div>
                  <div className="text-gray-800 font-medium">8GB</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-600">Storage</div>
                  <div className="text-gray-800 font-medium">256GB SSD</div>
                </div>
              </div>
            </div>

            {/* Desktop Specs */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-1" style={{ fontFamily: 'var(--font-mochibop)' }}>
                Desktop
              </h3>
              <p className="text-sm text-gray-700 font-medium mb-1">Custom Gaming PC</p>

              <div className="space-y-0.5 text-sm">
                <div className="flex justify-between">
                  <div className="text-gray-600">Processor</div>
                  <div className="text-gray-800 font-medium">Ryzen 7 5800X</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-600">GPU</div>
                  <div className="text-gray-800 font-medium">RTX 3060</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-600">Motherboard</div>
                  <div className="text-gray-800 font-medium">B450M PRO-M2</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-600">Cooling</div>
                  <div className="text-gray-800 font-medium">DeepCool LE520</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-600">Memory</div>
                  <div className="text-gray-800 font-medium">16GB DDR4</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-600">Storage</div>
                  <div className="text-gray-800 font-medium">1TB SSD</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-600">PSU</div>
                  <div className="text-gray-800 font-medium">Corsair CX750</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
