import { redirect } from "next/navigation";
import { isFeatureEnabled, FEATURES } from "@/config/features";
import LockerHero from "@/app/TrangChu/LockerHero";
import KeriaDetails from "@/app/TrangChu/KeriaDetails";
import KeriaBoard from "@/app/TrangChu/KeriaBoard";
import VideoYoutube from "@/app/TrangChu/videoYoutube";
import { Metadata, Viewport } from "next";
import FacebookFeed from "@/app/TrangChu/facebookfeed";

export default function Home() {
  // Nếu cờ trang chủ bị tắt (false), tự động điều hướng tới trang lời chúc
  if (!isFeatureEnabled(FEATURES.HOME)) {
    redirect("/hoat-dong/loi-nhan");
  }

  return (
    <main className="w-full bg-transparent flex flex-col items-center">
      
      {/* Phần 1: Tủ đồ và khung giấy chính */}
      <LockerHero />

      {/* Phần 2: Section hình ảnh */}
      <KeriaDetails />
      <KeriaBoard />
      
      {/* Phần 3: Khung Video Highlight */}
      <VideoYoutube 
        videoId="nb1PiORQ_-8" 
        title="T1 Keria Highlight" 
        className="shadow-2xl"
      />

      {/* Phần 4: Facebook Feed */}
      <FacebookFeed />
      
      </main>
  );
}