// proxy.js
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const locales = ['fr', 'en'];
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export function proxy(request) {
  const { nextUrl, headers } = request;
  const pathname = nextUrl.pathname;

  // Si l’URL commence déjà par une locale supportée, on laisse passer
  const pathnameLocale = pathname.split('/')[1];
  if (locales.includes(pathnameLocale)) {
    return intlMiddleware(request);
  }

  // Sinon, détecter la langue du navigateur via header Accept-Language
  const acceptLang = headers.get('accept-language');
  let preferred = defaultLocale;
  if (acceptLang) {
    // prendre le premier segment avant la virgule
    const firstLang = acceptLang.split(',')[0].split('-')[0];
    if (locales.includes(firstLang)) {
      preferred = firstLang;
    }
  }

  // rediriger vers /{preferred}{pathname}
  const url = new URL(request.url);
  url.pathname = `/${preferred}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/((?!api|_next|_static|favicon\\.ico|.*\\..*).*)',
};
