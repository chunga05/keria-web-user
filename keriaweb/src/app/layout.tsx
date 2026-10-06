
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteDescription =
  "DearKeriaVN tồn tại với mục tiêu ủng hộ Support xuất sắc nhất lịch sử Liên Minh Huyền Thoại - Ryu 'Keria' Minseok, cùng đồng hành và lưu giữ lại những dấu ấn rực rỡ theo từng cột mốc sự nghiệp, dõi theo mỗi bước chân nỗ lực trên hành trình vĩ đại của Quái vật Thiên tài.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DEARKERIAVN",
    template: "%s | DEARKERIAVN",
  },
  description: siteDescription,
  applicationName: "DEARKERIAVN",
  openGraph: {
    title: "DEARKERIAVN",
    description: siteDescription,
    url: "/",
    siteName: "DEARKERIAVN",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1024,
        height: 728,
        alt: "DEARKERIAVN",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEARKERIAVN",
    description: siteDescription,
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
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

