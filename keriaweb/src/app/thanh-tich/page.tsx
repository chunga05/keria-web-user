import Image from "next/image";
import { isFeatureEnabled, FEATURES } from "@/config/features";
import UnderConstruction from "@/components/UnderConstruction";
import type { Metadata } from "next";
import AchievementsInfo from "./components/AchievementsInfo";
import TimelineAchievements from "./components/TimelineAchievements";

export const metadata: Metadata = {
  title: "Thành tích Keria | DearKeriaVN",
  description: "Bảng thành tích và các danh hiệu của Ryu 'Keria' Minseok",
};

export default function KeriaAchievements() {
  const isEnabled = isFeatureEnabled(FEATURES.ACHIEVEMENTS);

  if (!isEnabled) {
    return (
      <UnderConstruction
        variant="page"
        featureName="Thành tích"
        estimatedRelease="Dự kiến cập nhật trong thời gian tới"
        showBackButton={true}
        backButtonHref="/hoat-dong/loi-nhan"
      />
    );
  }

  return (
    <main className="w-full flex flex-col min-h-screen">
      <section className="relative w-full overflow-visible leading-none flex flex-col items-center justify-center pt-16 sm:pt-20 pb-20 md:pb-24">
        {/* 1. LỚP NỀN: Nhuộm xanh pastel trực tiếp lên vân giấy */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/images/thanh-tich/8dd48a408a4b915c0d659a40795fed5deb219377.jpg"
            alt="Paper Texture Background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Màu xanh sáng đúng với ảnh mẫu */}
          <div className="absolute inset-0 bg-[#c3e3fa] mix-blend-multiply opacity-80" />
        </div>

        {/* 2. KHỐI NỘI DUNG CHÍNH (NOTE GIẤY) */}
        <div className="relative z-10 w-[92%] max-w-[1240px] aspect-[840/480] sm:aspect-[840/460] flex items-center justify-center my-4">
          {/* Note giấy: xoay 180 độ để kẹp ghim lên góc trên bên trái */}
          <Image
            src="/images/thanh-tich/papernote.png"
            alt="Paper Note"
            fill
            priority
            className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] select-none pointer-events-none rotate-180"
          />

          {/* Tab tiêu đề "THÀNH TÍCH" */}
          <div className="absolute -top-[10%] sm:top-[5%] left-1/2 -translate-x-1/2 w-[45%] max-w-[450px] z-20">
            <Image
              src="/images/thanh-tich/ThanhTich.png"
              alt="Thành Tích"
              width={320}
              height={90}
              className="w-full h-auto drop-shadow-md select-none"
            />
          </div>

          {/* Vương miện xanh */}
          <div className="absolute top-[3.5%] right-[5%] sm:right-[7.5%] w-[7.5%] max-w-[120px] z-20">
            <Image
              src="/images/thanh-tich/crown (2).png"
              alt="Crown Doodle"
              width={60}
              height={60}
              className="w-full h-auto select-none"
            />
          </div>

          {/* Ngôi sao xanh đen */}
          <div className="absolute -bottom-[4%] sm: bottom-[7%] left-[6%] sm:left-[7%] w-[6%] max-w-[95px] z-20">
            <Image
              src="/images/thanh-tich/star (5).png"
              alt="Star Doodle"
              width={50}
              height={50}
              className="w-full h-auto select-none"
            />
          </div>

          {/* Nội dung chữ */}
          <div className="relative z-20 w-[84%] flex flex-col items-center text-center px-2 sm:px-4 pt-1 sm:pt-4 md:pt-10">
            <p className="text-[#1e293b] font-semibold text-[10px] min-[400px]:text-xs sm:text-lg md:text-xl lg:text-[22px] leading-snug sm:leading-relaxed md:leading-[1.7] max-w-[920px] select-text">
              &ldquo;Tưởng chừng chỉ là một thiên tài vụt sáng trong khoảnh khắc, nhưng thực chất là hành trình nỗ lực được vun đắp từ biết bao đêm dài. Một thiên tài nói không với khuất phục, đây là bình minh rực rỡ cậu ấy tự khắc lên.&rdquo;
            </p>

            {/* Dải chữ hồng */}
            <div className="mt-2 sm:mt-4 md:mt-5 w-[96%] max-w-[580px]">
              <Image
                src="/images/thanh-tich/note.png"
                alt="Con đường danh vọng Keria Minseok"
                width={700}
                height={90}
                className="w-full h-auto drop-shadow-sm select-none"
              />
            </div>

            {/* Nét gạch chân xanh */}
            <div className="mt-0.5 sm:mt-1.5 w-[38%] max-w-[260px]">
              <Image
                src="/images/thanh-tich/foot.png"
                alt="Underline Doodle"
                width={350}
                height={30}
                className="w-full h-auto select-none"
              />
            </div>
          </div>
        </div>

        {/* 3. VÁCH NGĂN GIẤY RÁCH ĐÁY: ĐÈ TRỰC TIẾP LÊN MẶT TIẾP XÚC FOOTER */}
        {/* Sử dụng translate-y-1/2 để mép xé rách nằm đúng đường cắt chuyển giao giữa 2 section */}
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none translate-y-1/2">
          <Image
            src="/images/thanh-tich/Vector 1.png" // Đảm bảo đúng file Vector 1.png
            alt="Vách ngăn giấy rách"
            width={1920}
            height={80}
            sizes="100vw"
            className="w-full h-auto block select-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.06)]"
          />
        </div>
      </section>
      <AchievementsInfo />
      <TimelineAchievements />
    </main>
  );
}