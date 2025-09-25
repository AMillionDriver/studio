
import '../globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { AppProviders } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <body className={`${inter.variable} font-body antialiased`}>
      <AppProviders locale={locale}>
        {children}
      </AppProviders>
    </body>
  );
}
