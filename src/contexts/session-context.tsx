
'use client';

import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { getAuth, onIdTokenChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase/sdk';

const auth = getAuth(app);

// This is a workaround to store the session cookie
// on the client side for server components to access.
async function setSessionCookie(idToken: string) {
    try {
        await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        });
    } catch (error) {
        console.error("Failed to set session cookie:", error);
    }
}

async function removeSessionCookie() {
    try {
        await fetch("/api/auth/session", { method: "DELETE" });
    } catch (error) {
        console.error("Failed to remove session cookie:", error);
    }
}

export interface AppUser extends User {
  isAdmin?: boolean;
}

interface SessionContextType {
  user: AppUser | null;
  loading: boolean;
  forceRefresh: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const handleIdTokenChange = useCallback(async (firebaseUser: User | null) => {
    setLoading(true);
    if (firebaseUser) {
      const idTokenResult = await firebaseUser.getIdTokenResult(true); // Force refresh
      const isAdmin = idTokenResult.claims.admin === true;
      
      await setSessionCookie(idTokenResult.token);
      
      setUser({ ...firebaseUser, isAdmin });
    } else {
      await removeSessionCookie();
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, handleIdTokenChange);
    return () => unsubscribe();
  }, [handleIdTokenChange]);
  
  const forceRefresh = useCallback(async () => {
      const currentUser = auth.currentUser;
      await handleIdTokenChange(currentUser);
  }, [handleIdTokenChange]);

  const value = {
    user,
    loading,
    forceRefresh,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
