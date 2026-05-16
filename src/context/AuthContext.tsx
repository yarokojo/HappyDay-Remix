import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSigningIn: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_EMAIL = 'passtyyaro302@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(user.email === ADMIN_EMAIL);
        setUser(user);
        
        // Sync user profile to Firestore in background
        const syncProfile = async () => {
          const userPath = `users/${user.uid}`;
          try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
              await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName || 'Guest User',
                photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
                email: user.email || 'no-email@provided.com',
                createdAt: serverTimestamp(),
                lastSeen: serverTimestamp()
              }).catch(e => {
                handleFirestoreError(e, OperationType.CREATE, userPath);
              });
            } else {
              // Update last seen in background
              await updateDoc(userRef, {
                lastSeen: serverTimestamp()
              }).catch(e => {
                handleFirestoreError(e, OperationType.UPDATE, userPath);
              });
            }
          } catch (err) {
            console.error("Profile sync error for user:", user.uid, err);
          }
        };
        syncProfile();
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      console.log("Initiating Google Sign In...");
      await signInWithPopup(auth, googleProvider);
      console.log("Sign In successful");
    } catch (err: any) {
      console.error("Auth Error details:", err);
      let message = "Failed to sign in. Please try again.";
      
      if (err.message?.includes('apiKey') || err.code === 'auth/api-key-not-valid' || err.message?.includes('API key')) {
        message = "Firebase API Key is invalid or restricted. Please go to Settings (gear icon) and ensure Firebase is correctly set up, or try running 'Initialize Firebase' again.";
      } else if (err.code === 'auth/popup-blocked') {
        message = "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = "Sign-in window was closed before finishing.";
      } else if (err.code === 'auth/unauthorized-domain') {
        message = "This domain is not authorized for Google Sign-In. Please check Firebase console.";
      } else if (err.code === 'auth/network-request-failed') {
        message = "Network error or Firebase blocked. Check your internet connection or any ad-blockers.";
      }
      setError(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isSigningIn, error, signIn, logout }}>
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
