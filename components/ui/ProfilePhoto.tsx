"use client";

import { useRef } from "react";

/**
 * Rundes Profilfoto mit Zoom-Lightbox auf Basis des nativen <dialog>:
 * ESC, Backdrop-Klick und Fokus-Management kommen vom Browser (hydration-
 * sicher, kein Animations-JS). Das Thumbnail ist bewusst abgedunkelt und
 * hellt bei Hover/Fokus auf (Klick-Affordanz); in der Lightbox erscheint das
 * Foto voll und ungedimmt. Plain <img>, kein next/image — der Optimizer-Pfad
 * läge sonst vor dem Auth-Gate.
 */
export default function ProfilePhoto({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`${alt} — vergrößert ansehen`}
        className="group cursor-zoom-in rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- bewusst kein next/image: Optimizer-Pfad läge vor dem Auth-Gate */}
        <img
          src={src}
          alt={alt}
          width={192}
          height={192}
          decoding="async"
          className="h-48 w-48 rounded-full border border-accent/30 object-cover brightness-[0.65] transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-100 group-focus-visible:brightness-100"
        />
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          // Klick auf den Backdrop (= das dialog-Element selbst) schließt.
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-[92vh] max-w-[min(92vw,40rem)] rounded-2xl border border-border bg-surface p-3 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <figure className="m-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- bewusst kein next/image: Optimizer-Pfad läge vor dem Auth-Gate */}
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] w-auto max-w-full rounded-lg"
          />
          <figcaption className="mt-2 flex items-center justify-between gap-4">
            <span className="font-mono text-xs text-text-faint">{alt}</span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="shrink-0 rounded-md border border-border px-2.5 py-1 font-mono text-xs text-text-muted transition-colors hover:border-border-glow hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
            >
              Schließen ✕
            </button>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}
