import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @description Auth helpers — password hashing + JWT signing/verifying.
// Secrets are read from environment variables; never hardcoded.

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  console.warn('[auth] JWT_SECRET is not set. Token signing will fail until provided.');
}

export interface JwtPayload {
  sub: string; // user id
  role: 'customer' | 'admin';
  email: string;
}

export async function hashPassword(plain: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: JwtPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required to sign tokens.');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required to verify tokens.');
  }
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
