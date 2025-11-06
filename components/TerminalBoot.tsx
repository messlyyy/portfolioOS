'use client';

import { useEffect, useState } from 'react';

interface TerminalBootProps {
  onComplete: () => void;
}

export default function TerminalBoot({ onComplete }: TerminalBootProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const speedMultiplier = 0.5;

  const steps = [
    { text: 'SYSTEM', delay: 100, isHeader: true },
    { text: 'Welcome to messly.xyz terminal [Version 1.0.0]', delay: 30, isHeader: false },
    { text: '', delay: 500, isHeader: false },
    { text: 'COMMAND', delay: 100, isHeader: true },
    { text: '$ initialize messly.xyz', delay: 50, isHeader: false },
    { text: '', delay: 300, isHeader: false },
    { text: 'OUTPUT', delay: 100, isHeader: true },
    { text: 'Initializing messly.xyz..............Done', delay: 40, isHeader: false },
    { text: 'Loading core modules..............Done', delay: 40, isHeader: false },
    { text: 'Establishing secure connection....Done', delay: 40, isHeader: false },
    { text: 'Verifying integrity...............Done', delay: 40, isHeader: false },
    { text: '', delay: 500, isHeader: false },
    { text: 'SYSTEM', delay: 100, isHeader: true },
    { text: 'messly.xyz initialized successfully.', delay: 30, isHeader: false },
  ].map((step) => ({ ...step, delay: step.delay * speedMultiplier }));

  useEffect(() => {
    if (currentStep >= steps.length) {
      setTimeout(onComplete, 800 * speedMultiplier);
      return;
    }

    const step = steps[currentStep];
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex <= step.text.length) {
        setDisplayedText(step.text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          setDisplayedText('');
        }, 200 * speedMultiplier);
      }
    }, step.delay);

    return () => clearInterval(typeInterval);
  }, [currentStep, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-3xl space-y-2 font-mono">
        {steps.slice(0, currentStep).map((step, index) => (
          <div
            key={index}
            className={`${
              step.isHeader
                ? 'text-gray-500 text-sm mt-4 font-bold'
                : step.text.startsWith('$')
                ? 'text-pink-500 font-semibold'
                : 'text-gray-800'
            }`}
          >
            {step.text}
          </div>
        ))}
        {currentStep < steps.length && (
          <div
            className={`${
              steps[currentStep].isHeader
                ? 'text-gray-500 text-sm mt-4 font-bold'
                : steps[currentStep].text.startsWith('$')
                ? 'text-pink-500 font-semibold'
                : 'text-gray-800'
            }`}
          >
            {displayedText}
            {showCursor && (
              <span className="inline-block w-2 h-4 bg-pink-500 ml-1 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
