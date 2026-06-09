/**
 * Endlos-Marquee (CSS-Animation, pausiert on hover). Inhalt wird verdoppelt,
 * damit der Loop nahtlos ist (translateX -50%).
 */
export default function Marquee({ items }: { items: string[] }) {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-3 group-hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-sm text-text-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
