
import { createI18nMiddleware } from 'next-international/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
const I18nMiddleware = createI18nMiddleware({
  locales: ['id', 'en', 'ja', 'zh', 'ko', 'de', 'ru', 'ar', 'fr', 'es', 'pt', 'it', 'hi', 'tr', 'nl', 'pl', 'sv', 'vi', 'th', 'ms'],
  defaultLocale: 'id',
  urlMappingStrategy: 'rewrite',
});
 
export function middleware(request: NextRequest) {
  try {
    return I18nMiddleware(request);
  } catch (error) {
    console.error('Edge middleware failed', {
      error,
      url: request.nextUrl.href,
    });

    return NextResponse.rewrite(new URL('/500', request.url));
  }
}
 
export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
