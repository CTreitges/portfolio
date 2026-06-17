import { describe, expect, it } from "vitest";
import { studiumBackHref } from "@/lib/studium-back";

describe("studiumBackHref", () => {
  it("mappt den About-Button auf den About-Anker", () => {
    expect(studiumBackHref("about")).toBe("/#about");
  });

  it("mappt den Werdegang-Button auf den Werdegang-Anker", () => {
    expect(studiumBackHref("werdegang")).toBe("/#werdegang");
  });

  it("fällt bei unbekanntem oder fehlendem from auf Werdegang zurück", () => {
    expect(studiumBackHref("foo")).toBe("/#werdegang");
    expect(studiumBackHref("")).toBe("/#werdegang");
    expect(studiumBackHref(null)).toBe("/#werdegang");
    expect(studiumBackHref(undefined)).toBe("/#werdegang");
  });
});
