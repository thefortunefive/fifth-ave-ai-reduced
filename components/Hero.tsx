'use client';

/**
 * HERO — video scroll scrub with mobile-hardened seek architecture.
 *
 * Desktop: Lenis smooth-scroll → GSAP ScrollTrigger → RAF loop → video.currentTime
 * Mobile:  Native scroll → GSAP ScrollTrigger → RAF loop → video.currentTime
 *          + decoder priming on first touch
 *          + hero-mobile.mp4 (480p) instead of hero-web.mp4 (720p)
 *          + single active decoder (idle paused the moment scrub starts)
 *
 * Seek architecture (Phase 3):
 *   ScrollTrigger.onUpdate → only writes targetProgress (no seek here)
 *   requestAnimationFrame loop → reads targetProgress, seeks when:
 *     • not currently seeking (video.seeking guard via local `isSeeking` flag)
 *     • accumulated progress diff > threshold (0.02s mobile / 0.008s desktop)
 *     • target timestamp is inside scrub.seekable range
 *   seeked event → clears isSeeking, records actual renderedProgress so next
 *     frame can catch up to the newest targetProgress if user scrolled during seek
 *
 * Debug overlay: append ?debugHero=1 to the URL to activate.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger);

const IDLE_THRESHOLD = 0.005;

/**
 * BEATS — mapped to the v2 master (42.2s, single continuous shot):
 *   0–10s   (0–24%)   penthouse office, sunrise skyline, slow push
 *   12–16s  (28–38%)  elevator lobby, gold doors, Fifth Ave plaque
 *   16–18s  (38–43%)  doors open
 *   18–28s  (43–66%)  inside the cab, doors close, ride
 *   28–30s  (66–71%)  doors reopen
 *   30–34s  (71–81%)  walk-out reveal of the Fifth Ave AI office
 *   34–42s  (81–100%) settle on the office — kept text-free so the floor
 *                     logo and screens read clean before content release
 */
const BEATS: { start: number; end: number; lines: string[] }[] = [
  { start: 0.0,  end: 0.20, lines: ['Fifth Ave AI', 'Where Business Meets Intelligence'] },
  { start: 0.26, end: 0.42, lines: ["We don't just talk about AI"] },
  { start: 0.50, end: 0.66, lines: ['We build it into your business'] },
  { start: 0.70, end: 0.84, lines: ['And it works while you sleep'] },
];

function beatOpacity(p: number, start: number, end: number, fade = 0.04): number {
  if (start === 0 && p <= 0) return 1;
  if (p < start || p >= end) return 0;
  const rampIn = start === 0 ? 1 : Math.min(1, (p - start) / fade);
  const rampOut = Math.min(1, (end - p) / fade);
  return Math.min(rampIn, rampOut);
}

/** Phone-class: short side ≤ 600px. Does NOT include iPads with coarse pointer. */
function isPhoneClass(): boolean {
  return typeof screen !== 'undefined' && Math.min(screen.width, screen.height) <= 600;
}

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const scrubRef    = useRef<HTMLVideoElement>(null);
  const idleRef     = useRef<HTMLVideoElement>(null);
  const beatRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef     = useRef<HTMLDivElement>(null);
  const debugRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scrubEl = scrubRef.current;
    const idleEl  = idleRef.current;
    if (!section || !scrubEl || !idleEl) return;

    // ── Device detection ────────────────────────────────────────────────────
    const mobile       = isPhoneClass();
    const coarse       = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const debugMode    = new URLSearchParams(window.location.search).get('debugHero') === '1';

    // ── Global ScrollTrigger config ─────────────────────────────────────────
    // ignoreMobileResize: suppress height-only resize events from URL bar
    ScrollTrigger.config({ ignoreMobileResize: true });

    // ── Select scrub video asset ────────────────────────────────────────────
    // hero-mobile.mp4: 854×482, CRF 26, GOP=4 — lower bitrate for faster seek
    // on mobile networks; falls back to hero-web.mp4 if missing.
    const scrubSrc = mobile ? '/hero-mobile.mp4' : '/hero-web.mp4';
    if (!scrubEl.src || !scrubEl.src.endsWith(scrubSrc.replace('/', ''))) {
      scrubEl.src = scrubSrc;
      scrubEl.load();
    }

    // ── Mutable RAF state (refs, not React state — zero re-renders per frame) ─
    let targetProgress   = 0;   // latest progress from ScrollTrigger
    let renderedProgress = -1;  // progress we last successfully seeked to (−1 = never)
    let isSeeking        = false;
    let parallaxOn       = false;
    let idleActive: boolean | null = null;
    let idlePauseTimer: ReturnType<typeof setTimeout> | undefined;
    let primed           = false;
    let fallbackMode     = reducedMotion; // enter fallback for reduced-motion immediately
    let rafId: number | null = null;

    // Seek thresholds (seconds). Coarser on mobile to cap decoder work.
    const SEEK_THRESH_S = coarse ? 0.02 : 0.008;

    // ── Debug overlay ────────────────────────────────────────────────────────
    if (debugMode && debugRef.current) {
      debugRef.current.style.display = 'block';
    }

    const refreshDebug = () => {
      if (!debugMode || !debugRef.current) return;
      const sk  = scrubEl.seekable;
      const end = sk.length > 0 ? sk.end(sk.length - 1) : 0;
      const dur = scrubEl.duration || 0;
      debugRef.current.innerHTML = [
        '<b>HERO DEBUG</b>',
        `Mobile: ${mobile} | Coarse: ${coarse} | ReducedMotion: ${reducedMotion}`,
        `Viewport: ${window.innerWidth}×${window.innerHeight} | screen short: ${Math.min(screen.width, screen.height)}`,
        `Progress → target: ${targetProgress.toFixed(4)} | rendered: ${renderedProgress.toFixed(4)}`,
        `Video time → target: ${(targetProgress * dur).toFixed(3)}s | currentTime: ${scrubEl.currentTime.toFixed(3)}s`,
        `dur: ${dur.toFixed(3)}s | seeking: ${isSeeking} | readyState: ${scrubEl.readyState}`,
        `networkState: ${scrubEl.networkState} | seekable end: ${end.toFixed(3)}s`,
        `Lenis: ${getLenis() ? 'active' : 'disabled (native scroll)'}`,
        `Asset: ${scrubSrc} | primed: ${primed} | fallback: ${fallbackMode}`,
      ].join('<br/>');
    };

    // ── Idle management ──────────────────────────────────────────────────────
    const setIdle = (on: boolean) => {
      if (idleActive === on) return;
      idleActive = on;
      clearTimeout(idlePauseTimer);
      idleEl.style.opacity = on ? '1' : '0';
      if (on) {
        idleEl.play().catch(() => {});
      } else {
        // Pause after the CSS fade completes; on mobile also clear the src to
        // free the decoder slot so only scrub decoder is active.
        idlePauseTimer = setTimeout(() => {
          if (!idleActive) {
            idleEl.pause();
          }
        }, 560);
      }
    };

    // ── Seekability guard ────────────────────────────────────────────────────
    const canSeekTo = (t: number): boolean => {
      const dur = scrubEl.duration;
      if (!dur || !isFinite(dur)) return false;
      const sk = scrubEl.seekable;
      if (sk.length === 0) return false;
      return sk.end(sk.length - 1) >= t;
    };

    // ── Text beats + hint (always updated from targetProgress, no seek needed) ─
    const renderBeats = (p: number) => {
      BEATS.forEach((beat, idx) => {
        const el = beatRefs.current[idx];
        if (!el) return;
        const o = beatOpacity(p, beat.start, beat.end);
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o > 0 ? 'visible' : 'hidden';
        if (parallaxOn) {
          const span  = beat.end - beat.start;
          const local = gsap.utils.clamp(0, 1, (p - beat.start) / Math.max(span, 0.001));
          el.style.transform = `translateY(${(0.5 - local) * 40}px)`;
        } else {
          el.style.transform = 'none';
        }
      });
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - p / 0.08));
      }
    };

    // ── RAF render loop ──────────────────────────────────────────────────────
    // Beat/hint updates happen every frame (cheap DOM style writes).
    // Video seeks happen only when the accumulated progress diff exceeds the
    // threshold AND the decoder is idle (isSeeking === false).
    const rafLoop = () => {
      rafId = requestAnimationFrame(rafLoop);

      renderBeats(targetProgress);
      if (debugMode) refreshDebug();

      // Skip video seek path when in fallback mode or decoder busy
      if (fallbackMode || isSeeking) return;

      const dur = scrubEl.duration;
      if (!dur || !isFinite(dur)) return;

      // Threshold comparison in progress-space (unitless 0–1)
      const progressDiff = Math.abs(targetProgress - renderedProgress);
      if (progressDiff < SEEK_THRESH_S / dur) return;

      // Clamp 40ms below end to avoid EOF seek edge case
      const targetTime = Math.min(targetProgress * dur, dur - 0.04);
      if (!canSeekTo(targetTime)) return;

      isSeeking = true;
      scrubEl.currentTime = targetTime;
    };

    // ── seeked: clear lock, record actual position ───────────────────────────
    // renderedProgress is set to actual currentTime/duration so next frame
    // detects the diff to targetProgress (which may have advanced during seek)
    // and issues a follow-up seek if needed.
    const onSeeked = () => {
      isSeeking = false;
      const dur = scrubEl.duration;
      renderedProgress = dur > 0 ? scrubEl.currentTime / dur : 0;
    };
    scrubEl.addEventListener('seeked', onSeeked);

    // ── progress: retry seek as more data buffers ────────────────────────────
    const onVideoProgress = () => {
      if (isSeeking) return;
      const dur = scrubEl.duration;
      if (!dur || !isFinite(dur)) return;
      const targetTime = Math.min(targetProgress * dur, dur - 0.04);
      if (canSeekTo(targetTime) && Math.abs(scrubEl.currentTime - targetTime) > SEEK_THRESH_S) {
        isSeeking = true;
        scrubEl.currentTime = targetTime;
      }
    };
    scrubEl.addEventListener('progress', onVideoProgress);

    // ── error: fall back to hero-web.mp4 if hero-mobile.mp4 is missing ──────
    const onScrubError = () => {
      if (mobile && scrubEl.src.includes('hero-mobile')) {
        console.warn('[Hero] hero-mobile.mp4 unavailable, falling back to hero-web.mp4');
        scrubEl.src = '/hero-web.mp4';
        scrubEl.load();
      } else {
        console.error('[Hero] Scrub video failed — entering poster fallback');
        fallbackMode = true;
      }
    };
    scrubEl.addEventListener('error', onScrubError);

    // ── ScrollTrigger: only writes targetProgress ────────────────────────────
    const onScrollUpdate = (p: number) => {
      targetProgress = p;
      setIdle(p <= IDLE_THRESHOLD);
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate:  (self) => onScrollUpdate(self.progress),
      onRefresh: (self) => onScrollUpdate(self.progress),
    });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      parallaxOn = true;
      return () => { parallaxOn = false; };
    });

    onScrollUpdate(0);

    // ── Mobile: prime the decoder on first user interaction ──────────────────
    // Calling play() + immediate pause() unlocks the video element for
    // programmatic currentTime seeks on iOS and some Android browsers.
    const primeScrub = async () => {
      if (primed || fallbackMode) return;
      try {
        await scrubEl.play();
        scrubEl.pause();
        primed = true;
      } catch {
        console.warn('[Hero] Mobile video prime rejected — entering poster fallback');
        fallbackMode = true;
      }
    };

    if (coarse) {
      document.addEventListener('touchstart',  () => primeScrub(), { passive: true, once: true });
      document.addEventListener('pointerdown', () => primeScrub(), { passive: true, once: true });
    }

    // ── Refresh triggers ─────────────────────────────────────────────────────
    const onLoadedMetadata = () => ScrollTrigger.refresh();
    scrubEl.addEventListener('loadedmetadata', onLoadedMetadata);

    const onOrientationChange = () => setTimeout(() => ScrollTrigger.refresh(), 200);
    window.addEventListener('orientationchange', onOrientationChange);

    // Resize: only refresh when width changes (not height — URL bar noise).
    // ignoreMobileResize handles most cases; this guard catches orientation
    // flips that change width.
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Start RAF loop
    rafId = requestAnimationFrame(rafLoop);

    // Staggered refreshes after mount so fonts + layout are fully settled
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 300);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      clearTimeout(idlePauseTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      if (rafId !== null) cancelAnimationFrame(rafId);
      scrubEl.removeEventListener('seeked',          onSeeked);
      scrubEl.removeEventListener('progress',        onVideoProgress);
      scrubEl.removeEventListener('error',           onScrubError);
      scrubEl.removeEventListener('loadedmetadata',  onLoadedMetadata);
      window.removeEventListener('orientationchange', onOrientationChange);
      window.removeEventListener('resize',            onResize);
      idleEl.pause();
      scrubEl.pause();
      st.kill();
      mm.revert();
    };
  }, []);

  return (
    // 460vh runway ≈ same scrub speed as the previous 400vh/36s hero, scaled to 42.2s
    <section ref={sectionRef} className="relative h-[460vh] bg-dark" aria-label="Intro">
      {/*
        Inner sticky container uses 100svh where supported (stable viewport —
        immune to URL-bar height changes) and falls back to 100vh via the
        Tailwind h-screen class on older browsers that ignore svh.
      */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* Scrub layer — paused; currentTime driven by RAF loop */}
        <video
          ref={scrubRef}
          src="/hero-web.mp4"
          poster="/hero-poster.jpg"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Idle layer — static-camera loop at scroll 0; fades out on first scroll */}
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

        {/* Bottom fade to #0A0A0A */}
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

        {/* Debug overlay — only shown when ?debugHero=1 is in the URL */}
        <div
          ref={debugRef}
          className="fixed left-2 top-16 z-[200] max-w-xs rounded bg-black/85 p-2 font-mono text-[10px] leading-relaxed text-green-400"
          style={{ display: 'none', pointerEvents: 'none' }}
          aria-hidden
        />
      </div>
    </section>
  );
}
