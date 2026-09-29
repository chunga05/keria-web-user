import Image from "next/image";

export default function KeriaDetails() {
  return (
    <section className="relative w-full h-auto bg-[#7CB9E8] flex flex-col items-center">
      <div className="relative w-full h-auto">
        
        {/* Ảnh chính */}
        <Image 
          src="/images/Frame 1495 (2).png" 
          alt="New Section Image" 
          width={1440} 
          height={1024} 
          quality={75}
          sizes="100vw" /* 2. Báo cho Next.js ảnh này chiếm 100% chiều rộng màn hình */
          style={{ width: '100%', height: 'auto' }} 
          className="relative z-10 w-full h-auto object-contain block"
        />
        
        <div className="absolute -bottom-[5%] left-0 w-full z-50 flex items-end pointer-events-none">
          <Image 
            src="/images/vachngan2.png" 
            alt="Vách ngăn giấy rách" 
            width={1440} 
            height={100} 
            className="w-full h-auto object-cover drop-shadow-md object-bottom"
          />
        </div>

      </div>
    </section>
  );
}