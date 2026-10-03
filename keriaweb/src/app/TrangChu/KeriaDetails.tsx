import Image from "next/image";

export default function KeriaDetails() {
  return (
    <section className="relative w-full h-auto bg-[#7CB9E8] flex flex-col items-center">
      <div className="relative w-full h-auto">
        
        {/* Ảnh chính (Desktop) */}
        <Image 
          src="/images/Frame 1495 (2).png" 
          alt="Keria Details Desktop" 
          width={1440} 
          height={1024} 
          quality={75}
          sizes="(min-width: 768px) 100vw, 0vw" 
          priority
          className="relative z-10 w-full h-auto object-contain hidden md:block"
        />

        {/* Ảnh chính (Mobile) */}
        <Image 
          src="/images/keria-details-mobile.png" 
          alt="Keria Details Mobile" 
          width={440} 
          height={900} 
          quality={75}
          sizes="(max-width: 767px) 100vw, 0vw" 
          priority
          className="relative z-10 w-full h-auto object-contain block md:hidden"
        />
        
        {/* Vách ngăn */}
        <div className="absolute bottom-0 left-0 w-full z-50 flex items-end pointer-events-none translate-y-[45%]">
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
