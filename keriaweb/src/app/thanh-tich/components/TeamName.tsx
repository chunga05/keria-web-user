"use client";

import React from "react";

// Bảng màu chỉ dùng hai tông: xanh dương và hồng.
export const BLUE = "#0084FF";
export const PINK = "#FF61B6";

export const TEAM_COLORS: Record<string, string> = {
  T1: PINK,
  DRX: BLUE,
  KeG: BLUE,
  GEN: PINK,
  KT: PINK,
  DK: BLUE,
  HLE: PINK,
  NS: BLUE,
  BRO: BLUE,
  KDF: PINK,
  LSB: BLUE,
  AF: PINK,
  SB: BLUE,
  ASIAD: BLUE,
  LCK: PINK,
  WORLDS: BLUE,
  ROX: PINK,
};

export const TEAM_NAMES = Object.keys(TEAM_COLORS)
  .sort((a, b) => b.length - a.length)
  .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

const TEAM_REGEX = new RegExp(`\\b(${TEAM_NAMES.join("|")})\\b`, "g");

/**
 * Tô màu tên đội tuyển / giải đấu xuất hiện trong một đoạn text.
 * Các tên không nằm trong danh sách sẽ giữ nguyên màu gốc.
 */
export default function TeamName({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  TEAM_REGEX.lastIndex = 0;
  while ((match = TEAM_REGEX.exec(text)) !== null) {
    const [full, team] = match;
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={key++} className="font-black" style={{ color: TEAM_COLORS[team] }}>
        {full}
      </span>
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

/** Trả về danh sách đoạn text đã tách theo tên đội (dùng khi cần render trong <li>). */
export function splitByTeam(text: string): { text: string; color?: string }[] {
  const out: { text: string; color?: string }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TEAM_REGEX.lastIndex = 0;
  while ((match = TEAM_REGEX.exec(text)) !== null) {
    const [full, team] = match;
    if (match.index > lastIndex) out.push({ text: text.slice(lastIndex, match.index) });
    out.push({ text: full, color: TEAM_COLORS[team] });
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) out.push({ text: text.slice(lastIndex) });
  return out;
}