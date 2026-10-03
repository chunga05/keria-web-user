import { tokenStore } from './tokenStore';

export interface AuthUser {
  id: string;
  role: string;
  status: string;
  display_name?: string;
  username?: string;
  avatar_url?: string | null;
  [key: string]: unknown;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Lấy thông tin user hiện tại qua API /api/auth/me (stateless JWT + auto refresh)
 */
export async function getCurrentJwtUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include', // gửi cookies dkvn_at, dkvn_rt
    });

    if (!res.ok) {
      tokenStore.clear();
      return null;
    }

    const data = await res.json();
    if (!data?.user) {
      tokenStore.clear();
      return null;
    }

    if (data.access_token) {
      tokenStore.set(data.access_token);
    }

    return data.user as AuthUser;
  } catch (err) {
    console.error('[getCurrentJwtUser] Error:', err);
    return null;
  }
}

/**
 * Lấy raw access token string (cho Authorization headers)
 */
export async function getJwtAccessToken(): Promise<string | null> {
  const memoryToken = tokenStore.get();
  if (memoryToken) return memoryToken;

  const cookieToken = getCookie('dkvn_at');
  if (cookieToken) {
    tokenStore.set(cookieToken);
    return cookieToken;
  }

  return tokenStore.refreshOnce();
}

/**
 * Khởi tạo auth khi load app
 */
export async function initAuth(): Promise<AuthUser | null> {
  return getCurrentJwtUser();
}
