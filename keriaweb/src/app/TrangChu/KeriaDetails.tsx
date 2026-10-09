import Image from "next/image";

export default function KeriaDetails() {
  return (
    <section className="relative w-full h-auto bg-[#7CB9E8] flex flex-col items-center">
      <div className="relative w-full h-auto">
        
        {/* Ảnh chính (Desktop) */}
        <Image 
          src="/images/keria-details-new.jpg" 
          alt="Keria Details Desktop" 
          width={1024} 
          height={725} 
          quality={100}
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
        {/* --- VÙNG BẤM TRONG SUỐT CHO DESKTOP --- */}
        <div className="absolute inset-0 z-40 hidden md:block pointer-events-none">
          {/* Threads */}
          <a 
            href="https://www.threads.net/@keria_minseok" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute bottom-[20%] left-[42.7%] w-[3%] h-[4%] bg-transparent pointer-events-auto rounded-md transition-colors"
            title="Threads"
          ></a>
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/keria_minseok/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute bottom-[19%] left-[46.7%] w-[3%] h-[4%] bg-transparent pointer-events-auto rounded-md transition-colors"
            title="Instagram"
          ></a>
          {/* X (Twitter) */}
          <a 
            href="https://twitter.com/t1lol" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute bottom-[18%] left-[50.7%] w-[3%] h-[4%] bg-transparent pointer-events-auto rounded-md transition-colors"
            title="Twitter"
          ></a>
        </div>

        {/* --- VÙNG BẤM TRONG SUỐT CHO MOBILE --- */}
        <div className="absolute inset-0 z-40 block md:hidden pointer-events-none">
          {/* Threads */}
          <a 
            href="https://www.threads.net/@keria_minseok" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute top-[38%] right-[31%] w-[8%] h-[5%] bg-transparent pointer-events-auto rounded-md transition-colors"
            title="Threads"
          ></a>
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/keria_minseok/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute top-[39%] right-[21%] w-[8%] h-[5%] bg-transparent pointer-events-auto rounded-md transition-colors"
            title="Instagram"
          ></a>
          {/* X (Twitter) */}
          <a 
            href="https://twitter.com/t1lol" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute top-[40%] right-[12%] w-[8%] h-[5%] bg-transparent pointer-events-auto rounded-md transition-colors"
            title="Twitter"
          ></a>
        </div>

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
