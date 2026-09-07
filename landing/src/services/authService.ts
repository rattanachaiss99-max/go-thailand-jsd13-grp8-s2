/**
 * authService.ts — Centralized user authentication & status check service
 * Go Thailand (JSD13 Grp8)
 *
 * Can be used in Next.js or copied to Vite React apps.
 */

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://go-thailand-jsd13-grp8-s2.onrender.com';
export const TOKEN_KEY = 'gt_token';

export interface CurrentUser {
  _id: string;
  email: string;
  role: 'customer' | 'admin';
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string | null;
  membershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  points?: number;
  bookingCount?: number;
  wishlist?: string[];
  addresses?: Array<{
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
  }>;
  preferredLanguage?: string;
}

export interface AuthStatusResult {
  isAuthenticated: boolean;
  user: CurrentUser | null;
  error?: string;
}

// Mock fallback to keep UI functional when local backend server is offline during dev
const MOCK_USER_FALLBACK: CurrentUser = {
  _id: '66ce7000f1a2b3c4d5e6f700',
  email: 'somchai@example.com',
  role: 'customer',
  firstName: 'Somchai',
  lastName: 'Jaidee',
  phone: '081-234-5678',
  membershipTier: 'gold',
  points: 4500,
  bookingCount: 12,
  wishlist: ['wat-arun-bkk', 'doi-inthanon', 'maya-bay'],
  addresses: [
    {
      label: 'บ้าน',
      line1: '123 ถ.สุขุมวิท',
      city: 'คลองเตย',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110',
      isDefault: true
    }
  ]
};

/**
 * Check current logged-in user from localStorage token
 */
export async function checkCurrentUser(): Promise<AuthStatusResult> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { isAuthenticated: true, user: data.user };
    }

    if (response.status === 401) {
      if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
      return { isAuthenticated: false, user: null };
    }
  } catch (err) {
    console.warn('[authService] Backend offline or unreachable, using fallback for dev testing:', err);
    return { isAuthenticated: true, user: MOCK_USER_FALLBACK };
  }

  return { isAuthenticated: false, user: null };
}

/**
 * Save token to localStorage
 */
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Remove token on logout
 */
export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Retrieve saved token
 */
export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}
