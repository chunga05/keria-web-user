// File: app/user-profile/page.tsx
"use client";

import { useUserProfile } from "@/hooks/useUserProfile";

export default function UserProfilePage() {
  const {
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
    getFrameImageUrl
  } = useUserProfile();

  // 1. GIAO DIỆN ĐANG TẢI
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF76C3]"></div>
      </div>
    );
  }

  if (!profile) return null;

  // Lấy đường dẫn ảnh khung viền hiện tại để hiển thị ngoài trang chủ (chế độ xem)
  const currentEquippedFrameUrl = getFrameImageUrl(profile.equipped_frame);
  // Lấy đường dẫn ảnh khung viền khi đang chọn trong lúc edit
  const editingEquippedFrameUrl = getFrameImageUrl(editForm.equipped_frame);

  // 2. GIAO DIỆN CHÍNH
  return (
    <div className="min-h-[80vh] bg-pink-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        
        {/* Tiêu đề & Nút thao tác */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#FF76C3]">Hồ Sơ Của Tôi</h1>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#FF76C3] shadow-sm border border-[#FF76C3] hover:bg-pink-50 transition"
            >
              Chỉnh sửa hồ sơ
            </button>
          ) : (
            <button 
              onClick={cancelEditing}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition"
            >
              Hủy
            </button>
          )}
        </div>

        {/* Khung Hồ Sơ */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-pink-100">
          <div className="h-32 bg-gradient-to-r from-pink-300 to-[#FF76C3]"></div>
          
          <div className="relative px-8 pb-10">
            
            {/* VÙNG AVATAR & KHUNG VIỀN */}
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="relative h-32 w-32">
                <img
                  src={profile.avatar_url || "/default-avatar.png"}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="h-full w-full rounded-full border-4 border-white bg-white object-cover shadow-md relative z-10"
                />
                
               {(isEditing ? editingEquippedFrameUrl : currentEquippedFrameUrl) && (
                    <img
                        src={isEditing ? editingEquippedFrameUrl : currentEquippedFrameUrl}
                        alt="Khung viền"
                        className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        z-20
                        -translate-x-1/2
                        -translate-y-1/2
                        object-contain
                        select-none
                        "
                        style={{
                        width: "125%",
                        height: "125%",
                        maxWidth: "none",
                        }}
                    />
                    )}
              </div>
            </div>

            {/* VÙNG THÔNG TIN CÁ NHÂN */}
            <div className="space-y-6">
              
              {/* Vùng chọn Khung viền (Chỉ hiện khi Edit) */}
              {isEditing && (
                <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
                  <label className="mb-3 block text-sm font-bold text-gray-700">Chọn Khung Viền</label>
                  
                  {(!profile.unlocked_frames_details || profile.unlocked_frames_details.length === 0) ? (
                    <p className="text-sm text-gray-500 italic">Bạn chưa sở hữu khung viền nào.</p>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {/* Nút Gỡ bỏ khung */}
                      <button
                        onClick={() => updateForm("equipped_frame", "")}
                        className={`h-16 w-16 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
                          editForm.equipped_frame === "" ? "border-[#FF76C3] bg-pink-100 text-[#FF76C3]" : "border-gray-200 bg-white text-gray-400 hover:border-pink-300"
                        }`}
                      >
                        Gỡ bỏ
                      </button>

                      {/* Danh sách khung đã mở khóa */}
                      {profile.unlocked_frames_details.map((frame: any) => (
                        <button
                          key={frame.id}
                          onClick={() => updateForm("equipped_frame", frame.id)}
                          className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                            editForm.equipped_frame === frame.id ? "border-[#FF76C3] shadow-md scale-105" : "border-gray-200 hover:border-pink-300"
                          }`}
                          title={frame.name}
                        >
                          <img src={frame.image_url} alt={frame.name} className="h-full w-full object-contain p-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Lưới Thông tin */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                
                {/* Tên hiển thị */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tên hiển thị</label>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editForm.display_name}
                      onChange={(e) => updateForm("display_name", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-[#FF76C3] focus:ring-1 focus:ring-[#FF76C3]"
                    />
                  ) : (
                    <p className="font-bold text-gray-800 text-lg">{profile.display_name}</p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
                  <p className="font-medium text-gray-600 break-all">{email}</p>
                </div>

                {/* Username (Read-only) */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Username</label>
                  <p className="font-medium text-gray-600">@{profile.username}</p>
                </div>

                {/* Địa chỉ */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Địa chỉ</label>
                  {isEditing ? (
                    <textarea 
                      rows={2}
                      value={editForm.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      placeholder="Nhập địa chỉ..."
                      className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-[#FF76C3] focus:ring-1 focus:ring-[#FF76C3]"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {profile.address || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Nút Lưu Thay Đổi */}
              {isEditing && (
                <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="rounded-md bg-[#FF76C3] px-8 py-3 font-bold text-white shadow-md hover:bg-[#FF4D91] transition disabled:opacity-50"
                  >
                    {isSaving ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
                  </button>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}