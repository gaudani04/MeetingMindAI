"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AUTH_COOKIE = "sma-auth";
const EMAIL_KEY = "sma-email";

function setClientCookie(value: string, maxAgeSec: number) {
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
}

function clearClientCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
}

type AuthContextValue = {
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMAIL_KEY);
      if (stored) setEmail(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback((userEmail: string) => {
    setClientCookie("1", 60 * 60 * 24 * 7);
    try {
      localStorage.setItem(EMAIL_KEY, userEmail);
    } catch {
      /* ignore */
    }
    setEmail(userEmail);
  }, []);

  const logout = useCallback(() => {
    clearClientCookie();
    try {
      localStorage.removeItem(EMAIL_KEY);
    } catch {
      /* ignore */
    }
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({ email, login, logout }),
    [email, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export { AUTH_COOKIE };
