import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Montserrat } from 'next/font/google';
import Image from "next/image";

import Header from "@/components/header";
import Footer from "@/components/footer";
import FallingStars from "@/components/FallingStars";
import { Meteors } from "@/components/ui/meteors";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body className="min-h-screen w-full relative font-sans touch-manipulation overflow-x-hidden bg-[#0a0a0a]">
        
        {/* Layer 1: Background tràn màn hình (Nằm dưới cùng nhất z-[-1]) */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <Image
            src="/images/locker.png"
            alt="Locker Background"
            fill
            className="w-full h-full object-cover opacity-70" 
            priority
            quality={100}
          />
        </div>

        {/* Layer 2: Lớp nền sao rơi (Nằm trên ảnh nền, dưới nội dung) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <FallingStars />
          <Meteors number={60} />
        </div>
        
        {/* Layer 3: VÙNG KHUNG CHÍNH (Nằm trên cùng z-10) */}
        <div className="relative z-10 w-[75%] lg:w-[70%] max-w-[1440px] mx-auto min-h-screen flex flex-col shadow-2xl">
          <Header />

          {/* Phần nội dung của từng trang */}
          <div className="flex-grow flex flex-col w-full relative">
            {children}
          </div>
          
          <Footer />
        </div>
        
      </body>
    </html>
  );
}