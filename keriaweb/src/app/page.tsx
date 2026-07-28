import LockerHero from "@/components/LockerHero";
import KeriaDetails from "@/components/KeriaDetails";
import KeriaBoard from "@/components/KeriaBoard";
import VideoYoutube from "@/components/videoYoutube";
import { Metadata, Viewport } from "next";
import FacebookFeed from "@/components/facebookfeed";

export default function Home() {
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