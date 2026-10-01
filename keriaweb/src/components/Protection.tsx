"use client";

import { useEffect } from "react";

export default function Protection() {
  useEffect(() => {
    // 1. Chặn chuột phải (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Chặn các phím tắt DevTools, Copy, View Source, Save
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect/Console/Element)
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c"].includes(e.key)
      ) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && ["U", "u"].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (Save)
      if (e.ctrlKey && ["S", "s"].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      // Ctrl+P (Print)
      if (e.ctrlKey && ["P", "p"].includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Chặn kéo thả hình ảnh (Drag & Drop)
    const handleDragStart = (e: DragEvent) => {
      if (
        e.target instanceof HTMLImageElement ||
        (e.target as HTMLElement).tagName.toLowerCase() === "img" ||
        (e.target as HTMLElement).tagName.toLowerCase() === "a"
      ) {
        e.preventDefault();
      }
    };

    // Thêm các event listener
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // 4. Bẫy DevTools (Debugger Trap) - Ngăn người dùng dùng DevTools nếu cố tình mở được
    // Chỉ kích hoạt ở môi trường production để không gây cản trở khi code
    let devToolsTrap: NodeJS.Timeout;
    if (process.env.NODE_ENV === "production") {
      devToolsTrap = setInterval(() => {
        // eslint-disable-next-line no-debugger
        Function("debugger")();
      }, 100);
    }

    // Dọn dẹp khi unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      if (devToolsTrap) clearInterval(devToolsTrap);
    };
  }, []);

  return null;
}
