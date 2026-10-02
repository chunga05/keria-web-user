
import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.devtunnels.ms",
        "xc5kf3vh-3000.asse.devtunnels.ms"
      ],
    },
  },
  images: {
    // Cho phép các quality mà project đang sử dụng
    qualities: [70, 75, 100],

    // Cache ảnh đã optimize trong 24 giờ (mặc định chỉ 60 giây)
    minimumCacheTTL: 86400,

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

      // R2 Storage
      ...(process.env.NEXT_PUBLIC_R2_PUBLIC_URL
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname,
            },
          ]
        : []),

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

