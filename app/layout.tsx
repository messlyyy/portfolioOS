import type { Metadata } from "next";
import "./globals.css";
import { mochibop, jetbrainsMono, firaCode } from "./fonts";

export const metadata: Metadata = {
  title: "messly",
  description: "Sistema Operativo Portfolio - Experiencia interactiva de portafolio",
  icons: {
    icon: '/favicon/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${mochibop.variable} ${jetbrainsMono.variable} ${firaCode.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
