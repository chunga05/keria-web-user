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
      className={`group relative flex h-10 w-38 cursor-pointer items-center justify-center overflow-hidden rounded-md px-4 font-sans font-bold text-white shadow-md transition-all duration-300 active:scale-95 ${className}`}
      {...props}
    >
      {/* Nội dung trạng thái bình thường */}
      <span className="inline-flex items-center gap-2 transition-all duration-300 group-hover:-translate-x-3 group-hover:opacity-0">
        {icon}
        <span className="text-sm font-semibold tracking-wide">{text}</span>
      </span>

      {/* Nội dung khi Hover */}
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span className="text-sm font-semibold tracking-wide">{hoverText}</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>

      {/* Vòng tròn lan tỏa màu */}
      <div
        style={{ backgroundColor: expandColor }}
        className="absolute top-[40%] right-3 h-2 w-2 rounded-full transition-all duration-500 ease-out group-hover:scale-[35]"
      />
    </button>
  );
}