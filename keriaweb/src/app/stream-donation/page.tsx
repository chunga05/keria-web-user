"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// ============================================================
// SVG ICONS
// ============================================================
const SparkleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#0084FF"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const HandDrawnArrow = () => (
  <svg
    width="80"
    height="100"
    viewBox="0 0 80 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -right-8 top-12 drop-shadow-sm md:-right-16 md:top-20"
  >
    <path
      d="M70 10 C 65 40, 45 75, 10 85"
      stroke="#102652"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M10 85 L 25 75 M 10 85 L 30 90"
      stroke="#102652"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// ============================================================
// DATA CHO SỐ BÓNG
// ============================================================
const DONATION_DIGITS = [
  { digit: "2", bg: "bg-[#FF61B6]" },
  { digit: "1", bg: "bg-[#0084FF]" },
  { digit: "7", bg: "bg-[#102652]" },
  { digit: "9", bg: "bg-[#FF61B6]" },
  { digit: "3", bg: "bg-[#102652]" },
  { digit: "1", bg: "bg-[#0084FF]" },
];

// ============================================================
// COMPONENT 1: HIỆU ỨNG TỪNG Ô SỐ
// ============================================================
const AnimatedDigit = ({
  targetDigit,
  bgClass,
  stopDelay,
}: {
  targetDigit: string;
  bgClass: string;
  stopDelay: number;
}) => {
  const [displayDigit, setDisplayDigit] = useState("0");

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayDigit(Math.floor(Math.random() * 10).toString());
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayDigit(targetDigit);
    }, stopDelay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [targetDigit, stopDelay]);

  return (
    <div
      className={`
        flex 
        h-16 
        w-14 
        items-center 
        justify-center 
        text-4xl 
        font-bold 
        text-white 
        ${bgClass}
      `}
    >
      {displayDigit}
    </div>
  );
};

// ============================================================
// COMPONENT 2: HIỆU ỨNG CẢ CHUỖI SỐ (CHO VNĐ)
// ============================================================
const AnimatedAmount = ({
  targetString,
  stopDelay,
}: {
  targetString: string;
  stopDelay: number;
}) => {
  // Thay thế toàn bộ số bằng "0" lúc khởi tạo để không bị giật layout
  const [displayText, setDisplayText] = useState(
    targetString.replace(/[0-9]/g, "0")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Thay thế các ký tự số thành số ngẫu nhiên, giữ nguyên dấu "."
      const randomString = targetString.replace(/[0-9]/g, () =>
        Math.floor(Math.random() * 10).toString()
      );
      setDisplayText(randomString);
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayText(targetString);
    }, stopDelay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [targetString, stopDelay]);

  return <>{displayText}</>;
};

export default function StreamDonations() {
  return (
    <div className="flex w-full flex-col items-center bg-[#F5F5F5] py-16 font-sans">
      
      {/* ================================================== */}
      {/* TIÊU ĐỀ NỔI BẰNG ẢNH */}
      {/* ================================================== */}
      <div className="relative z-20 -mb-8 flex w-full justify-center px-4 md:-mb-10">
        <Image
          src="/images/stream-donate/stream_donate.png" 
          alt="Stream Donations"
          width={500}
          height={100}
          className="h-auto w-full max-w-[450px] object-contain drop-shadow-sm"
          priority
        />
      </div>

      {/* ================================================== */}
      {/* MAIN CARD */}
      {/* ================================================== */}
      <div
        className="
          relative
          z-10
          flex 
          w-full 
          max-w-[900px] 
          flex-col 
          items-center 
          rounded-xl 
          bg-white 
          px-8 
          pb-16 
          pt-20 
          shadow-[0_8px_30px_rgb(0,0,0,0.04)]
          md:px-16
        "
      >
        {/* === SECTION 1: GIỚI THIỆU VỀ QUỸ === */}
        <div className="mb-6 flex items-center gap-3">
          <SparkleIcon />
          <h2 className="text-xl font-bold text-[#0084FF]">
            GIỚI THIỆU VỀ QUỸ
          </h2>
          <SparkleIcon />
        </div>

        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2">
          {/* Cột trái: Văn bản */}
          <div className="text-[15px] leading-relaxed text-gray-800">
            <span className="float-left mr-2 mt-1 text-6xl font-black leading-none text-[#0084FF]">
              Q
            </span>
            uỹ hoạt động với mục tiêu duy trì quỹ bóng bền vững cho hoạt động stream
            hằng tháng của tuyển thủ Keria. Toàn bộ số tiền sử dụng đều được theo dõi
            minh bạch, công khai dưới sự giám sát và ủng hộ của cộng đồng{" "}
            <span className="font-bold text-[#FF61B6]">
              fan Keria tại Việt Nam
            </span>
            . Đây không chỉ là tình cảm của người hâm mộ Việt Nam dành cho em mà còn
            là những lời nhắn gửi chân thành nhất trên con đường đồng hành theo từng
            cột mốc đáng nhớ của tuyển thủ Keria.
          </div>

          {/* Cột phải: QR Code */}
          <div className="relative flex flex-col items-center">
            <div
              className="
                z-10 
                -mb-2 
                bg-[#0084FF] 
                px-6 
                py-2 
                text-lg 
                font-bold 
                text-white 
                shadow-sm
              "
            >
              MÃ QR QUỸ STREAM
            </div>
            <div className="relative h-48 w-48 rounded-sm bg-[#D9D9D9]">
              {/* Ảnh QR thực tế thay vào thẻ img/Image này */}
              {/* <Image src="/qr-code.png" alt="QR Code" fill className="object-cover" /> */}
              <HandDrawnArrow />
            </div>
          </div>
        </div>

        {/* === SECTION 2: SỐ BÓNG ĐÃ DONATE === */}
        <div className="mt-16 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3">
            <SparkleIcon />
            <h2 className="text-xl font-bold uppercase text-gray-900">
              Số bóng đã donate cho Keria:
            </h2>
          </div>

          {/* Các khối số có hiệu ứng */}
          <div className="flex gap-2">
            {DONATION_DIGITS.map((item, index) => (
              <AnimatedDigit
                key={index}
                targetDigit={item.digit}
                bgClass={item.bg}
                stopDelay={1000 + index * 250} 
              />
            ))}
          </div>
          
          <p className="mt-4 text-[15px] font-medium text-gray-700">
            (Tổng 2 acc: DKVN: 210,331 - DKVN01: 7,600)
          </p>
        </div>

        {/* === SECTION 3: QUY ĐỔI RA TIỀN VIỆT === */}
        <div className="mt-12 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3">
            <SparkleIcon />
            <h2 className="text-xl font-bold uppercase text-gray-900">
              Quy đổi ra tiền Việt Nam:
            </h2>
          </div>

          <div
            className="
              bg-[#FF61B6] 
              px-10 
              py-4 
              text-3xl 
              font-bold 
              text-white 
              shadow-sm
            "
          >
            ~ <AnimatedAmount targetString="432.000.000" stopDelay={2500} /> VNĐ
          </div>
        </div>
      </div>
    </div>
  );
}