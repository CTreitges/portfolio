import { SignJWT, jwtVerify } from "jose";

/** Name des Session-Cookies — von proxy.ts und den API-Routen gemeinsam genutzt. */
export const SESSION_COOKIE = "pf_session";

/** Session-Lebensdauer: 7 Tage (Sekunden). */
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7;

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET fehlt oder ist zu kurz (mind. 32 Zeichen) — siehe .env.example"
    );
  }
  return new TextEncoder().encode(secret);
}

/** Signiert eine Session als HS256-JWT. `sub` = Name des verwendeten Zugangscodes. */
export async function signSession(codeName: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(codeName)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_S}s`)
    .sign(getSecret());
}

/** Verifiziert ein Session-Token. Gibt bei Erfolg den Code-Namen zurück, sonst null. */
export async function verifySession(
  token: string
): Promise<{ codeName: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload.sub ? { codeName: String(payload.sub) } : null;
  } catch {
    return null;
  }
}
