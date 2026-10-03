'use client';

import { tokenStore } from './tokenStore';

/**
 * Drop-in replacement for fetch() that automatically:
 * 1. Attaches access token as Authorization header
 * 2. On 401: silently refreshes token and retries once
 * 3. On second 401: returns the 401 response (caller redirects to /login)
 */
export async function authFetch(
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  // Get token from memory, or try silent refresh via HttpOnly cookie
  let token = tokenStore.get() ?? (await tokenStore.refreshOnce());

  const makeRequest = (t: string | null): Promise<Response> => {
    const headers = new Headers(init.headers);
    if (t) headers.set('Authorization', `Bearer ${t}`);
    return fetch(url, { ...init, headers, credentials: 'include' });
  };

  const res = await makeRequest(token);

  if (res.status === 401) {
    // Access token might have just expired — try refresh once more
    const freshToken = await tokenStore.refreshOnce();
    if (!freshToken) return res; // Caller handles redirect
    return makeRequest(freshToken);
  }

  return res;
}
