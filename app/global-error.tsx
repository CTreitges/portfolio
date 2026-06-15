"use client";

/**
 * Letzte Auffanglinie: Fehler im Root-Layout selbst. global-error ersetzt das
 * RootLayout komplett (eigene html/body, KEIN Zugriff auf globals.css) — daher
 * bewusst Inline-Styles mit den Design-Tokens. Selten, aber verhindert den
 * nackten Next.js-Default-Screen auch im Worst Case. (Next 16: `unstable_retry`.)
 */
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1.5rem",
          background: "#0a0b12",
          color: "#f1f2f7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
          Da ist etwas schiefgelaufen
        </h1>
        <p style={{ color: "#a3a7bd", marginTop: "1rem" }}>
          Ein unerwarteter Fehler ist aufgetreten.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            marginTop: "2rem",
            borderRadius: "9999px",
            border: "none",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            background: "#22d3ee",
            color: "#0a0b12",
          }}
        >
          Erneut versuchen
        </button>
      </body>
    </html>
  );
}
