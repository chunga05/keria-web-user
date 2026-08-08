"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Tạo danh sách các ngôi sao ngẫu nhiên
const generateStars = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Vị trí ngang (%)
    size: Math.random() * 3 + 2, // Kích thước (2px - 5px)
    duration: Math.random() * 3 + 2, // Tốc độ rơi (2s - 5s)
    delay: Math.random() * 5, // Thời gian chờ trước khi rơi
  }));
};

export default function FallingStars() {
  const [stars, setStars] = useState<ReturnType<typeof generateStars>>([]);

  useEffect(() => {
    setStars(generateStars(40)); // Số lượng ngôi sao
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-[#0070F3] shadow-[0_0_8px_#3B82F6]"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: "-10px",
          }}
          animate={{
            y: ["0vh", "105vh"], // Rơi từ trên đỉnh xuống dưới đáy màn hình
            opacity: [0, 1, 1, 0], // Hiệu ứng mờ dần khi xuất hiện và biến mất
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}