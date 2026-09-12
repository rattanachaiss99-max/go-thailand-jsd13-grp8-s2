// @server/api/auth.ts
// All auth-related fetch calls live here (per react-crm-lifecycle skill:
// "ALL fetch() calls live here, separated from UI").

export interface AuthUser {
  id: string;
  _id?: string;
  email: string;
  role: 'customer' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  membershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  points?: number;
  bookingCount?: number;
  wishlist?: string[];
  addresses?: any[];
  preferredLanguage?: string;
  preferredCountry?: string;
  visitedProvinces?: string[];
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'customer' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * กำหนด Base URL ของ Auth API:
 * - บน Browser: หากไม่ได้ระบุ NEXT_PUBLIC_AUTH_API_URL หรือระบุเป็น render ที่หลับอยู่
 *   ให้ใช้ relative path "" เพื่อยิงเข้า Next.js API Routes (/api/auth/...) บนเครื่อง/โดเมนเดียวกันโดยตรง
 *   ซึ่งเชื่อมต่อกับ MongoDB Atlas ทันที รวดเร็วและไม่ค้าง
 */
function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
  if (envUrl && envUrl.trim() && !envUrl.includes('go-thailand-jsd13-grp8-s2.onrender.com')) {
    return envUrl.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return '';
  }
  return process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '') : 'http://localhost:3100';
}

/**
 * Fetch wrapper พร้อม Timeout ป้องกันการค้างตลอดกาลเมื่อ Backend ภายนอกไม่ตอบสนอง
 */
async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 6000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: init.signal || controller.signal
    });
    return res;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('การเชื่อมต่อเซิร์ฟเวอร์หมดเวลา (Timeout) กรุณาลองใหม่อีกครั้ง');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Smart fetch ที่พยายามยิง Primary URL ก่อน และถ้าเป็น Browser แล้วล้มเหลว
 * จะ Fallback ไปยิง relative endpoint (/api/...) ของ Next.js อัตโนมัติ
 */
async function smartAuthFetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const primaryUrl = `${baseUrl}${endpoint}`;

  try {
    const res = await fetchWithTimeout(primaryUrl, init, 5000);
    return res;
  } catch (err) {
    // ถ้า primary ยิงไม่ผ่าน และกำลังรันอยู่บน Browser และ primary ไม่ใช่ relative path
    // ให้ fallback ไปยิง relative endpoint ทันที
    if (typeof window !== 'undefined' && baseUrl !== '') {
      console.warn(`[smartAuthFetch] Primary URL (${primaryUrl}) failed, falling back to local Next.js API:`, err);
      return await fetchWithTimeout(endpoint, init, 5000);
    }
    throw err;
  }
}

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export async function registerUser(input: RegisterInput): Promise<{ message: string; token: string; user: AuthUser }> {
  const res = await smartAuthFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return handle(res);
}

export async function loginUser(input: LoginInput): Promise<{ token: string; user: AuthUser }> {
  const res = await smartAuthFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return handle(res);
}

export async function fetchMe(token: string): Promise<{ user: AuthUser }> {
  const res = await smartAuthFetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handle(res);
}

export async function submitFeedback(token: string, input: { rating: number; comment?: string; topic?: string }): Promise<{ message: string; feedbacks: unknown[] }> {
  const res = await smartAuthFetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input)
  });
  return handle(res);
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await smartAuthFetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return handle(res);
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  const res = await smartAuthFetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  return handle(res);
}

export async function updateUserProfile(token: string, input: Partial<AuthUser>): Promise<{ message?: string; user: AuthUser }> {
  const res = await smartAuthFetch('/api/auth/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(input)
  });
  return handle(res);
}
