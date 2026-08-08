import { useState, useCallback, useEffect } from "react";
import { supabase } from "../lib/supabase"; 

const BAD_WORDS = ["badword1", "badword2", "fuck", "shit", "ngu", "dm", "vcl"];
const containsBadWords = (text: string) => BAD_WORDS.some(w => text.toLowerCase().includes(w));

export function useWishes(idolId: number = 1, pageSize: number = 9) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  
  // STATE LƯU TRỮ LỊCH SỬ BẤM REACTION CỦA USER
  const [userReactions, setUserReactions] = useState<Record<number, string[]>>({});

  // Lấy lịch sử đã thả cảm xúc từ trình duyệt khi trang vừa load
  useEffect(() => {
    const storedReactions = localStorage.getItem("keria_fan_wishes_reactions");
    if (storedReactions) {
      try {
        setUserReactions(JSON.parse(storedReactions));
      } catch (error) {}
    }
  }, []);

  const fetchWishes = useCallback(async (filter: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const isAscending = filter === "Cũ nhất";
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("fan_wishes")
        .select("*", { count: "exact" })
        .eq("idol_id", idolId)
        .eq("is_hidden", false)
        .is("deleted_at", null)
        .order("created_at", { ascending: isAscending })
        .range(from, to);

      if (error) throw error;
      if (count !== null) setTotalPages(Math.ceil(count / pageSize));

      if (data) {
        const formattedMessages = data.map((item: any, index: number) => {
          const dateObj = new Date(item.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
          const isBlue = index % 2 === 0;
          const decoStars = ["none", "blue", "pink", "none"];
          
          return {
            id: item.id,
            author: item.guest_name || "Ẩn danh",
            date: formattedDate,
            content: item.content,
            bgColor: isBlue ? "blue" : "pink",
            decorationStar: decoStars[index % 4],
            hasGoldStar: index % 5 === 0,
            reactions: [
              { type: 'cry', emoji: "😭", count: item.react_cry || 0 },
              { type: 'wow', emoji: "😮", count: item.react_wow || 0 },
              { type: 'star', emoji: "🤩", count: item.react_star || 0 },
              { type: 'heart', emoji: "🥰", count: item.react_heart || 0 },
            ]
          };
        });
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, [idolId, pageSize]);

  const submitWish = async (guestName: string, content: string, onSuccess: () => void) => {
    if (!guestName.trim() || !content.trim()) return alert("Vui lòng nhập đủ thông tin!");
    if (containsBadWords(guestName) || containsBadWords(content)) return alert("Ngôn từ không phù hợp!");

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("fan_wishes").insert([{
          idol_id: idolId,
          guest_name: guestName.trim(),
          content: content.trim(),
          is_hidden: false
      }]);
      if (error) throw error;
      alert("Gửi lời chúc thành công!");
      onSuccess();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // CẬP NHẬT HÀM REACT ĐỂ CHẶN BẤM NHIỀU LẦN
  const handleReact = async (wishId: number, reactionType: string, currentCount: number) => {
    // 1. Kiểm tra xem user đã bấm cảm xúc này chưa
    const reactedTypes = userReactions[wishId] || [];
    const hasReacted = reactedTypes.includes(reactionType);

    // 2. Tính toán: Nếu đã bấm rồi thì -1 (Hủy), nếu chưa thì +1 (Thêm)
    const newCount = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;
    
    // Cập nhật mảng lịch sử ở LocalStorage
    const newReactedTypes = hasReacted 
      ? reactedTypes.filter(t => t !== reactionType) // Xóa khỏi danh sách đã bấm
      : [...reactedTypes, reactionType];             // Thêm vào danh sách đã bấm
    
    const newUserReactions = { ...userReactions, [wishId]: newReactedTypes };
    setUserReactions(newUserReactions);
    localStorage.setItem("keria_fan_wishes_reactions", JSON.stringify(newUserReactions));

    // 3. Cập nhật UI ngay lập tức cho mượt
    setMessages(prevMessages => prevMessages.map(msg => {
      if (msg.id === wishId) {
        return {
          ...msg,
          reactions: msg.reactions.map((r: any) => 
            r.type === reactionType ? { ...r, count: newCount } : r
          )
        };
      }
      return msg;
    }));

    // 4. Bắn API lưu lên Supabase
    const columnName = `react_${reactionType}`;
    const { error } = await supabase
      .from("fan_wishes")
      .update({ [columnName]: newCount })
      .eq("id", wishId);

    if (error) console.error("Lỗi update reaction:", error);
  };

  // NHỚ EXPORT THÊM userReactions ĐỂ GIAO DIỆN SỬ DỤNG
  return { messages, isLoading, isSubmitting, totalPages, userReactions, fetchWishes, submitWish, handleReact };
}