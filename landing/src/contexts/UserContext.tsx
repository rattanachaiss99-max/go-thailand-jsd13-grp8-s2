'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { AuthUser, loginUser, registerUser, fetchMe, updateUserProfile } from '@/server/api/auth';

// @description UserContext — central auth state shared across pages
// (per react-crm-lifecycle: "state used by many components → Context").
// Holds user + token, persists token in localStorage, exposes login/register/logout/updateProfile.

interface UserContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; firstName: string; lastName: string; role?: 'customer' | 'admin' }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<AuthUser>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const TOKEN_KEY = 'gt_token';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore token from storage and fetch profile.
  useEffect(() => {
    let active = true;
    const saved = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!saved) {
      if (active) setLoading(false);
      return;
    }
    setToken(saved);

    // Safety timeout: รับประกันว่าหน้าจอจะไม่ค้าง loading เกิน 3.5 วินาทีไม่ว่ากรณีใดๆ
    const safetyTimer = setTimeout(() => {
      if (active) setLoading(false);
    }, 3500);

    fetchMe(saved)
      .then((d) => {
        if (active) setUser(d.user);
      })
      .catch(() => {
        // token invalid → clear
        if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
        if (active) setToken(null);
      })
      .finally(() => {
        clearTimeout(safetyTimer);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (input: { email: string; password: string; firstName: string; lastName: string; role?: 'customer' | 'admin' }) => {
    const res = await registerUser(input);
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetchMe(token);
      setUser(res.user);
    } catch {
      // ignore
    }
  };

  const updateProfile = async (data: Partial<AuthUser>): Promise<AuthUser> => {
    if (!token) throw new Error('กรุณาเข้าสู่ระบบก่อนทำการแก้ไขข้อมูล');
    const res = await updateUserProfile(token, data);
    setUser(res.user);
    return res.user;
  };

  return (
    <UserContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
