import localFont from 'next/font/local';
import { JetBrains_Mono, Fira_Code } from 'next/font/google';

export const mochibop = localFont({
  src: [
    {
      path: '../public/fonts/mochibop.demo.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/mochibop.bold-demo.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-mochibop',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});
