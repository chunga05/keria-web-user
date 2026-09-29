
"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentJwtUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  // Trang cần quay lại sau khi đăng nhập
  const next = searchParams.get("next") || "/";

  // ============================================================
  // KIỂM TRA NẾU ĐÃ ĐĂNG NHẬP
  // ============================================================
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const currentUser = await getCurrentJwtUser();

      if (!mounted) return;

      if (currentUser) {
        router.replace(next);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router, next]);

  // ============================================================
  // ĐĂNG NHẬP GOOGLE
  // ============================================================
  const handleLoginWithGoogle = async () => {
    try {
      setIsLoading(true);

      const redirectUrl =
        `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo: redirectUrl,

          // ======================================================
          // QUAN TRỌNG:
          // prompt=select_account
          //
          // Google sẽ LUÔN hiện màn hình lựa chọn tài khoản.
          // ======================================================
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        console.error("Lỗi đăng nhập Google:", error);
        alert("Đăng nhập thất bại: " + error.message);
        setIsLoading(false);
      }

      // Không set false ở đây nếu OAuth thành công,
      // vì trình duyệt sẽ chuyển sang Google.
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Có lỗi xảy ra khi đăng nhập.");
      setIsLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[500px] rounded-xl bg-white p-10 shadow-xl border border-gray-100">

        {/* ====================================================== */}
        {/* LOGO */}
        {/* ====================================================== */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/DEARKERIAVN LOGO 1.png"
            alt="DearKeriaVN Logo"
            width={220}
            height={100}
            priority
            className="h-auto w-[220px] object-contain"
          />
        </div>

        {/* ====================================================== */}
        {/* TITLE */}
        {/* ====================================================== */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-[#FF76C3]">
            Đăng Nhập
          </h1>

          <div className="mx-auto h-[2px] w-full max-w-[360px] rounded-full bg-[#FF76C3]/40" />

          <p className="mt-4 text-sm text-gray-500">
            Đăng nhập để sử dụng sổ tay hành trình và các tính năng thành viên.
          </p>
        </div>

        {/* ====================================================== */}
        {/* GOOGLE LOGIN */}
        {/* ====================================================== */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLoginWithGoogle}
            disabled={isLoading}
            className="flex w-full max-w-[360px] items-center justify-center gap-3 rounded-md bg-[#FF76C3] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#FF4D91] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {/* GOOGLE ICON */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-4 w-4"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"
                />

                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />

                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />

                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            </div>

            {isLoading
              ? "Đang kết nối Google..."
              : "Đăng Nhập Với Tài Khoản Google"}
          </button>
        </div>

        {/* ====================================================== */}
        {/* QUAY LẠI */}
        {/* ====================================================== */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 transition-colors hover:text-[#FF76C3]"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

