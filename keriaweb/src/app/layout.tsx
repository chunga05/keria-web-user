import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google';
import Image from "next/image";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Protection from "@/components/Protection";


const montserrat = Montserrat({
  subsets: ["vietnamese"], 
  weight: ["300", "400", "500", "600", "700", "800"], 
  variable: "--font-montserrat", 
});

export const metadata: Metadata = {
  title: "Dear Keria VN", 
  description: "Fanpage ủng hộ Ryu 'Keria' Minseok",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false, 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${montserrat.variable} font-sans`}>
      <body className="min-h-screen w-full relative font-sans touch-manipulation overflow-x-clip bg-[#0a0a0a]">
        
        {/* Layer 1: Background tràn màn hình (Nằm dưới cùng nhất z-[-1]) */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <Image
            src="/images/locker.png"
            alt="Locker Background"
            fill
            className="w-full h-full object-cover opacity-70" 
            quality={75}
          />
        </div>

        {/* Nội dung chính */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          <Header />

          {/* Phần nội dung của từng trang */}
          <div className="flex-grow flex flex-col w-full relative">
            {children}
          </div>
          
          <Footer />
        </div>
        
        {/* Component bảo vệ trang web */}
        <Protection />
      </body>
    </html>
  );
}