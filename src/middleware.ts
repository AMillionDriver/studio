
import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';
 
const I18nMiddleware = createI18nMiddleware({
  locales: ['id', 'en', 'ja', 'zh', 'ko', 'de', 'ru', 'ar', 'fr', 'es', 'pt', 'it', 'hi', 'tr', 'nl', 'pl', 'sv', 'vi', 'th', 'ms'],
  defaultLocale: 'id',
  urlMappingStrategy: 'rewrite',
});
 
export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}
 
export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
