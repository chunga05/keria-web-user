
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
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
  title: "DEAR KERIA VN",
  description: "DEAR KERIA VN",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${montserrat.variable} font-sans`}
    >
      <head>
        {/* =====================================================
            VIEWPORT
        ====================================================== */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        {/* =====================================================
            OPEN GRAPH
        ====================================================== */}

        <meta
          property="og:title"
          content="DEAR KERIA VN"
        />

        <meta
          property="og:description"
          content="DEAR KERIA VN"
        />

        <meta
          property="og:url"
          content="https://xc5kf3vh-3000.asse.devtunnels.ms"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:site_name"
          content="DEAR KERIA VN"
        />

        <meta
          property="og:image"
          content="https://xc5kf3vh-3000.asse.devtunnels.ms/opengraph-image.png"
        />

        <meta
          property="og:image:type"
          content="image/png"
        />

        <meta
          property="og:image:width"
          content="1024"
        />

        <meta
          property="og:image:height"
          content="728"
        />

        <meta
          property="og:image:alt"
          content="DEAR KERIA VN"
        />

        {/* =====================================================
            TWITTER / X
        ====================================================== */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="DEAR KERIA VN"
        />

        <meta
          name="twitter:description"
          content="DEAR KERIA VN"
        />

        <meta
          name="twitter:image"
          content="https://xc5kf3vh-3000.asse.devtunnels.ms/opengraph-image.png"
        />
      </head>

      <body className="min-h-screen w-full relative font-sans touch-manipulation overflow-x-clip bg-[#0a0a0a]">

        {/* =====================================================
            BACKGROUND
        ====================================================== */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <Image
            src="/images/locker.png"
            alt="Locker Background"
            fill
            sizes="100vw"
            className="w-full h-full object-cover opacity-70"
            quality={75}
          />
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">

          <Header />

          {/* Nội dung từng trang */}
          <div className="flex-grow flex flex-col w-full relative">
            {children}
          </div>

          <Footer />

        </div>

        {/* =====================================================
            PROTECTION
        ====================================================== */}
        <Protection />

      </body>
    </html>
  );
}

