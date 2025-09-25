
'use client';

import { I18nProviderClient } from './i18n/client';

export function I18nProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <I18nProviderClient locale={locale} fallback={<p>Loading...</p>}>
      {children}
    </I18nProviderClient>
  );
}
