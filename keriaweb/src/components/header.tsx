"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ActiveIndicator from "@/components/ui/ActiveIndicator";

// NẾU IMPORT NÀY BỊ LỖI: Hãy đổi thành đường dẫn tương đối. 
// Ví dụ: import { supabase } from "../lib/supabase"; (tùy vào vị trí thư mục của bạn)
import { supabase } from "@/lib/supabase"; 

const NAV_LINKS = [
  { 
    name: "TRANG CHỦ", 
    href: "/" 
  },
  { 
    name: "KERIA'S", 
    href: "/kerias",
    subLinks: [
      { name: "Thành tích", href: "/kerias/thanh-tich" },
      { name: "Lịch trình", href: "/kerias/lich-trinh" },
    ]
  },
  { 
    name: "HOẠT ĐỘNG", 
    href: "/hoat-dong",
    subLinks: [
      { name: "Lời nhắn", href: "/hoat-dong/loi-nhan" },
      { name: "Sổ tay hành trình", href: "/hoat-dong/so-tay-hanh-trinh" },
    ]
  },
  { 
    name: "PROJECT", 
    href: "/project",
    subLinks: [
      { name: "'Welcome to Vietnam' Project", href: "/project/welcome-to-vietnam" },
      { name: "Supporting Project", href: "/project/supporting-project" },
      { name: "Stream Donations", href: "/project/stream-donations" },
    ]
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý đăng nhập bằng Google
  const handleLoginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback` 
        }
      });

      if (error) {
        console.error("Lỗi đăng nhập Google:", error.message);
        alert("Đăng nhập thất bại: " + error.message);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 flex w-full justify-center bg-white shadow-sm">
        {/* 
          HEADER FRAME
          - Chiều rộng thiết kế tối đa: 1440px
          - Chiều cao: 80px
          - Dùng relative để Logo / Menu / Button bám vào cùng một hệ tọa độ
        */}
        <header className="relative h-[80px] w-full max-w-[1440px]">

          {/* =====================================================
              LOGO
          ====================================================== */}
          <div
            className="
              absolute
              left-[5.56%]
              top-1/2
              z-20
              -translate-y-1/2
            "
          >
            <Link href="/" className="block">
              <Image
                src="/images/DEARKERIAVN LOGO 1.png"
                alt="DearKeriaVN Logo"
                width={140}
                height={60}
                priority
                className="h-auto w-[140px] object-contain"
              />
            </Link>
          </div>

          {/* =====================================================
              MENU
          ====================================================== */}
          <nav
            className="
              absolute
              left-1/2
              top-1/2
              z-10
              flex
              -translate-x-1/2
              -translate-y-1/2
              items-center
              gap-10
              whitespace-nowrap
              font-bold
              text-sm
              tracking-wide
              text-[#0070F3]
            "
          >
            {NAV_LINKS.map((link) => {
              // Header item sẽ active nếu ở đúng trang đó, hoặc đang ở trang con của nó
              const isActive = pathname === link.href || link.subLinks?.some(sub => pathname === sub.href);

              return (
                <div key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={`
                      relative
                      flex
                      items-center
                      justify-center
                      whitespace-nowrap
                      py-6
                      px-4
                      transition-colors
                      ${isActive ? "text-[#FF76C3]" : "hover:text-[#FF76C3]"}
                    `}
                  >
                    {/* ACTIVE MENU DECORATION TỪ FILE TÁCH RỜI */}
                    {isActive && <ActiveIndicator />}

                    <span className="relative z-10">
                      {link.name}
                    </span>
                  </Link>

                  {/* =================================================
                      DROPDOWN MENU
                  ================================================== */}
                  {link.subLinks && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 invisible mt-0 w-max min-w-[200px] opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-hover:translate-y-1">
                      <div className="flex flex-col bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 divide-y divide-[#90C9FF]/30">
                        {link.subLinks.map((subLink) => {
                          const isSubActive = pathname === subLink.href;
                          
                          return (
                            <div key={subLink.href} className="flex px-5 py-4 text-[14px] font-medium text-gray-600 transition-colors hover:bg-pink-50/20">
                              <Link
                                href={subLink.href}
                                className={`relative inline-flex items-center justify-center group/sub ${
                                  isSubActive ? "text-[#FF76C3]" : ""
                                }`}
                              >
                                {/* Vòng tròn svg cho item con đang được chọn */}
                                {isSubActive && <ActiveIndicator />}
                                
                                <span className={`relative z-10 px-2 py-0.5 transition-all ${
                                  !isSubActive && "group-hover/sub:text-[#FF76C3] group-hover/sub:underline decoration-[#FF76C3] decoration-2 underline-offset-4"
                                }`}>
                                  {subLink.name}
                                </span>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* =====================================================
              BUTTON ĐĂNG NHẬP
          ====================================================== */}
          <div
            className="
              absolute
              right-[5.56%]
              top-1/2
              z-20
              -translate-y-1/2
            "
          >
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="
                whitespace-nowrap
                rounded-md
                bg-[#FF76C3]
                px-6
                py-2
                text-sm
                font-bold
                text-white
                shadow-md
                transition-colors
                hover:bg-[#FF4D91]
              "
            >
              ĐĂNG NHẬP
            </button>
          </div>

        </header>
      </div>

      {/* =====================================================
          MODAL ĐĂNG NHẬP (POPUP)
      ====================================================== */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          {/* Overlay click to close */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsLoginModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-[500px] rounded-xl bg-white p-10 shadow-2xl">
            {/* Nút Close (X) */}
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-gray-800"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Nội dung Modal */}
            <div className="flex flex-col items-center">
              {/* Logo */}
              <div className="mb-8 mt-2">
                <Image
                  src="/images/DEARKERIAVN LOGO 1.png"
                  alt="DearKeriaVN Logo"
                  width={200}
                  height={100}
                  className="h-auto w-[220px] object-contain"
                />
              </div>

              {/* Title & Line */}
              <div className="mb-6 w-full max-w-[360px] text-center">
                <h2 className="mb-2 text-xl font-bold text-[#FF76C3]">Đăng Nhập</h2>
                {/* Đường gạch chân style giống ảnh */}
                <div className="mx-auto h-[2px] w-full rounded-full bg-[#FF76C3]/40"></div>
              </div>

              {/* Nút Đăng Nhập bằng Google */}
              <button
                type="button"
                onClick={handleLoginWithGoogle}
                disabled={isLoading}
                className="
                  flex
                  w-full
                  max-w-[360px]
                  items-center
                  justify-center
                  gap-3
                  rounded-md
                  bg-[#FF76C3]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition-colors
                  hover:bg-[#FF4D91]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {/* Icon Google G SVG */}
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </div>
                {isLoading ? "Đang kết nối..." : "Đăng Nhập Với Tài Khoản Google"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}