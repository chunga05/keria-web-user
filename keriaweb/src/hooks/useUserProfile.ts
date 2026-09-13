// File: src/hooks/useUserProfile.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useUserProfile() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null); // cache để dùng lại
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    address: "",
    equipped_frame: ""
  });

  const [availableFrames, setAvailableFrames] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/");
          return;
        }
        
        if (cancelled) return;
        setEmail(user.email ?? "");
        setUserId(user.id); // cache userId

        const { data: userRecord, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dbError || !userRecord || cancelled) return;

        let resolvedFrames: any[] = [];
        if (userRecord.unlocked_frames && userRecord.unlocked_frames.length > 0) {
          const { data: frameData } = await supabase
            .from("avatar_frames")
            .select("id, name, image_url")
            .in("id", userRecord.unlocked_frames);

          if (frameData && !cancelled) {
            resolvedFrames = frameData;
          }
        }

        if (!cancelled) {
          setProfile({
            ...userRecord,
            unlocked_frames_details: resolvedFrames
          });
          setEditForm({
            display_name: userRecord.display_name || "",
            address: userRecord.address || "",
            equipped_frame: userRecord.equipped_frame || ""
          });
        }

      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUserProfile();
    return () => { cancelled = true; };
  }, [router]);

  const handleSaveProfile = async () => {
  if (!profile || !userId) {
    alert("Không tìm thấy profile!");
    return;
  }

  if (!editForm.display_name.trim()) {
    alert("Tên hiển thị không được để trống!");
    return;
  }

  try {
    setIsSaving(true);

    const updateData = {
      display_name: editForm.display_name.trim(),
      address: editForm.address.trim() || null,
      equipped_frame: editForm.equipped_frame || null,
    };

    const {
      data: updatedUser,
      error: updateError,
    } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId) // dùng cached userId
      .select("*")
      .single();

    if (updateError) {
      alert("Lưu thất bại!\n\n" + updateError.message);
      return;
    }

    setProfile({
      ...updatedUser,
      unlocked_frames_details:
        profile.unlocked_frames_details || [],
    });

    setEditForm({
      display_name: updatedUser.display_name || "",
      address: updatedUser.address || "",
      equipped_frame: updatedUser.equipped_frame
        ? String(updatedUser.equipped_frame)
        : "",
    });

    setIsEditing(false);
    alert("Lưu thông tin thành công!");

  } catch (error: any) {
    alert("Có lỗi xảy ra:\n\n" + (error?.message || "Unknown error"));
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