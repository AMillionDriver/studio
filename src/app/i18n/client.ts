// src/i18n/client.ts
'use client';
 
import { createI18nClient } from 'next-international/client';
 
export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient({
  id: () => import('./id'),
  en: () => import('./en'),
  ja: () => import('./ja'),
  zh: () => import('./zh'),
  ko: () => import('./ko'),
  de: () => import('./de'),
  ru: () => import('./ru'),
  ar: () => import('./ar'),
  fr: () => import('./fr'),
  es: () => import('./es'),
  pt: () => import('./pt'),
  it: () => import('./it'),
  hi: () => import('./hi'),
  tr: () => import('./tr'),
  nl: () => import('./nl'),
  pl: () => import('./pl'),
  sv: () => import('./sv'),
  vi: () => import('./vi'),
  th: () => import('./th'),
  ms: () => import('./ms'),
});
