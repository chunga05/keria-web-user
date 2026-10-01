
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface OwnedStamp {
  id: number;
  stage_name: string;
  stamp_image_url: string;
  stage_order: number;
  received_at?: string | null;
}

export interface ProjectPageData {
  id: number;
  title: string;
  ownedStamps: OwnedStamp[];
}

export interface UserPassportInfo {
  nickname: string;
  passportCode?: string;
  departureDate: string;
  location: string;
  userStamps: any[];
  receivedStageIds: number[];
  projects: ProjectPageData[];
}

const EMPTY_PASSPORT: UserPassportInfo = {
  nickname: "Khách",
  passportCode: "---",
  departureDate: "--/--/----",
  location: "Chưa cập nhật",
  userStamps: [],
  receivedStageIds: [],
  projects: [],
};

export function usePassportData(enabled: boolean = false) {
  const [passportInfo, setPassportInfo] =
    useState<UserPassportInfo>(EMPTY_PASSPORT);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    // =========================================================
    // CHƯA ĐĂNG NHẬP
    // Không gọi /api/passport
    // =========================================================
    if (!enabled) {
      setPassportInfo(EMPTY_PASSPORT);
      setIsLoading(false);

      console.log(
        "⏭️ [usePassportData] Chưa xác thực → không gọi /api/passport"
      );

      return;
    }

    // =========================================================
    // ĐÃ ĐĂNG NHẬP → mới lấy dữ liệu passport
    // =========================================================
    const fetchPassport = async () => {
      try {
        setIsLoading(true);

        // Gọi thẳng /api/passport — server tự kiểm tra auth bên trong
        // Không cần gọi supabase.auth.getUser() thêm ở đây (giảm 1 round-trip)
        const response = await fetch("/api/passport", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (mounted) setPassportInfo(EMPTY_PASSPORT);
          return;
        }

        const data = await response.json();

        if (!mounted) return;

        setPassportInfo({
          nickname: data?.nickname ?? "Khách",

          passportCode:
            data?.passportCode ?? "---",

          departureDate:
            data?.departureDate ?? "--/--/----",

          location:
            data?.location ?? "Chưa cập nhật",

          userStamps:
            Array.isArray(data?.userStamps)
              ? data.userStamps
              : [],

          receivedStageIds:
            Array.isArray(data?.receivedStageIds)
              ? data.receivedStageIds
              : [],

          projects:
            Array.isArray(data?.projects)
              ? data.projects.map(
                  (project: any) => ({
                    id: project.id,
                    title: project.title ?? "",
                    ownedStamps:
                      Array.isArray(
                        project.ownedStamps
                      )
                        ? project.ownedStamps
                        : [],
                  })
                )
              : [],
        });
      } catch (error) {
        console.error(
          "❌ [usePassportData] Fetch error:",
          error
        );

        if (mounted) {
          setPassportInfo(EMPTY_PASSPORT);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPassport();

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return {
    passportInfo,
    isLoading,
  };
}

