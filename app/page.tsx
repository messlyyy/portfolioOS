'use client';

import { useState, useEffect } from 'react';
import TerminalBoot from '@/components/TerminalBoot';
import LoginScreen from '@/components/LoginScreen';
import Desktop from '@/components/Desktop';

export default function Home() {
  const [stage, setStage] = useState<'boot' | 'login' | 'desktop'>('boot');

  useEffect(() => {
    // Simulate boot sequence duration
    if (stage === 'boot') {
      const timer = setTimeout(() => {
        setStage('login');
      }, 4000); // 4 seconds boot animation
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <main className="h-screen w-screen overflow-hidden">
      {stage === 'boot' && <TerminalBoot onComplete={() => setStage('login')} />}
      {stage === 'login' && <LoginScreen onLogin={() => setStage('desktop')} />}
      {stage === 'desktop' && <Desktop onLogout={() => setStage('login')} />}
    </main>
  );
}
