import localFont from 'next/font/local';

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
