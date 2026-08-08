import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    // Thẻ footer tự động co giãn bằng w-full của khung cha 1440px
    <footer className="w-full bg-white pt-12 pb-6 px-8 lg:px-16 flex flex-col flex-shrink-0 border-t border-gray-100">
      
      {/* VÙNG NỘI DUNG CHÍNH */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
        
        {/* --- CỘT TRÁI: LOGO & THÔNG TIN --- */}
        <div className="flex flex-col items-start w-full lg:w-1/3">
          <Link href="/">
            <Image 
              src="/images/DEARKERIAVN LOGO 1.png" 
              alt="Dear Keria Logo" 
              width={160} 
              height={70} 
              className="object-contain -ml-2"
            />
          </Link>
          <h2 className="text-[#FF76C3] font-extrabold text-xl mt-3 tracking-wide">
            DearKeriaVN
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Liên hệ: dearkeriavn@gmail.com
          </p>

          {/* ICON MẠNG XÃ HỘI */}
          <div className="flex items-center gap-3 mt-5">
            {/* Facebook */}
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#1877F2] cursor-pointer hover:bg-blue-100 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </div>

            {/* Threads */}
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden">
              <img 
                src="/images/threadicon2.png" 
                alt="Threads Icon" 
                className="w-5 h-5 object-contain" 
              />
            </div>

            {/* Instagram */}
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-[#E1306C] cursor-pointer hover:bg-gray-200 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>

            {/* X (Twitter) */}
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-black cursor-pointer hover:bg-gray-200 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: LƯỚI MENU --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 w-full lg:w-2/3 mt-6 lg:mt-0 font-medium">
          
          {/* Cột 1 */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-semibold mb-4 text-[15px]">Trang chủ</h4>
            <ul className="space-y-3 text-gray-500 text-[14px]">
              <li><Link href="/kerias" className="hover:text-[#FF76C3] transition-colors">KERIA&apos;S</Link></li>
              <li><Link href="/hoat-dong" className="hover:text-[#FF76C3] transition-colors">HOẠT ĐỘNG</Link></li>
              <li><Link href="/project" className="hover:text-[#FF76C3] transition-colors">PROJECT</Link></li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-semibold mb-4 text-[15px]">Keria&apos;s</h4>
            <ul className="space-y-3 text-gray-500 text-[14px]">
              <li><Link href="/kerias/thanh-tich" className="hover:text-[#FF76C3] transition-colors">Thành tích</Link></li>
              <li><Link href="/kerias/lich-trinh" className="hover:text-[#FF76C3] transition-colors">Lịch trình</Link></li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-semibold mb-4 text-[15px]">Hoạt động</h4>
            <ul className="space-y-3 text-gray-500 text-[14px]">
              <li><Link href="/hoat-dong/loi-nhan" className="hover:text-[#FF76C3] transition-colors">Lời nhắn</Link></li>
              <li><Link href="/hoat-dong/so-tay" className="hover:text-[#FF76C3] transition-colors">Sổ tay hành trình</Link></li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-semibold mb-4 text-[15px]">Project</h4>
            <ul className="space-y-3 text-gray-500 text-[14px]">
              <li><Link href="/project/welcome" className="hover:text-[#FF76C3] transition-colors">&apos;Welcome to Vietnam&apos; Project</Link></li>
              <li><Link href="/project/supporting" className="hover:text-[#FF76C3] transition-colors">Supporting Project</Link></li>
              <li><Link href="/project/donations" className="hover:text-[#FF76C3] transition-colors">Stream Donations</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* ĐƯỜNG KẺ NGANG */}
      <hr className="w-full border-gray-300 mt-12 mb-6" />

      {/* COPYRIGHT */}
      <div className="text-center text-gray-400 text-[13px] font-medium pb-4">
        ©2026 All right reserved
      </div>
      
    </footer>
  );
}