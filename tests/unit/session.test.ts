import { beforeAll, describe, expect, it } from "vitest";
import { SignJWT } from "jose";
import { signSession, verifySession } from "@/lib/auth/session";

const TEST_SECRET = "test-secret-mit-mindestens-32-zeichen-laenge!!";

beforeAll(() => {
  process.env.SESSION_SECRET = TEST_SECRET;
});

describe("signSession / verifySession", () => {
  it("Roundtrip: signiert und verifiziert mit Code-Namen", async () => {
    const token = await signSession("itfabrik");
    const session = await verifySession(token);
    expect(session).toEqual({ codeName: "itfabrik" });
  });

  it("lehnt manipulierte Tokens ab", async () => {
    const token = await signSession("itfabrik");
    const tampered = token.slice(0, -4) + "AAAA";
    expect(await verifySession(tampered)).toBeNull();
    expect(await verifySession("nicht.einmal.jwt")).toBeNull();
    expect(await verifySession("")).toBeNull();
  });

  it("lehnt Tokens mit fremdem Secret ab", async () => {
    const foreign = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("itfabrik")
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode("ein-anderes-secret-32-zeichen-lang!!"));
    expect(await verifySession(foreign)).toBeNull();
  });

  it("lehnt abgelaufene Tokens ab", async () => {
    const expired = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("itfabrik")
      .setIssuedAt(Math.floor(Date.now() / 1000) - 1000)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 10)
      .sign(new TextEncoder().encode(TEST_SECRET));
    expect(await verifySession(expired)).toBeNull();
  });

  it("lehnt unsignierte alg=none-Tokens ab", async () => {
    // Klassischer JWT-Angriff: Header auf alg "none" umschreiben.
    const header = Buffer.from(JSON.stringify({ alg: "none" })).toString(
      "base64url"
    );
    const payload = Buffer.from(
      JSON.stringify({ sub: "itfabrik", exp: Math.floor(Date.now() / 1000) + 600 })
    ).toString("base64url");
    expect(await verifySession(`${header}.${payload}.`)).toBeNull();
  });
});
