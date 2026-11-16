import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BREXAL — Intelligence, engineered to move",
  description: "AI-powered observability, real-time application monitoring, and automated incident management for modern engineering teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1F1E1D] font-sans selection:bg-[#CC5A2B]/15 selection:text-[#1F1E1D]">
        {children}
      </body>
    </html>
  );
}
