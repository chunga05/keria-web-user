// File: src/hooks/useUserProfile.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useUserProfile() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    address: "",
    equipped_frame: ""
  });

  // Danh sách các khung viền đầy đủ thông tin (id, image_url, name) để hiển thị cho user chọn
  const [availableFrames, setAvailableFrames] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/");
          return;
        }
        
        setEmail(user.email ?? "");

        // 1. Lấy thông tin user
        const { data: userRecord, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dbError || !userRecord) return;

        // 2. Truy vấn sang bảng chứa danh mục khung viền (Giả sử bảng của bạn tên là "frames")
        // Lấy toàn bộ thông tin các khung mà user này đang sở hữu trong mảng unlocked_frames
        let resolvedFrames: any[] = [];
        if (userRecord.unlocked_frames && userRecord.unlocked_frames.length > 0) {
          const { data: frameData } = await supabase
            .from("avatar_frames") // <-- Đảm bảo tên bảng danh mục khung viền của bạn khớp với chữ này (nếu khác hãy đổi lại)
            .select("id, name, image_url")
            .in("id", userRecord.unlocked_frames);

          if (frameData) {
            resolvedFrames = frameData;
          }
        }

        // Lưu profile đã được bọc thêm danh sách khung chi tiết
        setProfile({
          ...userRecord,
          unlocked_frames_details: resolvedFrames // Lưu danh sách object khung để hiển thị UI
        });

        // Đổ dữ liệu vào form edit
        setEditForm({
          display_name: userRecord.display_name || "",
          address: userRecord.address || "",
          equipped_frame: userRecord.equipped_frame || ""
        });

      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Hàm Lưu dữ liệu lên Supabase
const handleSaveProfile = async () => {
  if (!profile) {
    alert("Không tìm thấy profile!");
    return;
  }

  if (!editForm.display_name.trim()) {
    alert("Tên hiển thị không được để trống!");
    return;
  }

  try {
    setIsSaving(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    const updateData = {
      display_name: editForm.display_name.trim(),
      address: editForm.address.trim() || null,
      equipped_frame: editForm.equipped_frame || null,
    };

    console.log("User ID:", user.id);
    console.log("Update data:", updateData);

    const {
      data: updatedUser,
      error: updateError,
    } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select("*")
      .single();

    if (updateError) {
      console.error("UPDATE ERROR:", updateError);

      alert(
        "Lưu thất bại!\n\n" +
        updateError.message
      );

      return;
    }

    console.log("UPDATED USER:", updatedUser);

    setProfile({
      ...updatedUser,
      unlocked_frames_details:
        profile.unlocked_frames_details || [],
    });

    setEditForm({
      display_name: updatedUser.display_name || "",
      address: updatedUser.address || "",
      equipped_frame:
        updatedUser.equipped_frame
          ? String(updatedUser.equipped_frame)
          : "",
    });

    setIsEditing(false);

    alert("Lưu thông tin thành công!");

  } catch (error: any) {
    console.error("SAVE ERROR:", error);

    alert(
      "Có lỗi xảy ra:\n\n" +
      (error?.message || "Unknown error")
    );

  } finally {
    setIsSaving(false);
  }
};



  const cancelEditing = () => {
    setEditForm({
      display_name: profile.display_name || "",
      address: profile.address || "",
      equipped_frame: profile.equipped_frame || ""
    });
    setIsEditing(false);
  };

  const updateForm = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Hàm tiện ích tìm ra đường dẫn ảnh (`image_url`) dựa vào mã `id` của khung đang đeo
  const getFrameImageUrl = (frameId: string) => {
    if (!frameId || !profile?.unlocked_frames_details) return "";
    const found = profile.unlocked_frames_details.find((f: any) => f.id === frameId);
    return found ? found.image_url : "";
  };

  return {
    profile,
    email,
    loading,
    isSaving,
    isEditing,
    setIsEditing,
    editForm,
    updateForm,
    handleSaveProfile,
    cancelEditing,
    getFrameImageUrl,
    unlocked_frames_details: profile?.unlocked_frames_details || [] 
  };
}