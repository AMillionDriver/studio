
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously as firebaseSignInAnonymously,
  AuthError
} from 'firebase/auth';
import { app } from '@/lib/firebase/sdk';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const auth = getAuth(app);

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const formatAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Email ini sudah digunakan. Silakan gunakan email lain atau login.';
    case 'auth/invalid-email':
      return 'Format email tidak valid. Silakan periksa kembali.';
    case 'auth/weak-password':
      return 'Password terlalu lemah. Gunakan minimal 6 karakter.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email atau password salah. Silakan coba lagi.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan login. Coba lagi nanti.';
    default:
      return 'Terjadi kesalahan otentikasi. Silakan coba lagi.';
  }
};


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

  const handleAuthSuccess = (redirectPath: string = '/') => {
    router.push(redirectPath);
    toast({
      title: "Login Berhasil",
      description: "Selamat datang!",
    });
  };

  const handleAuthError = (error: AuthError) => {
    console.error("Authentication error", error.code, error.message);
    if (error.code === 'auth/popup-closed-by-user') {
      toast({
        title: "Login Dibatalkan",
        description: "Anda menutup jendela login sebelum proses selesai.",
        variant: "default",
      });
    } else {
      const friendlyMessage = formatAuthError(error.code);
      toast({
        title: "Otentikasi Gagal",
        description: friendlyMessage,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  const signInWithGoogle = async () => {
    setLoading(true);
    console.log("Attempting to sign in with Google...");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleAuthSuccess();
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      handleAuthSuccess();
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      handleAuthSuccess();
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signInAnonymously = async () => {
    setLoading(true);
    try {
      await firebaseSignInAnonymously(auth);
      handleAuthSuccess();
    } catch (error: any) {
      handleAuthError(error);
    }
  };


  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
      toast({
        title: "Logout Berhasil",
      });
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

  const value = { user, loading, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail, signInAnonymously };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
