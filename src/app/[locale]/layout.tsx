
"use client";

import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import { AuthProvider } from '@/contexts/auth-context';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { I18nProvider } from '../i18n-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Since we are using "use client", we can't export metadata directly.
// We'll handle title and other metadata aspects differently if needed.

function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // To prevent hydration mismatch, we can return a loader or null on the first render.
    return null;
  }
  
  return (
    <>
      {!loading && <Header />}
      {children}
      <Toaster />
    </>
  );
}


export default function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string }
}>) {
  return (
    <I18nProvider locale={params.locale}>
      <div className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
        </ThemeProvider>
      </div>
    </I18nProvider>
  );
}
