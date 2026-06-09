import type { ReactNode } from "react";

const tones = {
  default: "border-border bg-surface text-text-muted",
  accent: "border-accent/30 bg-accent/10 text-accent-soft",
  violet: "border-glow/30 bg-glow/10 text-glow-soft",
  success: "border-success/30 bg-success/10 text-success",
  warn: "border-warn/30 bg-warn/10 text-warn",
} as const;

export default function Chip({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
