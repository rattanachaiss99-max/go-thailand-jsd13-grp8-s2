// @server/api/auth.ts
// All auth-related fetch calls live here (per react-crm-lifecycle skill:
// "ALL fetch() calls live here, separated from UI").

const API_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  firstName?: string;
  lastName?: string;
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

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export async function registerUser(input: RegisterInput): Promise<{ message: string; token: string; user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return handle(res);
}

export async function loginUser(input: LoginInput): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return handle(res);
}

export async function fetchMe(token: string): Promise<{ user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handle(res);
}

export async function submitFeedback(token: string, input: { rating: number; comment?: string; topic?: string }): Promise<{ message: string; feedbacks: unknown[] }> {
  const res = await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input)
  });
  return handle(res);
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return handle(res);
}
