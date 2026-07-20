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

export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (!token) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL || 'http://localhost:3000'}/api/auth/get-session`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem('session_token');
        setSession(null);
        return;
      }

      const data = await response.json();
      setSession(data);
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
      if (token) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL || 'http://localhost:3000'}/api/auth/sign-out`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
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
