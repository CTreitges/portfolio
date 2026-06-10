"use client";

import { useRef, useState } from "react";
import type { ProjectScreenshot } from "@/content/types";

/**
 * Screenshot-Galerie mit Lightbox auf Basis des nativen <dialog>-Elements:
 * ESC, Backdrop-Klick und Fokus-Management kommen vom Browser, kein
 * Animations-JS nötig (hydration-sicher). Bilder sind vorab optimierte
 * WebPs mit festen Maßen (CLS 0) — bewusst plain <img>, kein next/image
 * (der Optimizer-Pfad läge sonst vor dem Auth-Gate).
 */
export default function ScreenshotGallery({
  shots,
}: {
  shots: ProjectScreenshot[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<ProjectScreenshot | null>(null);

  const open = (s: ProjectScreenshot) => {
    setActive(s);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {shots.map((s) => (
          <figure key={s.src} className="m-0">
            <button
              type="button"
              onClick={() => open(s)}
              aria-label={`${s.alt} — vergrößert ansehen`}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-surface focus-visible:outline-2 focus-visible:outline-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- bewusst kein next/image: Optimizer-Pfad läge vor dem Auth-Gate */}
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                decoding="async"
                width={s.width}
                height={s.height}
                className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </button>
            {s.caption && (
              <figcaption className="mt-2 font-mono text-xs leading-relaxed text-text-faint">
                {s.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => {
          // Klick auf den Backdrop (= das dialog-Element selbst) schließt.
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-[92vh] max-w-[min(92vw,72rem)] rounded-2xl border border-border bg-surface p-3 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {active && (
          <figure className="m-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- bewusst kein next/image: Optimizer-Pfad läge vor dem Auth-Gate */}
            <img
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              className="max-h-[80vh] w-auto max-w-full rounded-lg"
            />
            <figcaption className="mt-2 flex items-center justify-between gap-4">
              <span className="font-mono text-xs text-text-faint">
                {active.caption ?? active.alt}
              </span>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="shrink-0 rounded-md border border-border px-2.5 py-1 font-mono text-xs text-text-muted transition-colors hover:border-border-glow hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
              >
                Schließen ✕
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
