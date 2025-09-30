
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
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  AuthError,
  updateProfile as firebaseUpdateProfile, 
  linkWithPopup,
  getIdTokenResult
} from 'firebase/auth';
import { app } from '@/lib/firebase/sdk';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { uploadProfilePicture } from '@/lib/firebase/storage';

const auth = getAuth(app);

// This is a workaround to store the session cookie
// on the client side for server components to access.
async function setSessionCookie(user: User) {
    const idToken = await user.getIdToken(true); // Force refresh
    await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });
}

async function removeSessionCookie() {
    await fetch("/api/auth/session", { method: "DELETE" });
}

export interface AppUser extends User {
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  changeUserPassword: (oldPass: string, newPass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoFile?: File | null }) => Promise<void>;
  linkWithGoogle: () => Promise<void>;
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
    case 'auth/invalid-phone-number':
        return 'Nomor telepon tidak valid. Pastikan formatnya benar (misal: +6281234567890).';
    case 'auth/invalid-verification-code':
        return 'Kode verifikasi salah. Silakan coba lagi.';
    case 'auth/requires-recent-login':
        return 'Operasi ini memerlukan autentikasi ulang. Silakan login kembali dan coba lagi.';
    case 'auth/credential-already-in-use':
        return 'Akun Google ini sudah ditautkan dengan pengguna lain.';
    default:
      return 'Terjadi kesalahan otentikasi. Silakan coba lagi.';
  }
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        await setSessionCookie(firebaseUser);
        const idTokenResult = await getIdTokenResult(firebaseUser, true); 
        const isAdmin = idTokenResult.claims.admin === true;
        setUser({ ...firebaseUser, isAdmin });
      } else {
        await removeSessionCookie();
        setUser(null);
      }
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

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      toast({
        title: "Email Reset Password Terkirim",
        description: `Kami telah mengirimkan tautan untuk mengatur ulang kata sandi Anda ke ${email}.`,
      });
    } catch (error: any) {
       toast({
        title: "Gagal Mengirim Email",
        description: formatAuthError(error.code),
        variant: "destructive",
      });
    }
  }

  const changeUserPassword = async (oldPass: string, newPass: string) => {
    if (!user || !user.email) {
        toast({ title: "Error", description: "No user is currently signed in.", variant: "destructive" });
        return;
    }
    try {
        const credential = EmailAuthProvider.credential(user.email, oldPass);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPass);
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
    } catch (error: any) {
        toast({ title: "Password Change Failed", description: formatAuthError(error.code), variant: "destructive" });
    }
  };

  const updateUserProfile = async (data: { displayName?: string; photoFile?: File | null }) => {
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      const { displayName, photoFile } = data;
      let photoURL = auth.currentUser.photoURL;

      if (photoFile) {
        photoURL = await uploadProfilePicture(auth.currentUser.uid, photoFile);
      }

      await firebaseUpdateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL,
      });

      const idTokenResult = await auth.currentUser.getIdTokenResult(true);

      setUser({ ...auth.currentUser, isAdmin: idTokenResult.claims.admin === true });

      toast({
        title: "Profil Diperbarui",
        description: "Informasi profil Anda telah berhasil diperbarui.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Gagal Memperbarui Profil",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const linkWithGoogle = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(auth.currentUser, provider);
      toast({
        title: "Akun Berhasil Ditautkan",
        description: "Akun Google Anda telah berhasil ditautkan.",
      });
    } catch (error: any) {
       handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
      toast({ title: "Logout Berhasil" });
    } catch (error: any) {
      console.error("Error signing out", error);
       toast({ title: "Logout Gagal", description: `Terjadi kesalahan: ${error.message}`, variant: "destructive" });
    }
  };

  const value = { 
    user, 
    loading, 
    signInWithGoogle, 
    signOut, 
    signUpWithEmail, 
    signInWithEmail, 
    signInAnonymously, 
    sendPasswordResetEmail, 
    changeUserPassword,
    updateUserProfile,
    linkWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
