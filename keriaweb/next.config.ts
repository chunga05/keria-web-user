
import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    // Cho phép các quality mà project đang sử dụng
    qualities: [70, 75, 100],

    remotePatterns: [
      // Ảnh avatar mẫu
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },

      // Avatar Google
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      // Supabase Storage
      ...(supabaseUrl
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(supabaseUrl).hostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;

