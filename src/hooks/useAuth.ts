'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface SessionData {
  user: User;
  session: {
    id: string;
    token: string;
  };
}

const AUTH_BASE = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL || 'http://localhost:3000')
  : '';

export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('session_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Try with Bearer token first (from localStorage), then fallback to cookies
      const response = await fetch(`${AUTH_BASE}/api/auth/get-session`, {
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        localStorage.removeItem('session_token');
        setSession(null);
        return;
      }

      const data = await response.json();
      setSession(data);

      // If we got a session and the token wasn't in localStorage, save it
      if (data?.session?.token && !token) {
        localStorage.setItem('session_token', data.session.token);
      }
    } catch {
      localStorage.removeItem('session_token');
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const signOut = useCallback(async () => {
    try {
      const token = localStorage.getItem('session_token');
      await fetch(`${AUTH_BASE}/api/auth/sign-out`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
    } catch {
      // sign out even if the request fails
    } finally {
      localStorage.removeItem('session_token');
      setSession(null);
      router.push('/');
      router.refresh();
    }
  }, [router]);

  return {
    session,
    user: session?.user ?? null,
    isLoggedIn: !!session,
    isLoading,
    refetch: fetchSession,
    signOut,
  };
}
