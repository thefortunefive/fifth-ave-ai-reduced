'use client';

/**
 * HERO — video scroll scrub (Apple-style) with a static-camera idle loop.
 *
 * Two layers, one visible at a time:
 *   IDLE  (scroll ≈ 0):  /hero-idle.mp4 — a dedicated static-camera clouds
 *                         shot (13.25s loop, crossfade-spliced at a point
 *                         where the cloud field nearly matches t=0), so a
 *                         normal forward <video loop> is seamless. Clouds
 *                         move; the camera provably doesn't (drift ≤0.04px).
 *   SCRUB (scrolling):    /hero-web.mp4 — the FULL spliced sequence (~43.5s:
 *                         static office → pan → doors open → board → ride to
 *                         Floor 02 → doors part → office + directory),
 *                         paused, currentTime = progress * duration via
 *                         ScrollTrigger. Encoded with -g 3 (keyframe every
 *                         0.1s) for near-frame-accurate seeking.
 *
 * Both clips start on the same frame, so the idle→scrub fade at scroll 0 is
 * invisible. Posters guarantee a stable first paint (and a mobile fallback
 * if autoplay is blocked — never a black box).
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Below this progress the idle loop shows; above it the scrub owns the view. */
const IDLE_THRESHOLD = 0.005;

const BEATS: { start: number; end: number; lines: string[] }[] = [
  { start: 0.0, end: 0.15, lines: ['Fifth Ave AI', 'Where Business Meets Intelligence'] },
  { start: 0.2, end: 0.4, lines: ["We don't just talk about AI"] },
  { start: 0.45, end: 0.65, lines: ['We build it into your business'] },
  { start: 0.7, end: 0.9, lines: ['And it works while you sleep'] },
];

function beatOpacity(p: number, start: number, end: number, fade = 0.04) {
  if (start === 0 && p <= 0) return 1;
  if (p < start || p >= end) return 0;
  const rampIn = start === 0 ? 1 : Math.min(1, (p - start) / fade);
  const rampOut = Math.min(1, (end - p) / fade);
  return Math.min(rampIn, rampOut);
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrubRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<HTMLVideoElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scrubV = scrubRef.current;
    const idleV = idleRef.current;
    if (!section || !scrubV || !idleV) return;
    const scrub: HTMLVideoElement = scrubV;
    const idle: HTMLVideoElement = idleV;

    let progress = 0;
    let parallaxOn = false;
    let idleActive: boolean | null = null; // null = unset, force first update
    let idlePauseTimer: ReturnType<typeof setTimeout> | undefined;

    // ---- idle loop ↔ scrub visibility ----
    // The idle <video loop> sits above the scrub video and fades out on the
    // first scroll (500ms CSS transition). It keeps playing through the fade,
    // then pauses to save power; scrolling back resumes it.
    const setIdle = (on: boolean) => {
      if (idleActive === on) return;
      idleActive = on;
      clearTimeout(idlePauseTimer);
      idle.style.opacity = on ? '1' : '0';
      if (on) {
        idle.play().catch(() => {}); // muted+playsinline: allowed everywhere
      } else {
        idlePauseTimer = setTimeout(() => {
          if (!idleActive) idle.pause();
        }, 550);
      }
    };

    // ---- scroll → scrub currentTime + text beats ----
    const render = (p: number) => {
      progress = p;
      setIdle(p <= IDLE_THRESHOLD);
      if (scrub.duration && isFinite(scrub.duration)) {
        scrub.currentTime = p * scrub.duration;
      }

      BEATS.forEach((beat, idx) => {
        const el = beatRefs.current[idx];
        if (!el) return;
        const o = beatOpacity(p, beat.start, beat.end);
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o > 0 ? 'visible' : 'hidden';
        if (parallaxOn) {
          const local = gsap.utils.clamp(0, 1, (p - beat.start) / (beat.end - beat.start));
          el.style.transform = `translateY(${(0.5 - local) * 40}px)`;
        } else {
          el.style.transform = 'none';
        }
      });

      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - p / 0.08));
      }
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      parallaxOn = true;
      render(progress);
      return () => { parallaxOn = false; };
    });

    render(0);

    return () => {
      clearTimeout(idlePauseTimer);
      idle.pause();
      scrub.pause();
      st.kill();
      mm.revert();
    };
  }, []);

  return (
    // 400vh runway: the spliced scrub is ~36s (clouds → pan → doors open →
    // ride to Floor 02 → office establishing shot), trimmed before the
    // directory close-up so the HTML menu below is the only directory.
    <section ref={sectionRef} className="relative h-[400vh] bg-dark" aria-label="Intro">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Scrub layer — full footage (pan + elevator ascent), paused;
            currentTime driven by scroll progress. */}
        <video
          ref={scrubRef}
          src="/hero-web.mp4"
          poster="/hero-poster.jpg"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Idle layer — dedicated static-camera clouds loop (13.25s,
            crossfade-spliced; camera measured static, drift ≤0.04px). Plays
            at scroll 0; first scroll fades it out to reveal the scrub. */}
        <video
          ref={idleRef}
          src="/hero-idle.mp4"
          poster="/hero-poster.jpg"
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
          style={{ opacity: 1 }}
        />

        {/* Legibility scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark/40 via-transparent to-dark/70" />

        {/* Bottom fade to #0A0A0A for seamless transition to WebDesignMenu */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28vh]"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, #0A0A0A 92%)' }}
        />

        {/* Text beats */}
        {BEATS.map((beat, idx) => (
          <div
            key={idx}
            ref={(el) => { beatRefs.current[idx] = el; }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ opacity: 0, visibility: 'hidden', willChange: 'opacity, transform' }}
          >
            {idx === 0 ? (
              <>
                <h1 className="font-display text-5xl leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
                  {beat.lines[0]}
                </h1>
                <p className="text-gold-gradient mt-5 max-w-2xl text-lg font-light uppercase tracking-[0.3em] md:text-xl">
                  {beat.lines[1]}
                </p>
              </>
            ) : (
              <p className="font-display max-w-4xl text-4xl leading-snug text-white md:text-6xl">
                {beat.lines[0]}
              </p>
            )}
          </div>
        ))}

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-white/60">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
        </div>
      </div>
    </section>
  );
}
