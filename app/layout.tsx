import type { Metadata } from "next";
import "./globals.css";
import { mochibop } from "./fonts";

export const metadata: Metadata = {
  title: "Portfolio OS",
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
      <body className={`${mochibop.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
