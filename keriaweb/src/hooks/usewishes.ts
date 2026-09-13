"use client";

import { useState, useCallback, useEffect } from "react";

export function useWishes(idolId: number = 1, pageSize: number = 9) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [userReactions, setUserReactions] = useState<Record<number, string[]>>({});

  useEffect(() => {
    const storedReactions = localStorage.getItem("keria_fan_wishes_reactions");
    if (storedReactions) {
      try {
        setUserReactions(JSON.parse(storedReactions));
      } catch (error) {}
    }
  }, []);

  const fetchWishes = useCallback(
    async (filter: string, page: number = 1) => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          idolId: String(idolId),
          page: String(page),
          pageSize: String(pageSize),
          filter,
        });

        const res = await fetch(`/api/wishes?${queryParams.toString()}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Lỗi khi tải danh sách lời chúc");
        }

        const data = await res.json();
        setMessages(data.messages || []);
        setTotalPages(data.totalPages || 1);
      } catch (error: any) {
        console.error("Lỗi fetch wishes:", error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [idolId, pageSize]
  );

  const submitWish = async (
    guestName: string,
    content: string,
    onSuccess: () => void
  ) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/wishes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName, content, idolId }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Gửi lời chúc thất bại!");
      }

      alert("Gửi lời chúc thành công!");
      onSuccess();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    messages,
    isLoading,
    isSubmitting,
    totalPages,
    userReactions,
    fetchWishes,
    submitWish,
  };
}