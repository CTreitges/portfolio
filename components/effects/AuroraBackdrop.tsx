/** Weicher Aurora-Glow-Hintergrund. `className` für Positionierung/Maskierung. */
export default function AuroraBackdrop({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="aurora absolute inset-0" />
    </div>
  );
}
