
"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { app } from '@/lib/firebase/sdk';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const auth = getAuth(app);

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    console.log("Attempting to sign in with Google...");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Login Dibatalkan",
          description: "Anda menutup jendela login sebelum proses selesai.",
          variant: "default",
        });
      } else {
        console.error("Error signing in with Google", error);
        toast({
          title: "Login Gagal",
          description: `Terjadi kesalahan: ${error.message}`,
          variant: "destructive",
        });
      }
       setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error: any)
      {
      console.error("Error signing out", error);
       toast({
        title: "Logout Gagal",
        description: `Terjadi kesalahan: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const value = { user, loading, signInWithGoogle, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
