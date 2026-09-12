import Image from "next/image";

export default function LockerHero() {
  return (
    <div className="relative w-full aspect-[1440/1024] bg-[#7CB9E8] flex-shrink-0 flex flex-col items-center overflow-hidden [container-type:inline-size]">
      
      {/* Lớp nền tủ đồ */}
      <div className="absolute inset-0 z-0 bg-[#7CB9E8]">
        <Image
          src="/images/locker.png"
          alt="Locker"
          fill
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <section className="relative w-[88.89%] mx-auto z-10 my-auto flex justify-center translate-x-[3.125%] pb-[6.25%]"> 
        <div className="relative w-full mx-auto flex flex-col items-center -translate-y-[6.25%]"> 
          
          {/* Tờ giấy chính */}
          <div className="relative z-1 pointer-events-none w-full">
            <Image
              src="/images/huaban-6338701794 1.svg"
              alt="Tờ giấy"
              width={1280}
              height={1000}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* Các icon trang trí */}
          <div className="absolute top-[15%] left-[3%] w-[15.6%] z-10 rotate-12">
            <Image src="/images/ghim.png" alt="Pin" width={200} height={200} className="w-full h-auto" />
          </div>
          <div className="absolute top-[13%] left-[2%] w-[13.6%] z-0">
            <Image src="/images/bigpink.png" alt="Pin" width={174} height={174} className="w-full h-auto" />
          </div>
          <div className="absolute top-[5%] -right-[4%] w-[20%] z-10">
            <Image src="/images/Star.png" alt="Star" width={255} height={289} className="w-full h-auto" />
          </div>
          <div className="absolute -bottom-[2%] -left-[9.4%] w-[13.6%] z-20">
            <Image src="/images/Star (1).png" alt="Star" width={182} height={182} className="w-full h-auto" />
          </div>
          <div className="absolute bottom-[2.9%] -left-[5%] w-[21.8%] z-10">
            <Image src="/images/Star (2).png" alt="Star" width={240} height={240} className="w-full h-auto" />
          </div>
          <div className="absolute bottom-[20%] left-[11.5%] w-[7.8%] z-10">
            <Image src="/images/Heart 2.png" alt="Heart" width={100} height={83} className="w-full h-auto" />
          </div>
          <div className="absolute top-[23%] right-[16%] w-[11.7%] z-30">
            <Image src="/images/Star (3).png" alt="Star" width={150} height={150} className="w-full h-auto" />
          </div>
          <div className="absolute bottom-[32%] right-[5%] w-[15.6%] z-10">
            <Image src="/images/hongnhat.png" alt="Star" width={200} height={200} className="w-full h-auto" />
          </div>
          <div className="absolute bottom-[26%] right-[35%] w-[2.7%] z-10">
            <Image src="/images/drawpink.png" alt="Star" width={35} height={35} className="w-full h-auto" />
          </div>
          <div className="absolute bottom-[22%] right-[22%] w-[11.7%] z-10">
            <Image src="/images/arrow.png" alt="Arrow" width={150} height={130} className="w-full h-auto" />
          </div>
          <div className="absolute top-[33%] left-[11%] w-[7.8%] z-10">
            <Image src="/images/ngoackep1.png" alt="Quote" width={100} height={120} className="w-full h-auto" />
          </div>
          <div className="absolute top-[42%] right-[17%] w-[7.8%] z-10">
            <Image src="/images/ngoackep2.png" alt="Quote" width={100} height={120} className="w-full h-auto" />
          </div>
          <div className="absolute top-[51%] left-[12%] w-[9.3%] z-10">
            <Image src="/images/Soft Star.png" alt="Star" width={120} height={120} className="w-full h-auto" />
          </div>

          {/* Vùng nội dung chữ và logo */}
          <div className="absolute inset-0 w-full h-full z-20 flex flex-col items-center pt-[8%]">
            <div className="top-[15%] w-[18.3%] flex justify-center items-center mb-[2%] -translate-x-[17%]">
              <Image src="/images/DEARKERIAVN LOGO 1.svg" alt="Logo" width={300} height={150} className="drop-shadow-lg w-full h-auto" />
            </div>

            <div className="w-[75%] text-center font-montserrat mx-auto flex flex-col items-center">
              <Image 
                src="/images/Group 5.png" 
                alt="Title" 
                width={790} 
                height={201} 
                className="w-[82%] mx-auto mb-[2.5%] -translate-x-[6%]" 
                style={{ height: 'auto' }}
              />

              <div className="w-[85%] mx-auto -rotate-3 -translate-x-[3.125%]"> 
                {/* ĐÃ SỬA: Dùng 1.6cqw cố định để chữ scale tỷ lệ thuận chính xác 100% theo kích thước giấy */}
                <p className="text-[#0F0F4F] font-medium text-center tracking-wide leading-[1.6] text-[1.6cqw]">
                  DearKeriaVN tồn tại với mục tiêu ủng hộ Support xuất sắc nhất lịch sử Liên Minh Huyền Thoại - 
                  <strong className="text-black font-bold"> Ryu &apos;Keria&apos; Minseok</strong>, cùng đồng hành và lưu giữ lại những dấu ấn rực rỡ theo từng cột mốc sự nghiệp, dõi theo mỗi bước chân nỗ lực trên hành trình vĩ đại của 
                  <em className="font-semibold italic"> Quái vật Thiên tài.</em>
                </p>
              </div>
              
              {/* ĐÃ SỬA: Các icon cũng dùng cqw để scale mượt mà y như chữ */}
              <div className="flex items-center justify-center gap-[2cqw] mt-[3%] pointer-events-auto -rotate-3 -translate-x-[2.5%]">
                <a 
                  href="https://www.facebook.com/dearkeriavn" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-[3.3cqw] h-[3.3cqw] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 overflow-hidden"
                >
                  <Image 
                    src="/images/facelogo.png" 
                    alt="Facebook" 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-cover" 
                  />
                </a>
                <a href="https://www.threads.com/@dearkeriavn" target="_blank" rel="noopener noreferrer" className="w-[3.3cqw] h-[3.3cqw] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 overflow-hidden bg-black">
                  <Image src="/images/threadicon.png" alt="Threads" width={48} height={48} className="w-full h-full object-cover" />
                </a>
                <a href="https://www.instagram.com/dearkeriavn" target="_blank" rel="noopener noreferrer" className="w-[3.3cqw] h-[3.3cqw] rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform duration-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%]">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://x.com/dearkeriavn" target="_blank" rel="noopener noreferrer" className="w-[3.3cqw] h-[3.3cqw] rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 overflow-hidden">
                  <Image src="/images/Union.png" alt="X" width={48} height={48} className="w-1/2 h-1/2 object-contain" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vách ngăn */}
      <div className="absolute -bottom-[6.25%] left-0 w-full z-50 flex items-end translate-y-[1px]">
        <Image 
          src="/images/vachngan.png" 
          alt="Vách ngăn giấy rách" 
          width={1440} 
          height={100} 
          className="w-full h-auto object-cover drop-shadow-md object-bottom pointer-events-none"
        />
      </div>
      <div className="absolute inset-0 z-[40] pointer-events-none">
        <div className="w-full h-full bg-[url('/images/backgroundEff.png')] opacity-8 mix-blend-overlay"></div>
      </div>
    </div>
  );
}