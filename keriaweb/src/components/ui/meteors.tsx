"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

export const Meteors = ({
  number = 25,
  minDelay = 0.2,
  maxDelay = 1.5,
  minDuration = 10,
  maxDuration = 20,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": -angle + "deg",
      top: "-10vh",
      // Mở rộng khoảng spawn từ -20vw đến 140vw (tràn ra lề phải) 
      // để sao băng có thời gian bay qua khoảng trống bên phải
      left: `${Math.floor(Math.random() * 160) - 20}vw`,
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration:
        Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
        "s",
    }))
    setMeteorStyles(styles)
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        <span
          key={idx}
          style={{ ...style }}
          className={cn(
            // Đã đổi rotate-(--angle) thành rotate-[var(--angle)] để chuẩn syntax Tailwind
            "animate-meteor pointer-events-none absolute size-2 rotate-[var(--angle)] rounded-full bg-blue-600 shadow-[0_0_10px_3px_#38d2f5]",
            className
          )}
        >
          {/* Đuôi sao băng nằm liền mạch phía sau đầu sao theo đúng góc xoay */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[3px] w-32 -translate-y-1/2 bg-linear-to-r from-blue-700 via-blue-500 to-transparent" />
        </span>
      ))}
    </>
  )
}