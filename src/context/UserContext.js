'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const { account } = createClient();
      const session = await account.get();
      setUser({ email: session.email, id: session.$id, name: session.name });

      const res = await fetch(`/api/users?email=${encodeURIComponent(session.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setProfile(data.user);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isNewUser = !!user && !profile?.readingTime;
  const hasCompletedGate = !!profile?.gateCompleted;

  const logout = async (noRedirect = false) => {
    try {
      const { account } = createClient();
      await account.deleteSession('current');
    } catch {}
    setUser(null);
    setProfile(null);
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
      }
    } catch {}
  };

  return (
    <UserContext.Provider value={{
      user, profile, isLoading,
      isNewUser, hasCompletedGate,
      checkSession, logout, updateProfile, ensureDbUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
