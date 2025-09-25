
import '../globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { AppProviders } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'AniStream',
  description: 'A user-friendly anime streaming platform.',
};

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
       <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
       </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <AppProviders locale={locale}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
