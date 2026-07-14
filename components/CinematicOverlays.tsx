/**
 * Full-page cinematic treatment: subtle film grain + vignette.
 * Pure CSS/SVG, pointer-events disabled, sits above content but below the
 * scroll progress bar.
 */
export default function CinematicOverlays() {
  return (
    <>
      {/* Film grain — SVG turbulence tile */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '256px 256px',
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%)',
        }}
      />
    </>
  );
}
