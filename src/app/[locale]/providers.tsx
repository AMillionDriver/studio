
'use client';

import { I18nProviderClient } from '../i18n/client';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, type ReactNode } from 'react';
import Header from '@/components/layout/header';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { SessionProvider } from '@/contexts/session-context';

// This is a Client Component, responsible for rendering the main body and handling client-side state.
function AppBody({ children }: { children: ReactNode }) {
  const { loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevents hydration mismatch by only rendering the header after the client has mounted.
  if (!isMounted) {
    // You can return a skeleton loader here if you want
    return (
        <>
            <div className="sticky top-0 z-50 w-full border-b bg-background/95 h-16" />
            {children}
            <Toaster />
        </>
    );
  }
  
  return (
    <>
      <FirebaseErrorListener />
      {!loading && <Header />}
      {children}
      <Toaster />
    </>
  );
}

// This is the main provider wrapper, marked as a Client Component.
export function AppProviders({
  children,
  locale
}: {
  children: ReactNode;
  locale: string;
}) {
  return (
    <I18nProviderClient locale={locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          <AuthProvider>
            <AppBody>
              {children}
            </AppBody>
          </AuthProvider>
        </SessionProvider>
      </ThemeProvider>
    </I18nProviderClient>
  );
}
