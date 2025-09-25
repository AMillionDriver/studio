
'use client';

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

function AppBody({ children }: { children: ReactNode }) {
  const { loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

function AppProviders({
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
        <AuthProvider>
          <AppBody>
            {children}
          </AppBody>
        </AuthProvider>
      </ThemeProvider>
    </I18nProviderClient>
  );
}

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
