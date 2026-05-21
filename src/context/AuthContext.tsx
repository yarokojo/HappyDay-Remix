import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

// Simplified user interface compatible with the existing app
interface AppUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  birthDate: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isSigningIn: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  skipAuth: () => void;
  updateBirthDate: (date: string) => Promise<void>;
  updateProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_EMAIL = 'passtyyaro302@gmail.com';

  const mapSupabaseUser = async (supabaseUser: User | null): Promise<AppUser | null> => {
    if (!supabaseUser) return null;
    
    // Fetch profile info from users table
    const { data: profile } = await supabase
      .from('users')
      .select('birth_date')
      .eq('uid', supabaseUser.id)
      .single();

    return {
      uid: supabaseUser.id,
      displayName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.display_name || null,
      photoURL: supabaseUser.user_metadata?.avatar_url || null,
      email: supabaseUser.email || null,
      birthDate: profile?.birth_date || null
    };
  };

  useEffect(() => {
    // Check for persisted guest user first
    if (typeof localStorage !== 'undefined') {
      const persistedGuest = localStorage.getItem('guest_user');
      if (persistedGuest) {
        try {
          const guestData = JSON.parse(persistedGuest);
          setUser(guestData);
          setLoading(false);
        } catch (e) {
          console.error("Failed to parse guest user", e);
        }
      }
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const mappedUser = await mapSupabaseUser(session.user);
        setUser(mappedUser);
        setIsAdmin(mappedUser?.email === ADMIN_EMAIL);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const mappedUser = await mapSupabaseUser(session.user);
        setUser(mappedUser);
        setIsAdmin(mappedUser?.email === ADMIN_EMAIL);
        
        if (mappedUser) {
          syncProfile(mappedUser);
        }
      } else {
        // Only clear if not in "Guest" mode (we'll use a prefix for guest IDs)
        setUser(prev => (prev?.uid && prev.uid.startsWith('guest_')) ? prev : null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Handle OAuth popup success and auto-close
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === 'SUPABASE_AUTH_SUCCESS') {
        console.log("OAuth success received from popup");
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session) {
            const mappedUser = await mapSupabaseUser(session.user);
            setUser(mappedUser);
            setIsAdmin(mappedUser?.email === ADMIN_EMAIL);
          }
        });
      }
    };
    window.addEventListener('message', handleMessage);

    // If this window is a popup and has a session in the URL, notify opener and close
    if (window.opener && (window.location.hash.includes('access_token=') || window.location.search.includes('code='))) {
      const checkSessionAndNotify = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.opener.postMessage({ type: 'SUPABASE_AUTH_SUCCESS' }, window.location.origin);
          setTimeout(() => window.close(), 1000);
        }
      };
      checkSessionAndNotify();
    }

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const syncProfile = async (appUser: AppUser) => {
    if (appUser.uid.startsWith('guest_')) return; // Don't sync guests
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('uid')
        .eq('uid', appUser.uid)
        .single();
      
      if (!existingUser) {
        await supabase.from('users').insert({
          uid: appUser.uid,
          display_name: appUser.displayName || 'Guest User',
          photo_url: appUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          email: appUser.email || 'no-email@provided.com',
          created_at: new Date().toISOString(),
          last_seen: new Date().toISOString()
        });
      } else {
        await supabase.from('users').update({
          last_seen: new Date().toISOString()
        }).eq('uid', appUser.uid);
      }
    } catch (err) {
      console.error("Profile sync error for user:", appUser.uid, err);
    }
  };

  const updateBirthDate = async (date: string) => {
    if (!user) return;
    try {
      if (!user.uid.startsWith('guest_')) {
        const { error } = await supabase
          .from('users')
          .update({ birth_date: date })
          .eq('uid', user.uid);
        
        if (error) throw error;
      } else {
        // Save guest user updates
        const updatedUser = { ...user, birthDate: date };
        localStorage.setItem('guest_user', JSON.stringify(updatedUser));
      }
      
      setUser(prev => prev ? { ...prev, birthDate: date } : null);
    } catch (err) {
      console.error("Error updating birth date:", err);
      throw err;
    }
  };

  const updateProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!user) return;
    try {
      if (!user.uid.startsWith('guest_')) {
        // Update Supabase Auth metadata
        const authUpdates: any = {};
        if (updates.displayName) authUpdates.data = { ...authUpdates.data, full_name: updates.displayName };
        if (updates.photoURL) authUpdates.data = { ...authUpdates.data, avatar_url: updates.photoURL };
        
        if (Object.keys(authUpdates).length > 0) {
          const { error: authError } = await supabase.auth.updateUser(authUpdates);
          if (authError) throw authError;
        }

        // Update 'users' table
        const tableUpdates: any = {};
        if (updates.displayName) tableUpdates.display_name = updates.displayName;
        if (updates.photoURL) tableUpdates.photo_url = updates.photoURL;

        if (Object.keys(tableUpdates).length > 0) {
          const { error: tableError } = await supabase
            .from('users')
            .update(tableUpdates)
            .eq('uid', user.uid);
          if (tableError) throw tableError;
        }
      } else {
        // Save guest user updates
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('guest_user', JSON.stringify(updatedUser));
      }
      
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  const skipAuth = () => {
    const guestUser = {
      uid: 'guest_' + Math.random().toString(36).substr(2, 9),
      displayName: 'Test User',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      email: 'test@example.com',
      birthDate: '1995-05-20' // Set a default for testing
    };
    localStorage.setItem('guest_user', JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const signIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      console.log("Initiating Supabase Google Sign In (Popup style)...");
      
      // Get the authorization URL from Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        }
      });

      if (error) throw error;
      if (!data?.url) throw new Error("Could not retrieve authorization URL");

      // Open the provider URL in a popup
      const authWindow = window.open(
        data.url,
        'supabase_oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }
    } catch (err: any) {
      console.error("Auth Error details:", err);
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('guest_user');
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isSigningIn, error, signIn, logout, skipAuth, updateBirthDate, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
