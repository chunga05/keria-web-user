
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ActiveIndicator from "@/components/ui/ActiveIndicator";
import { getCurrentJwtUser, getJwtAccessToken } from "@/lib/auth";
import { tokenStore } from "@/lib/tokenStore";
import { supabase } from "@/lib/supabase";

// ============================================================
// URL của app Admin
// .env.local:
// NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
// ============================================================
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

const NAV_LINKS = [
  {
    name: "TRANG CHỦ",
    href: "/",
  },

  {
    name: "KERIA'S",
    // Không dùng href để tránh 404
    subLinks: [
      {
        name: "Thành tích",
        href: "/thanh-tich",
      },
      {
        name: "Lịch trình",
        href: "/kerias/lich-trinh",
      },
    ],
  },

  {
    name: "HOẠT ĐỘNG",
    // Không dùng href để tránh 404
    subLinks: [
      {
        name: "Lời nhắn",
        href: "/hoat-dong/loi-nhan",
      },
      {
        name: "Sổ tay hành trình",
        href: "/hoat-dong/so-tay-hanh-trinh",
      },
    ],
  },
    {
    name: "PROJECT",
    // Chuyển sang dạng subLinks theo thiết kế trong image_af07c6.png
    subLinks: [
      {
        name: "‘Welcome to Vietnam’ Project",
        href: "/project/welcome-to-vietnam",
      },
      {
        name: "Supporting Project",
        href: "/content",
      },
      {
        name: "Stream Donations",
        href: "/stream-donation",
      },
    ],
  },
];

type UserRecord = {
  status: "pending" | "approved" | string;
  role: "admin" | "user" | string;
  avatar_url: string | null;
  display_name: string | null;
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // ============================================================
  // USER
  // ============================================================
  const [userData, setUserData] = useState<UserRecord | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // ============================================================
  // USER DROPDOWN
  // ============================================================
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // ADMIN
  // ============================================================
  const [isGoingToAdmin, setIsGoingToAdmin] = useState(false);

  // ============================================================
  // KIỂM TRA ĐĂNG NHẬP
  // ============================================================
  const checkAuthStatus = useCallback(async () => {
    try {
      const currentUser = await getCurrentJwtUser();

      // Chưa đăng nhập
      if (!currentUser) {
        setUserData(null);
        return;
      }

      setUserData(currentUser as any);
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng nhập:", error);
      setUserData(null);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  // ============================================================
  // THEO DÕI AUTH
  // ============================================================
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // ============================================================
  // ĐÓNG MOBILE MENU KHI CHUYỂN TRANG
  // ============================================================
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // ============================================================
  // ĐÓNG MOBILE MENU KHI RESIZE SANG DESKTOP (>= 1280px)
  // ============================================================
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // ============================================================
  // KHOÁ CUỘN TRANG KHI MỞ MOBILE MENU & ĐÓNG BẰNG ESCAPE
  // ============================================================
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // ============================================================
  // ĐĂNG XUẤT
  // ============================================================
  const handleLogout = async () => {
    setIsUserMenuOpen(false);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Lỗi đăng xuất server:", error);
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Lỗi Supabase signOut:", error);
    }

    tokenStore.clear();

    if (typeof document !== 'undefined') {
      document.cookie = 'dkvn_at=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'dkvn_admin_at=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    setUserData(null);
    router.refresh();
    window.location.href = '/';
  };

  // ============================================================
  // CHUYỂN SANG ADMIN
  // ============================================================
  const handleGoToAdmin = async () => {
    if (isGoingToAdmin) return;

    setIsUserMenuOpen(false);
    setIsGoingToAdmin(true);

    try {
      if (!ADMIN_URL) {
        console.error("NEXT_PUBLIC_ADMIN_URL chưa được cấu hình.");
        alert("Chưa cấu hình địa chỉ Admin.");
        setIsGoingToAdmin(false);
        return;
      }

      const accessToken = await getJwtAccessToken();

      if (!accessToken) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        setIsGoingToAdmin(false);
        return;
      }

      const params = new URLSearchParams({
        access_token: accessToken,
      });

      window.location.href = `${ADMIN_URL}/auth/receive#${params.toString()}`;
    } catch (error) {
      console.error("Lỗi khi chuyển sang trang admin:", error);
      setIsGoingToAdmin(false);
    }
  };

  // ============================================================
  // ADMIN
  // ============================================================
  const isAdmin =
    userData?.role === "admin" &&
    userData?.status === "approved";

  // ============================================================
  // LOGIN
  // ============================================================
  const loginUrl =
    pathname && pathname !== "/login"
      ? `/login?next=${encodeURIComponent(pathname)}`
      : "/login";

  // ============================================================
  // KIỂM TRA ACTIVE DROPDOWN
  // ============================================================
  const isLinkActive = (link: (typeof NAV_LINKS)[number]) => {
    if (!("subLinks" in link) || !link.subLinks) {
      return pathname === link.href;
    }

    return link.subLinks.some(
      (subLink) => pathname === subLink.href
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* Spacer để đẩy nội dung xuống, tránh bị header đè lên */}
      <div className="h-[clamp(68px,5.56vw,80px)] w-full shrink-0" />
      
      {/* Header cố định (Fixed) với backdrop-blur để tối ưu hiệu suất và thẩm mỹ */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex w-full justify-center bg-white/95 backdrop-blur-md shadow-sm">
        <header
        className="
          relative
          h-[clamp(68px,5.56vw,80px)]
          w-full
          max-w-[1440px]
        "
      >

        {/* ================================================== */}
        {/* LOGO */}
        {/* ================================================== */}

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
              className="
                h-auto
                w-[clamp(100px,9.72vw,140px)]
                object-contain
              "
            />
          </Link>
        </div>

        {/* ================================================== */}
        {/* MENU */}
        {/* ================================================== */}

        <nav
          className="
            absolute
            left-1/2
            top-1/2
            z-10
            hidden
            xl:flex
            -translate-x-1/2
            -translate-y-1/2
            items-center
            gap-[clamp(18px,2.78vw,40px)]
            whitespace-nowrap
            font-bold
            text-[clamp(11px,0.97vw,14px)]
            tracking-wide
            text-[#0070F3]
          "
        >

          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link);

            // ==================================================
            // CÓ DROPDOWN
            // Không dùng Link ở menu cha
            // ==================================================

            if ("subLinks" in link && link.subLinks) {
              return (
                <div
                  key={link.name}
                  className="group relative"
                >

                  {/* MENU CHA - CHỈ MỞ DROPDOWN */}

                  <div
                    className={`
                      relative
                      flex
                      cursor-default
                      items-center
                      justify-center
                      whitespace-nowrap
                      px-[clamp(10px,1.11vw,16px)]
                      py-[clamp(18px,1.67vw,24px)]
                      transition-colors
                      ${
                        isActive
                          ? "text-[#FF76C3]"
                          : "hover:text-[#FF76C3]"
                      }
                    `}
                  >
                    <span className="relative inline-flex items-center justify-center">
                      {isActive && <ActiveIndicator />}

                      <span className="relative z-10 px-[clamp(6px,0.56vw,8px)] py-0.5">
                        {link.name}
                      </span>
                    </span>
                  </div>

                  {/* ================================================== */}
                  {/* DROPDOWN */}
                  {/* ================================================== */}

                  <div
                    className="
                      invisible
                      absolute
                      left-1/2
                      top-full
                      mt-0
                      w-max
                      min-w-[clamp(180px,13.89vw,200px)]
                      -translate-x-1/2
                      translate-y-0
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:visible
                      group-hover:translate-y-1
                      group-hover:opacity-100
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        divide-y
                        divide-[#90C9FF]/30
                        border
                        border-gray-100
                        bg-white
                        shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                      "
                    >

                      {link.subLinks.map((subLink) => {
                        const isSubActive =
                          pathname === subLink.href;

                        return (
                          <div
                            key={subLink.href}
                            className="
                              flex
                              px-[clamp(14px,1.39vw,20px)]
                              py-[clamp(11px,1.11vw,16px)]
                              text-[clamp(12px,0.97vw,14px)]
                              font-medium
                              text-gray-600
                              transition-colors
                              hover:bg-pink-50/20
                            "
                          >
                            <Link
                              href={subLink.href}
                              className={`
                                relative
                                inline-flex
                                items-center
                                justify-center
                                group/sub
                                ${
                                  isSubActive
                                    ? "text-[#FF76C3]"
                                    : ""
                                }
                              `}
                            >
                              {isSubActive && (
                                <ActiveIndicator />
                              )}

                              <span
                                className={`
                                  relative
                                  z-10
                                  px-[clamp(6px,0.56vw,8px)]
                                  py-0.5
                                  transition-all
                                  ${
                                    !isSubActive
                                      ? "group-hover/sub:text-[#FF76C3] group-hover/sub:underline decoration-[#FF76C3] decoration-2 underline-offset-4"
                                      : ""
                                  }
                                `}
                              >
                                {subLink.name}
                              </span>
                            </Link>
                          </div>
                        );
                      })}

                    </div>
                  </div>
                </div>
              );
            }

            // ==================================================
            // MENU KHÔNG CÓ DROPDOWN
            // Ví dụ: TRANG CHỦ
            // ==================================================

            return (
              <div
                key={link.href}
                className="relative"
              >
                <Link
                  href={link.href}
                  className={`
                    relative
                    flex
                    items-center
                    justify-center
                    whitespace-nowrap
                    px-[clamp(10px,1.11vw,16px)]
                    py-[clamp(18px,1.67vw,24px)]
                    transition-colors
                    ${
                      isActive
                        ? "text-[#FF76C3]"
                        : "hover:text-[#FF76C3]"
                    }
                  `}
                >
                  <span className="relative inline-flex items-center justify-center">
                    {isActive && <ActiveIndicator />}

                    <span className="relative z-10 px-[clamp(6px,0.56vw,8px)] py-0.5">
                      {link.name}
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}

        </nav>

        {/* ================================================== */}
        {/* HAMBURGER BUTTON (chỉ hiện trên mobile) */}
        {/* ================================================== */}

        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="
            absolute
            right-[5.56%]
            top-1/2
            z-30
            -translate-y-1/2
            flex
            xl:hidden
            h-10 w-10
            items-center
            justify-center
            rounded-md
            text-[#0070F3]
            transition-colors
            hover:bg-blue-50
            focus:outline-none
          "
        >
          {isMobileMenuOpen ? (
            /* ✕ close icon */
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* ☰ hamburger icon */
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

        {/* ================================================== */}
        {/* LOGO (căn giữa trên mobile, căn trái trên desktop) */}
        {/* ================================================== */}

        {/* ================================================== */}
        {/* USER / LOGIN */}
        {/* ================================================== */}

        <div
          className="
            absolute
            right-[5.56%]
            top-1/2
            z-20
            hidden
            xl:flex
            -translate-y-1/2
            items-center
            gap-[clamp(8px,1.11vw,16px)]
          "
        >

          {/* ĐANG KIỂM TRA */}

          {isAuthChecking ? (
            <div
              className="
                h-[clamp(34px,2.78vw,40px)]
                w-[clamp(80px,6.67vw,96px)]
                animate-pulse
                rounded-md
                bg-gray-200
              "
            />
          ) : userData ? (

            /* ================================================= */
            /* ĐÃ ĐĂNG NHẬP */
            /* ================================================= */

            <div className="relative">

              {/* AVATAR */}

              <div
                className="
                  h-[clamp(34px,2.78vw,40px)]
                  w-[clamp(34px,2.78vw,40px)]
                  cursor-pointer
                  overflow-hidden
                  rounded-full
                  border-[clamp(1.5px,0.14vw,2px)]
                  border-[#FF76C3]
                  shadow-sm
                  transition-transform
                  hover:scale-105
                "
                onClick={() =>
                  setIsUserMenuOpen((prev) => !prev)
                }
                title={
                  userData.display_name || "Tài khoản"
                }
              >
                <img
                  src={
                    userData.avatar_url ||
                    "/default-avatar.png"
                  }
                  alt="User Avatar"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* USER DROPDOWN */}

              {isUserMenuOpen && (
                <>
                  {/* BACKDROP */}

                  <div
                    className="fixed inset-0 z-40"
                    onClick={() =>
                      setIsUserMenuOpen(false)
                    }
                  />

                  {/* DROPDOWN */}

                  <div
                    className="
                      absolute
                      right-0
                      top-[120%]
                      z-50
                      w-[clamp(210px,15.56vw,224px)]
                      animate-in
                      rounded-lg
                      border
                      border-gray-100
                      bg-white
                      py-[clamp(5px,0.56vw,8px)]
                      shadow-lg
                      fade-in
                      slide-in-from-top-2
                      duration-200
                    "
                  >

                    {/* USER NAME */}

                    <div
                      className="
                        border-b
                        border-gray-100
                        px-[clamp(12px,1.11vw,16px)]
                        py-[clamp(10px,0.83vw,12px)]
                      "
                    >
                      <p
                        className="
                          truncate
                          text-[clamp(12px,0.97vw,14px)]
                          font-semibold
                          text-gray-800
                        "
                      >
                        {userData.display_name ||
                          "Người dùng"}
                      </p>

                      {/* ROLE */}

                      <p
                        className="
                          mt-1
                          text-[clamp(10px,0.83vw,12px)]
                          text-gray-400
                        "
                      >
                        {isAdmin
                          ? "Quản trị viên"
                          : userData.status ===
                              "pending"
                            ? "Đang chờ duyệt"
                            : "Thành viên"}
                      </p>
                    </div>

                    <div className="py-1">

                      {/* ADMIN */}

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={handleGoToAdmin}
                          disabled={isGoingToAdmin}
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            px-[clamp(12px,1.11vw,16px)]
                            py-[clamp(8px,0.87vw,10px)]
                            text-left
                            text-[clamp(11px,0.97vw,14px)]
                            font-bold
                            text-[#0070F3]
                            transition-colors
                            hover:bg-blue-50
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        >
                          <span>
                            Quản trị Admin
                          </span>

                          {isGoingToAdmin && (
                            <span
                              className="
                                text-[clamp(9px,0.76vw,11px)]
                                font-normal
                                text-gray-400
                              "
                            >
                              Đang chuyển...
                            </span>
                          )}
                        </button>
                      )}

                      {/* PENDING */}

                      {userData.status === "pending" && (
                        <div
                          className="
                            mx-[clamp(12px,1.11vw,16px)]
                            my-2
                            rounded-md
                            bg-amber-50
                            px-[clamp(10px,0.83vw,12px)]
                            py-[clamp(7px,0.69vw,10px)]
                            text-[clamp(9px,0.76vw,11px)]
                            text-amber-600
                          "
                        >
                          Tài khoản đang chờ Admin duyệt.
                        </div>
                      )}

                      {/* PROFILE */}

                      <Link
                        href="/userProfile"
                        className="
                          block
                          px-[clamp(12px,1.11vw,16px)]
                          py-[clamp(8px,0.87vw,10px)]
                          text-[clamp(11px,0.97vw,14px)]
                          font-medium
                          text-gray-700
                          transition-colors
                          hover:bg-pink-50
                          hover:text-[#FF76C3]
                        "
                        onClick={() =>
                          setIsUserMenuOpen(false)
                        }
                      >
                        Thông tin cá nhân
                      </Link>

                      {/* LOGOUT */}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          flex
                          w-full
                          items-center
                          px-[clamp(12px,1.11vw,16px)]
                          py-[clamp(8px,0.87vw,10px)]
                          text-left
                          text-[clamp(11px,0.97vw,14px)]
                          font-medium
                          text-red-600
                          transition-colors
                          hover:bg-red-50
                        "
                      >
                        Đăng xuất
                      </button>

                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (

            /* ================================================= */
            /* CHƯA ĐĂNG NHẬP */
            /* ================================================= */

            <Link
              href={loginUrl}
              className="
                whitespace-nowrap
                rounded-md
                bg-[#FF76C3]
                px-[clamp(14px,1.67vw,24px)]
                py-[clamp(7px,0.56vw,8px)]
                text-[clamp(10px,0.97vw,14px)]
                font-bold
                text-white
                shadow-md
                transition-colors
                hover:bg-[#FF4D91]
              "
            >
              ĐĂNG NHẬP
            </Link>
          )}

        </div>
      </header>
    </div>

      {/* ================================================== */}
      {/* MOBILE SIDEBAR (SLIDE IN FROM RIGHT)               */}
      {/* ================================================== */}

      {/* Backdrop */}
      <div
        className={`
          fixed
          inset-0
          z-[140]
          bg-black/40
          backdrop-blur-[2px]
          transition-opacity
          duration-300
          ease-in-out
          xl:hidden
          ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Sidebar Panel from right */}
      <aside
        ref={mobileMenuRef}
        aria-label="Menu điều hướng"
        className={`
          fixed
          top-0
          right-0
          bottom-0
          z-[150]
          flex
          h-screen
          h-[100dvh]
          w-[310px]
          sm:w-[340px]
          max-w-[85vw]
          flex-col
          bg-white
          shadow-[-8px_0_30px_rgba(0,0,0,0.15)]
          transition-transform
          duration-300
          ease-in-out
          xl:hidden
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* Header inside sidebar: Logo & Close Button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block"
          >
            <Image
              src="/images/DEARKERIAVN LOGO 1.png"
              alt="DearKeriaVN Logo"
              width={120}
              height={50}
              priority
              className="h-auto w-[110px] object-contain"
            />
          </Link>

          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-400
              transition-colors
              hover:bg-gray-100
              hover:text-gray-700
              focus:outline-none
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-7 py-4">
          {/* TRANG CHỦ */}
          <div className="my-2.5">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                relative
                inline-flex
                items-center
                text-base
                font-extrabold
                uppercase
                tracking-wider
                transition-colors
                ${
                  pathname === "/"
                    ? "text-[#FF76C3]"
                    : "text-[#0070F3] hover:text-[#FF76C3]"
                }
              `}
            >
              <span className="relative inline-flex items-center">
                {pathname === "/" && <ActiveIndicator />}
                <span className="relative z-10 py-0.5">TRANG CHỦ</span>
              </span>
            </Link>
          </div>

          {/* Divider after TRANG CHỦ */}
          <div className="my-4 h-[1.5px] w-full bg-[#BAE6FD]" />

          {/* NAV SECTIONS */}
          <div className="space-y-4">
            {NAV_LINKS.filter((l) => "subLinks" in l && l.subLinks).map(
              (section, idx, arr) => (
                <div key={section.name} className="space-y-2.5">
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-[#0070F3]">
                    {section.name}
                  </h3>

                  <div className="flex flex-col space-y-2.5">
                    {section.subLinks?.map((subLink) => {
                      const isSubActive = pathname === subLink.href;

                      return (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            text-[15px]
                            font-semibold
                            transition-colors
                            ${
                              isSubActive
                                ? "text-[#FF76C3] font-bold"
                                : "text-gray-700 hover:text-[#FF76C3]"
                            }
                          `}
                        >
                          {subLink.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Divider between sections (not after the last one) */}
                  {idx < arr.length - 1 && (
                    <div className="pt-2">
                      <div className="h-[1.5px] w-full bg-[#BAE6FD]" />
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* USER / AUTH SECTION */}
          <div className="mt-8 mb-6">
            {!isAuthChecking && !userData && (
              <div className="flex justify-end">
                <Link
                  href={loginUrl}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-[4px]
                    bg-[#FF76C3]
                    px-6
                    py-2.5
                    text-sm
                    font-bold
                    tracking-wide
                    text-white
                    shadow-sm
                    transition-colors
                    hover:bg-[#FF4D91]
                  "
                >
                  ĐĂNG NHẬP
                </Link>
              </div>
            )}

            {!isAuthChecking && userData && (
              <div className="flex flex-col gap-3 rounded-lg border border-pink-100 bg-pink-50/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#FF76C3]">
                    {userData.avatar_url ? (
                      <img
                        src={userData.avatar_url}
                        alt="User Avatar"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-pink-100 font-bold text-pink-500">
                        {userData.display_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 line-clamp-1">
                      {userData.display_name || "Người dùng"}
                    </span>
                    <span className="text-xs text-gray-500 line-clamp-1">
                      {isAdmin ? "Quản trị viên" : "Thành viên"}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleGoToAdmin();
                    }}
                    className="flex w-full items-center justify-center rounded-md bg-blue-50 py-2 text-xs font-bold text-[#0070F3] hover:bg-blue-100 transition-colors"
                  >
                    Quản trị Admin
                  </button>
                )}

                <Link
                  href="/userProfile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-md border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Thông tin cá nhân
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center justify-center rounded-md bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

