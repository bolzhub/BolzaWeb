import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Ignore les fichiers statiques et les API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return;
  }

  // Redirection automatique si pas de /fr ou /en
  if (!/^\/(fr|en)/.test(pathname)) {
    const locale = request.headers.get("accept-language")?.startsWith("fr")
      ? "fr"
      : "en";
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}
