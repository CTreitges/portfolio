"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type FormState = "idle" | "loading" | "error" | "blocked" | "success";

/**
 * Code-Eingabe mit Magic-Link-Support:
 * /unlock#code=XYZ → Code aus dem URL-Fragment lesen (geht nie zum Server,
 * taucht in keinem Log auf), Hash sofort aus der Adresszeile entfernen,
 * automatisch submitten. Bei Erfolg löst sich die Karte auf, dann Navigation.
 */
export default function UnlockForm() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  const navigate = useCallback((to: string) => {
    const card = document.getElementById("unlock-card");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (card && !reduced) {
      // Karte löst sich auf, dann Redirect (Magic-Link-Besucher erleben nur das).
      card.style.transition =
        "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)";
      card.style.opacity = "0";
      card.style.transform = "scale(0.96) translateY(-6px)";
      window.setTimeout(() => window.location.assign(to), 620);
    } else {
      window.location.assign(to);
    }
  }, []);

  const submit = useCallback(
    async (value: string) => {
      if (!value || busyRef.current) return;
      busyRef.current = true;
      setState("loading");
      setMessage("");
      try {
        const from =
          new URLSearchParams(window.location.search).get("from") ?? "/";
        const res = await fetch("/api/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: value, from }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          redirect?: string;
        };
        if (res.ok && data.ok) {
          setState("success");
          navigate(data.redirect ?? "/");
          return; // busyRef bleibt gesetzt — wir navigieren weg.
        }
        if (res.status === 429) {
          setState("blocked");
          setMessage("Zu viele Versuche — bitte in ein paar Minuten erneut.");
        } else {
          setState("error");
          setMessage("Dieser Code ist nicht gültig.");
        }
      } catch {
        setState("error");
        setMessage("Verbindung fehlgeschlagen — bitte erneut versuchen.");
      }
      busyRef.current = false;
    },
    [navigate]
  );

  useEffect(() => {
    // Nur das Code-Token bis zum nächsten '&' oder Whitespace nehmen (robust
    // gegen angehängte Parameter). decodeURIComponent darf nicht werfen.
    const match = window.location.hash.match(/#code=([^&\s]+)/);
    if (match) {
      let fromHash = match[1];
      try {
        fromHash = decodeURIComponent(fromHash);
      } catch {
        /* kaputtes Fragment → unverändert versuchen */
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Code aus URL-Fragment nach Mount (nur clientseitig verfügbar)
      setCode(fromHash);
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
      void submit(fromHash);
    } else {
      inputRef.current?.focus();
    }
  }, [submit]);

  const invalid = state === "error" || state === "blocked";

  return (
    <form
      data-state={state}
      data-testid="unlock-form"
      className={`flex flex-col gap-4 ${state === "error" ? "animate-shake" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        void submit(code.trim());
      }}
    >
      <label htmlFor="code" className="text-sm text-text-muted">
        Zugangscode
      </label>
      <input
        ref={inputRef}
        id="code"
        name="code"
        type="password"
        autoComplete="off"
        spellCheck={false}
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          if (state === "error") setState("idle");
        }}
        disabled={state === "loading" || state === "success"}
        aria-invalid={invalid}
        aria-describedby={message ? "unlock-message" : undefined}
        className={`w-full rounded-lg border bg-bg/70 px-4 py-3 font-mono text-text outline-none transition-all placeholder:text-text-faint focus:border-accent/60 focus:ring-2 focus:ring-accent/20 ${
          invalid
            ? "border-danger/70 shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-danger)_22%,transparent)]"
            : "border-border"
        }`}
        placeholder="••••••••••••"
      />
      <button
        type="submit"
        disabled={state === "loading" || state === "success" || !code.trim()}
        className="rounded-lg bg-accent px-4 py-3 font-medium text-bg transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "loading"
          ? "Prüfe …"
          : state === "success"
            ? "Willkommen"
            : "Entsperren"}
      </button>
      <p
        id="unlock-message"
        role="status"
        data-testid="unlock-message"
        className={`min-h-5 text-sm ${
          state === "blocked" ? "text-warn" : "text-danger"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
