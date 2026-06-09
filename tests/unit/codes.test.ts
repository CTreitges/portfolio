import { describe, expect, it } from "vitest";
import { hash } from "@node-rs/argon2";
import { parseAccessCodes, verifyCode } from "@/lib/auth/codes";

describe("parseAccessCodes", () => {
  it("parst mehrere benannte Einträge", async () => {
    const h1 = await hash("code-eins");
    const h2 = await hash("code-zwei");
    const parsed = parseAccessCodes(`itfabrik:${h1};privat:${h2}`);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({ name: "itfabrik", hash: h1 });
    expect(parsed[1]).toEqual({ name: "privat", hash: h2 });
  });

  it("ignoriert leere/kaputte Einträge statt zu crashen", async () => {
    const h1 = await hash("ok");
    const parsed = parseAccessCodes(
      `;;gut:${h1};ohnedoppelpunkt;leer:;kein-argon:plaintext;`
    );
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("gut");
  });

  it("liefert [] bei undefined/leer", () => {
    expect(parseAccessCodes(undefined)).toEqual([]);
    expect(parseAccessCodes("")).toEqual([]);
  });
});

describe("verifyCode", () => {
  it("gibt den Namen des passenden Codes zurück", async () => {
    const codes = [
      { name: "itfabrik", hash: await hash("richtig-123") },
      { name: "privat", hash: await hash("anderer-456") },
    ];
    expect(await verifyCode("richtig-123", codes)).toBe("itfabrik");
    expect(await verifyCode("anderer-456", codes)).toBe("privat");
  });

  it("gibt null bei falschem Code zurück", async () => {
    const codes = [{ name: "itfabrik", hash: await hash("richtig-123") }];
    expect(await verifyCode("falsch", codes)).toBeNull();
    expect(await verifyCode("", codes)).toBeNull();
  });

  it("übersteht ungültige Hash-Einträge", async () => {
    const codes = [
      { name: "kaputt", hash: "$argon2id$invalid" },
      { name: "gut", hash: await hash("geheim") },
    ];
    expect(await verifyCode("geheim", codes)).toBe("gut");
  });
});
