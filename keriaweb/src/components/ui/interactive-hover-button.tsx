'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  hoverText?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  expandColor?: string;
}

export function InteractiveHoverButton({
  text,
  hoverText = 'Xem ngay',
  icon,
  bgColor = '#0091FF',
  expandColor = '#0077D4',
  className = '',
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      style={{ backgroundColor: bgColor }}
      className={`group relative flex h-7 sm:h-8 md:h-9 lg:h-10 w-24 sm:w-28 md:w-32 lg:w-36 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 sm:px-3 md:px-4 font-sans font-bold text-white shadow-md transition-all duration-300 active:scale-95 ${className}`}
      {...props}
    >
      {/* Nội dung trạng thái bình thường */}
      <span className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-300 group-hover:-translate-x-3 group-hover:opacity-0 text-[11px] sm:text-xs md:text-sm">
        {icon}
        <span className="font-semibold tracking-wide whitespace-nowrap">{text}</span>
      </span>

      {/* Nội dung khi Hover */}
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-1 md:gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 text-[11px] sm:text-xs md:text-sm">
        <span className="font-semibold tracking-wide whitespace-nowrap">{hoverText}</span>
        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>

      {/* Vòng tròn lan tỏa màu - ẩn khi chưa hover để không che chữ */}
      <div
        style={{ backgroundColor: expandColor }}
        className="pointer-events-none absolute top-1/2 right-3 h-2 w-2 -translate-y-1/2 rounded-full opacity-0 scale-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-[35]"
      />
    </button>
  );
}