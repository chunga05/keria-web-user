"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ActiveIndicator from "@/components/ui/ActiveIndicator";

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

  return (
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
  );
}