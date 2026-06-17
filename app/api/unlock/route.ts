import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCode } from "@/lib/auth/codes";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  signSession,
} from "@/lib/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { logAccess } from "@/lib/auth/access-log";
import { BASE_PATH, withBasePath } from "@/lib/base-path";

/**
 * POST /api/unlock — { code, from? }
 * Rate-Limit → Argon2-Verify gegen alle benannten Codes → Session-Cookie.
 * Fehlermeldungen bewusst generisch (kein Oracle für Angreifer).
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const ua = request.headers.get("user-agent");

  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    void logAccess("rl_block", { ip, ua });
    return NextResponse.json(
      { ok: false, error: "too_many_attempts" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let code = "";
  let from: string | null = null;
  try {
    const body = (await request.json()) as { code?: unknown; from?: unknown };
    if (typeof body.code === "string") code = body.code;
    if (typeof body.from === "string") from = body.from;
  } catch {
    // Kein/kaputtes JSON → wie falscher Code behandeln.
  }

  if (!code || code.length > 256) {
    void logAccess("unlock_fail", { ip, ua });
    return NextResponse.json(
      { ok: false, error: "invalid_code" },
      { status: 401 }
    );
  }

  const codeName = await verifyCode(code);
  if (!codeName) {
    void logAccess("unlock_fail", { ip, ua });
    return NextResponse.json(
      { ok: false, error: "invalid_code" },
      { status: 401 }
    );
  }

  void logAccess("unlock_ok", { code: codeName, ip, ua });

  // Open-Redirect-Schutz: nur site-relative Pfade zulassen. Der Browser springt
  // per window.location.assign dorthin → der Wert braucht den basePath-Präfix
  // (withBasePath ist idempotent, falls "from" ihn schon trägt).
  const safe =
    from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
  const redirect = withBasePath(safe);

  const res = NextResponse.json({ ok: true, redirect });
  res.cookies.set(SESSION_COOKIE, await signSession(codeName), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: BASE_PATH || "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  return res;
}
