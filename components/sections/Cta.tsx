'use client';

// TODO: cheaper model — SECTION 6: CTA (scaffold)
// Done: layout, copy, city list, button to /contact, fade-up reveals, and a
//       working lightweight gold particle canvas (drifting motes).
// Left to do:
//   - Art-direct the particles (density, glow, mouse-reactivity) or replace
//     with a richer effect.
//   - Build the /contact page (currently a styled stub).

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';

const CITIES = ['Seattle', 'Atlanta', 'New York', 'Philadelphia'];

/** Minimal drifting gold-particle field. */
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let raf = 0;
    let running = false;
    const P = 40;
    const parts = Array.from({ length: P }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: -Math.random() * 0.0005 - 0.0001,
      a: Math.random() * 0.5 + 0.15,
    }));

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 183, 90, ${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    // Only animate while on screen.
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [canvasRef]);
}

export default function Cta() {
  const ref = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);
  useFadeUp(ref);
  useParticles(particlesRef);

  return (
    <section ref={ref} id="cta" className="relative overflow-hidden bg-dark px-6 py-32 md:py-48">
      <canvas
        ref={particlesRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 data-reveal className="font-display text-4xl leading-tight text-white md:text-6xl">
          Ready to Put AI <span className="text-gold-gradient">to Work?</span>
        </h2>
        <p data-reveal className="mt-6 text-lg text-white/60">
          We take 3 clients per quarter.
        </p>
        <div data-reveal className="mt-10">
          <Link
            href="/contact"
            className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
          >
            Start the Conversation
          </Link>
        </div>
        <p data-reveal className="mt-14 text-xs uppercase tracking-[0.3em] text-white/40">
          {CITIES.join('  ·  ')}
        </p>
      </div>
    </section>
  );
}
