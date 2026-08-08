import Image from "next/image";

export default function KeriaBoard() {
  const cards = [1, 2, 3, 4, 5, 6];

  return (
    <section className="relative w-full h-auto bg-[#f3f4f6] flex flex-col items-center mx-auto [container-type:inline-size] pt-[clamp(40px,6cqw,80px)]">
      
      {/* 1. GIẢM MARGIN BOTTOM TRÊN MOBILE: 
          Đổi từ 120px xuống 60px để khoảng trống trên điện thoại vừa phải hơn */}
      <div className="relative w-[70%] mb-[clamp(60px,10vw,180px)] grid grid-cols-1 md:grid-cols-2 grid-rows-3 gap-[clamp(16px,1.6cqw,24px)] z-10">
        
        {cards.map((item) => (
          <div 
            key={item} 
            className="bg-white rounded-[clamp(12px,1.1cqw,16px)] px-[clamp(16px,2.2cqw,32px)] py-[clamp(12px,1.4cqw,20px)] shadow-sm flex flex-col justify-between min-h-[clamp(350px,35cqw,450px)]"
          >
            <div className="relative w-full h-[clamp(200px,25cqw,320px)] rounded-[clamp(8px,0.8cqw,12px)] overflow-hidden mb-[clamp(10px,1.1cqw,16px)]">
              <Image 
                src="/images/Frame 1495 (2).png" 
                alt="Post Image" 
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-[clamp(8px,0.8cqw,12px)] text-[clamp(10px,0.8cqw,12px)] text-gray-500">
              <div className="flex items-center gap-[clamp(4px,0.5cqw,8px)]">
                <div className="w-[clamp(20px,1.6cqw,24px)] h-[clamp(20px,1.6cqw,24px)] rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                  <span className="text-[clamp(8px,0.7cqw,10px)] font-bold text-pink-500">D</span>
                </div>
                <span className="font-semibold text-gray-800">DearKeriaVN</span>
              </div>
              <span>10-01-2024</span>
            </div>

            <p className="text-gray-600 text-[clamp(12px,1cqw,14px)] leading-relaxed mb-[clamp(10px,1.1cqw,16px)] line-clamp-3 flex-grow">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
            </p>

            <div className="flex items-center justify-between pt-[clamp(8px,0.8cqw,12px)] border-t border-gray-100 text-gray-500 text-[clamp(12px,1cqw,14px)]">
              <div className="flex items-center gap-[clamp(12px,1.1cqw,16px)]">
                <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                  <span>🤍</span> <span>1000</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <span>💬</span> <span>100</span>
                </button>
              </div>
              <button className="hover:text-black transition-colors">
                <span>↗</span>
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* 2. SỬA LẠI VỊ TRÍ VÁCH NGĂN:
          Dùng bottom-0 để neo sát đáy section, sau đó dùng translate-y-[80%] 
          để đẩy nó tụt xuống dưới một đoạn bằng 80% CHIỀU CAO CỦA VÁCH NGĂN. 
          Cách này đảm bảo khoảng cách luôn chuẩn xác trên cả Desktop lẫn Mobile! */}
      <div className="absolute bottom-0 left-0 w-full z-60 flex items-end translate-y-[80%] pointer-events-none">
        <Image 
          src="/images/vachngan3.png" 
          alt="Vách ngăn giấy rách" 
          width={1440} 
          height={100} 
          className="w-full h-auto object-cover drop-shadow-md object-bottom"
        />
      </div>

    </section>
  );
}