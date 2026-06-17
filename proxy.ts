import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Auth-Gate für die GESAMTE Site (Next 16: proxy.ts ersetzt middleware.ts,
 * läuft im Node-Runtime). Öffentlich sind nur /unlock, /api/unlock, die
 * Rechtstexte /impressum + /datenschutz (gesetzliche Pflichtangaben müssen
 * ohne Login erreichbar sein) sowie Build-Assets — alles andere braucht eine
 * gültige Session.
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token && (await verifySession(token))) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  // API-Aufrufe ohne Session: 401 statt Redirect.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // HTML: zur Unlock-Seite, Ursprungs-Pfad für den Rücksprung merken.
  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = "";
  const from = pathname + search;
  if (from && from !== "/") {
    url.searchParams.set("from", from);
  }
  return NextResponse.redirect(url, 303);
}

export const config = {
  // Alles AUSSER: Unlock-Seite + Unlock-API, statische Build-Assets, Favicons
  // (inkl. apple-icon), robots.txt und das generische OG-Bild (Link-Previews
  // ohne Leak). _next/image bleibt bewusst HINTER dem Gate: der Optimizer
  // könnte sonst geschützte Bilder (z.B. Projekt-Screenshots) öffentlich
  // ausliefern — die Site nutzt ihn nicht.
  matcher: [
    // Die Startseite explizit: mit gesetztem basePath (z. B. /portfolio) erfasst
    // das Negativ-Pattern unten die nackte Root NICHT — sie bliebe sonst
    // ungeschützt (Auth-Gate-Leck). "/" wird mit basePath zu /portfolio.
    "/",
    // Seiten-Tokens segment-verankert ((?:/|$)), damit eine künftige Route wie
    // /impressum-intern NICHT als öffentlich durchrutscht, nur weil sie mit
    // "impressum" beginnt. Asset-Tokens sind über ihre Endung schon eindeutig.
    "/((?!unlock(?:/|$)|api/unlock(?:/|$)|impressum(?:/|$)|datenschutz(?:/|$)|_next/static|favicon\\.ico|favicon\\.svg|icon\\.svg|apple-icon|og\\.png|robots\\.txt).*)",
  ],
};
