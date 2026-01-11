'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole, RegisterData, LoginData } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isClient: boolean;
  isProvider: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Fetch user profile from profiles table with retry
  const fetchProfile = async (userId: string, retries = 3): Promise<User | null> => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        return {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          role: data.role as UserRole,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }

      // Wait before retry (profile might not be created yet by trigger)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Silent fail - profile will be fetched on next auth state change
    return null;
  };

  // Check session on mount and listen for auth changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setSupabaseUser(session.user);
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setSupabaseUser(session.user);
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          setSupabaseUser(null);
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: LoginData) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Pogrešan email ili lozinka');
      }
      throw new Error(error.message);
    }

    if (authData.user) {
      const profile = await fetchProfile(authData.user.id);
      setUser(profile);
      setSupabaseUser(authData.user);

      // Redirect based on role
      if (profile?.role === UserRole.PROVIDER) {
        router.push('/dashboard');
      } else {
        router.push('/salons');
      }
    }
  };

  const register = async (data: RegisterData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone || '',
          role: data.role,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('Korisnik sa ovom email adresom već postoji');
      }
      throw new Error(error.message);
    }

    if (authData.user) {
      // Fetch profile with retry (trigger might take time to create it)
      const profile = await fetchProfile(authData.user.id, 5);
      setUser(profile);
      setSupabaseUser(authData.user);

      // Redirect based on role
      if (data.role === UserRole.PROVIDER) {
        router.push('/salon-setup');
      } else {
        router.push('/salons');
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: user !== null,
    isClient: user?.role === UserRole.CLIENT,
    isProvider: user?.role === UserRole.PROVIDER,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
