// @description Lightweight input validation for auth endpoints.
// Keeps rules in one place so route handlers stay thin.

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'customer' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(body: Partial<RegisterInput>): string | null {
  if (!body.email || !EMAIL_RE.test(body.email)) return 'อีเมลไม่ถูกต้อง';
  if (!body.password || body.password.length < 8) return 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
  if (!body.firstName || !body.lastName) return 'กรุณากรอกชื่อและนามสกุล';
  if (body.phone && !/^[0-9+\-\s]{6,20}$/.test(body.phone)) return 'เบอร์โทรไม่ถูกต้อง';
  if (body.role && !['customer', 'admin'].includes(body.role)) return 'บทบาทไม่ถูกต้อง';
  return null;
}

export function validateLogin(body: Partial<LoginInput>): string | null {
  if (!body.email || !EMAIL_RE.test(body.email)) return 'อีเมลไม่ถูกต้อง';
  if (!body.password) return 'กรุณากรอกรหัสผ่าน';
  return null;
}
