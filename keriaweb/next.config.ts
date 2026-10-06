
import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const allowedOriginsEnv = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((item) => item.trim())
  : [];

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.devtunnels.ms",
        ...allowedOriginsEnv,
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

      // YouTube thumbnails
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },

      // Avatar Google
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      // Cloudflare R2 Storage
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-aebf42319fd347588f5f6bfdbc176439.r2.dev",
      },
      ...(process.env.NEXT_PUBLIC_R2_PUBLIC_URL
        ? [
            {
              protocol: "https" as const,
              hostname: (() => {
                try {
                  return new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!).hostname;
                } catch {
                  return process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;
                }
              })(),
            },
          ]
        : []),

      // Supabase Storage
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      ...(supabaseUrl
        ? [
            {
              protocol: "https" as const,
              hostname: (() => {
                try {
                  return new URL(supabaseUrl!).hostname;
                } catch {
                  return supabaseUrl!;
                }
              })(),
            },
          ]
        : []),
    ],
  },
  async redirects() {
    return [
      {
        source: "/so-tay-hanh-trinh",
        destination: "/hoat-dong/so-tay-hanh-trinh",
        permanent: false,
      },
      {
        source: "/kerias/thanh-tich",
        destination: "/thanh-tich",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

