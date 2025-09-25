
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import { AuthProvider } from '@/contexts/auth-context';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, type ReactNode } from 'react';
import { I18nProviderClient } from '../i18n/client';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// This is a Client Component, responsible for rendering the main body and handling client-side state.
function AppBody({ children }: { children: ReactNode }) {
  'use client';
  const { loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevents hydration mismatch by only rendering the header after the client has mounted.
  if (!isMounted) {
    return null; 
  }
  
  return (
    <div className={`${inter.variable} font-body antialiased`}>
      {!loading && <Header />}
      {children}
      <Toaster />
    </div>
  );
}

// This is a Client Component that wraps all the client-side providers.
function AppProviders({
  children,
  locale
}: {
  children: ReactNode;
  locale: string;
}) {
  'use client';
  return (
    <I18nProviderClient locale={locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <AppBody>
            {children}
          </AppBody>
        </AuthProvider>
      </ThemeProvider>
    </I18nProviderClient>
  );
}

// This is the root Server Component. It safely accesses `params` and passes the locale down.
export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <AppProviders locale={locale}>
      {children}
    </AppProviders>
  );
}
