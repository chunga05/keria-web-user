"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";

export function useWishes(
  idolId: number = 1,
  pageSize: number = 9,
  visitorId: string | null = null,
  onAlert?: (message: string) => void
) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [userReactions, setUserReactions] = useState<
    Record<number, string[]>
  >({});

  // =========================================================
  // LOAD REACTION CỦA VISITOR TỪ DATABASE
  // =========================================================

  const loadUserReactions = useCallback(async () => {
    if (!visitorId) {
      setUserReactions({});
      return;
    }

    try {
      console.log(
        "🔄 Load reactions của visitor:",
        visitorId
      );

      const res = await fetch(
        `/api/wishes/reactions?visitorId=${encodeURIComponent(
          visitorId
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "❌ API reactions:",
          data
        );

        throw new Error(
          data?.error ||
            "Không thể tải reactions"
        );
      }

      console.log(
        "✅ Reactions từ database:",
        data.reactions
      );

      setUserReactions(
        data.reactions || {}
      );
    } catch (error) {
      console.error(
        "❌ Không thể load user reactions:",
        error
      );

      // Không xóa state cũ nếu API GET lỗi
      // để tránh giao diện mất trạng thái reaction
    }
  }, [visitorId]);

  // =========================================================
  // KHI CÓ VISITOR ID => LOAD REACTION
  // =========================================================

  useEffect(() => {
    if (!visitorId) {
      setUserReactions({});
      return;
    }

    loadUserReactions();
  }, [
    visitorId,
    loadUserReactions,
  ]);

  // =========================================================
  // FETCH WISHES
  // =========================================================

  const fetchWishes = useCallback(
    async (
      filter: string,
      page: number = 1
    ) => {
      setIsLoading(true);

      try {
        const queryParams =
          new URLSearchParams({
            idolId: String(idolId),
            page: String(page),
            pageSize: String(pageSize),
            filter,
          });

        const res = await fetch(
          `/api/wishes?${queryParams.toString()}`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error ||
              "Lỗi khi tải danh sách lời chúc"
          );
        }

        setMessages(
          data.messages || []
        );

        setTotalPages(
          data.totalPages || 1
        );
      } catch (error: any) {
        console.error(
          "❌ Lỗi fetch wishes:",
          error?.message || error
        );
      } finally {
        setIsLoading(false);
      }
    },
    [idolId, pageSize]
  );

  // =========================================================
  // SUBMIT WISH
  // =========================================================

  const submitWish = async (
    guestName: string,
    content: string,
    onSuccess: () => void
  ) => {
    setIsSubmitting(true);

    try {
      const res = await fetch(
        "/api/wishes/submit",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            guestName,
            content,
            idolId,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.error ||
            "Gửi lời chúc thất bại!"
        );
      }

      const showAlert = onAlert ?? alert;

      showAlert("Gửi lời chúc thành công!");

      onSuccess();
    } catch (error: any) {
      const showAlert = onAlert ?? alert;
      showAlert(
        "Lỗi: " +
          (error?.message ||
            "Không xác định")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // HANDLE REACTION
  // =========================================================

  const handleReact = useCallback(
    async (
      messageId: number,
      reactionType: string,
      currentCount: number
    ) => {
      if (!visitorId) {
        console.warn(
          "⚠️ Chưa có visitorId, chưa thể reaction"
        );

        return;
      }

      // =====================================================
      // LẤY TRẠNG THÁI HIỆN TẠI
      // =====================================================

      let wasReacted = false;

      setUserReactions(
        (previous) => {
          const current =
            previous[messageId] || [];

          wasReacted =
            current.includes(
              reactionType
            );

          const next = {
            ...previous,
          };

          if (wasReacted) {
            const filtered =
              current.filter(
                (type) =>
                  type !==
                  reactionType
              );

            if (
              filtered.length > 0
            ) {
              next[messageId] =
                filtered;
            } else {
              delete next[
                messageId
              ];
            }
          } else {
            next[messageId] = [
              ...current,
              reactionType,
            ];
          }

          return next;
        }
      );

      // =====================================================
      // OPTIMISTIC UPDATE COUNT
      // =====================================================

      setMessages(
        (previousMessages) =>
          previousMessages.map(
            (msg) => {
              if (
                msg.id !==
                messageId
              ) {
                return msg;
              }

              return {
                ...msg,

                reactions:
                  Array.isArray(
                    msg.reactions
                  )
                    ? msg.reactions.map(
                        (
                          reaction: any
                        ) => {
                          if (
                            reaction.type !==
                            reactionType
                          ) {
                            return reaction;
                          }

                          const oldCount =
                            Number(
                              reaction.count ??
                                currentCount ??
                                0
                            );

                          return {
                            ...reaction,
                            count:
                              Math.max(
                                0,
                                oldCount +
                                  (wasReacted
                                    ? -1
                                    : 1)
                              ),
                          };
                        }
                      )
                    : msg.reactions,
              };
            }
          )
      );

      // =====================================================
      // GỌI API
      // =====================================================

      try {
        const res =
          await fetch(
            "/api/wishes/react",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                wishId: messageId,
                visitorId,
                reactionType,
              }),
            }
          );

        const result =
          await res.json();

        console.log(
          "✅ Reaction API:",
          result
        );

        if (!res.ok) {
          throw new Error(
            result?.error ||
              "Reaction thất bại"
          );
        }

        // ===================================================
        // DATABASE LÀ SOURCE OF TRUTH
        // ===================================================

        setMessages(
          (previousMessages) =>
            previousMessages.map(
              (msg) => {
                if (
                  msg.id !==
                  messageId
                ) {
                  return msg;
                }

                return {
                  ...msg,

                  reactions:
                    Array.isArray(
                      msg.reactions
                    )
                      ? msg.reactions.map(
                          (
                            reaction: any
                          ) => {
                            if (
                              reaction.type !==
                              reactionType
                            ) {
                              return reaction;
                            }

                            return {
                              ...reaction,
                              count:
                                Number(
                                  result.reactionCount ??
                                    0
                                ),
                            };
                          }
                        )
                      : msg.reactions,
                };
              }
            )
        );

        // ===================================================
        // ĐỒNG BỘ USER REACTION
        // ===================================================

        setUserReactions(
          (previous) => {
            const next = {
              ...previous,
            };

            if (
              result.reacted
            ) {
              next[messageId] =
                Array.from(
                  new Set([
                    ...(next[
                      messageId
                    ] || []),
                    reactionType,
                  ])
                );
            } else {
              const filtered =
                (
                  next[
                    messageId
                  ] || []
                ).filter(
                  (type) =>
                    type !==
                    reactionType
                );

              if (
                filtered.length > 0
              ) {
                next[messageId] =
                  filtered;
              } else {
                delete next[
                  messageId
                ];
              }
            }

            return next;
          }
        );
      } catch (error) {
        console.error(
          "❌ Lỗi reaction:",
          error
        );

        // ===================================================
        // API LỖI
        // LOAD LẠI DATABASE ĐỂ KHÔI PHỤC CHÍNH XÁC
        // ===================================================

        await loadUserReactions();

        // Fetch lại wishes để lấy counter thật
        // nếu API reaction thất bại
        console.warn(
          "⚠️ Reaction thất bại, trạng thái UI sẽ được đồng bộ lại."
        );

        (onAlert ?? alert)(
          "Không thể lưu reaction. Vui lòng thử lại."
        );
      }
    },
    [
      visitorId,
      loadUserReactions,
    ]
  );

  // =========================================================
  // RETURN
  // =========================================================

  return {
    messages,
    isLoading,
    isSubmitting,
    totalPages,
    userReactions,
    fetchWishes,
    submitWish,
    handleReact,
  };
}