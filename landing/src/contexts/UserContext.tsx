'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { AuthUser, loginUser, registerUser, fetchMe } from '@/server/api/auth';

// @description UserContext — central auth state shared across pages
// (per react-crm-lifecycle: "state used by many components → Context").
// Holds user + token, persists token in localStorage, exposes login/register/logout.

interface UserContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; firstName: string; lastName: string; role?: 'customer' | 'admin' }) => Promise<void>;
  logout: () => void;
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
        if (active) setLoading(false);
      });
    return () => {
      active = false;
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

  return (
    <UserContext.Provider value={{ user, token, loading, login, register, logout }}>
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
