import Image from "next/image";

export default function KeriaBoard() {
  // Tạo một mảng gồm 6 phần tử giả lập cho 6 card (3 hàng x 2 cột)
  const cards = [1, 2, 3, 4, 5, 6];

  return (
    <section className="relative w-full max-w-[1440px] h-auto bg-[#f3f4f6] flex flex-col items-center mx-auto [container-type:inline-size] pt-[clamp(40px,6cqw,80px)]">
      
      {/* 2. Đổi max-w-[1224px] thành w-[85%] (vì 1224/1440 = 85%). Dùng clamp cho margin và gap */}
      <div className="relative w-[85%] mb-[clamp(24px,4cqw,48px)] grid grid-cols-1 md:grid-cols-2 grid-rows-3 gap-[clamp(16px,1.6cqw,24px)] z-10">
        
        {cards.map((item) => (
          <div 
            key={item} 
            className="bg-white rounded-[clamp(12px,1.1cqw,16px)] px-[clamp(16px,2.2cqw,32px)] py-[clamp(12px,1.4cqw,20px)] shadow-sm flex flex-col justify-between"
          >
            {/* 3. Ảnh minh họa: Scale chiều cao ảnh mượt mà từ 160px đến 220px dựa vào cqw */}
            <div className="relative w-full h-[clamp(160px,15.2cqw,220px)] rounded-[clamp(8px,0.8cqw,12px)] overflow-hidden mb-[clamp(10px,1.1cqw,16px)]">
              <Image 
                src="/images/Frame 1495 (2).png" 
                alt="Post Image" 
                fill
                className="object-cover"
              />
            </div>

            {/* 4. Thông tin tác giả & ngày tháng: Scale Text và Avatar */}
            <div className="flex items-center justify-between mb-[clamp(8px,0.8cqw,12px)] text-[clamp(10px,0.8cqw,12px)] text-gray-500">
              <div className="flex items-center gap-[clamp(4px,0.5cqw,8px)]">
                <div className="w-[clamp(20px,1.6cqw,24px)] h-[clamp(20px,1.6cqw,24px)] rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                  <span className="text-[clamp(8px,0.7cqw,10px)] font-bold text-pink-500">D</span>
                </div>
                <span className="font-semibold text-gray-800">DearKeriaVN</span>
              </div>
              <span>10-01-2024</span>
            </div>

            {/* Đoạn văn bản mẫu */}
            <p className="text-gray-600 text-[clamp(12px,1cqw,14px)] leading-relaxed mb-[clamp(10px,1.1cqw,16px)] line-clamp-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            {/* Thanh tương tác dưới cùng */}
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

      {/* 5. Vách ngăn: Chuyển -bottom-16 thành -bottom-[6.25%] để vết rách đồng bộ tuyệt đối với các component trên */}
      <div className="absolute -bottom-[4.9%] left-0 w-full z-60 flex items-end translate-y-[1px] pointer-events-none">
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