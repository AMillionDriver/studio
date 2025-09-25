
import type { ReactNode } from 'react';
// The root layout is now handled in [locale]/layout.tsx to ensure
// the locale is always available and providers are set up correctly.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
