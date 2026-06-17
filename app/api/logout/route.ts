import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { BASE_PATH } from "@/lib/base-path";

/** POST /api/logout — Session-Cookie löschen. Liegt hinter dem Auth-Gate. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: BASE_PATH || "/",
    maxAge: 0,
  });
  return res;
}
