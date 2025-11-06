'use client';

import { useState } from 'react';
import TerminalBoot from '@/components/TerminalBoot';
import LoginScreen from '@/components/LoginScreen';
import Desktop from '@/components/Desktop';

export default function Home() {
  const [stage, setStage] = useState<'boot' | 'login' | 'desktop'>('boot');

  return (
    <main className="h-screen w-screen overflow-hidden">
      {stage === 'boot' && <TerminalBoot onComplete={() => setStage('login')} />}
      {stage === 'login' && <LoginScreen onLogin={() => setStage('desktop')} />}
      {stage === 'desktop' && <Desktop onLogout={() => setStage('login')} />}
    </main>
  );
}
