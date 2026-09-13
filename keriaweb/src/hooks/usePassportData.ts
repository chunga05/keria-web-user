import { useState, useEffect } from 'react';

export interface UserPassportInfo {
  nickname: string;
  departureDate: string;
  location: string;
}

export function usePassportData() {
  const [passportInfo, setPassportInfo] = useState<UserPassportInfo>({
    nickname: '...',
    departureDate: '...',
    location: '...',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPassport() {
      try {
        const res = await fetch('/api/passport');
        
        if (!res.ok) {
          // Chưa đăng nhập (401) hoặc lỗi khác
          if (isMounted) {
            setPassportInfo({
              nickname: 'Khách',
              departureDate: '--/--/----',
              location: 'Chưa cập nhật',
            });
          }
          return;
        }

        const data = await res.json();

        if (isMounted) {
          setPassportInfo(data);
        }
      } catch (err) {
        console.error('Lỗi khi fetch passport API:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPassport();

    return () => {
      isMounted = false;
    };
  }, []);

  return { passportInfo, isLoading };
}