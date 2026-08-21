'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/appwrite';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('tot_user')); } catch {}
    }
    return null;
  });
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('tot_profile')); } catch {}
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return !localStorage.getItem('tot_user'); } catch { return true; }
    }
    return true;
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      checkSession();
    } else {
      refreshProfileSilently();
    }
  }, []);

  const refreshProfileSilently = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/users?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setProfile(data.user);
          localStorage.setItem('tot_profile', JSON.stringify(data.user));
        }
      }
    } catch (err) {
      console.warn('Could not refresh profile data (likely offline). Continuing with cached profile.');
    }
  };

  const checkSession = async () => {
    try {
      if (!user) setIsLoading(true);
      const { account } = createClient();
      const session = await account.get();
      const userData = { email: session.email, id: session.$id, name: session.name };
      setUser(userData);
      localStorage.setItem('tot_user', JSON.stringify(userData));

      const res = await fetch(`/api/users?email=${encodeURIComponent(session.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setProfile(data.user);
          localStorage.setItem('tot_profile', JSON.stringify(data.user));
        } else {
          setProfile(null);
          localStorage.removeItem('tot_profile');
        }
      } else {
        setProfile(null);
        localStorage.removeItem('tot_profile');
      }
    } catch (err) {
      if (err?.code === 401 || !user) {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('tot_user');
        localStorage.removeItem('tot_profile');
      } else {
        console.warn('Network error checking session. Keeping cached user.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isNewUser = !!user && !profile?.readingTime;
  const isExpired = profile?.plan_expires_at ? new Date(profile.plan_expires_at) < new Date() : false;
  const hasCompletedGate = !!profile?.gateCompleted && !isExpired;

  const logout = async (noRedirect = false) => {
    try {
      const { account } = createClient();
      await account.deleteSession('current');
    } catch {}
    setUser(null);
    setProfile(null);
    localStorage.removeItem('tot_user');
    localStorage.removeItem('tot_profile');
    if (!noRedirect) {
      router.push('/');
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return false;
    setProfile(prev => ({ ...prev, ...updates }));

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, profile: updates })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setProfile(data.user);
        localStorage.setItem('tot_profile', JSON.stringify(data.user));
        return true;
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
    return false;
  };

  const ensureDbUser = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, profile: { name: user.name || '' } })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setProfile(data.user);
        localStorage.setItem('tot_profile', JSON.stringify(data.user));
      }
    } catch {}
  };





  return (
    <UserContext.Provider value={{ user, profile, isLoading, isNewUser, hasCompletedGate, isExpired, checkSession, logout, updateProfile, ensureDbUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
