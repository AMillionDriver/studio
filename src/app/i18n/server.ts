// src/i18n/server.ts
import { createI18nServer } from 'next-international/server';
 
export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
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
