'use client';

// TODO: cheaper model — SECTION 4: ABOUT (scaffold)
// Done: two-column layout, portrait frame w/ gold border, bio copy slot,
//       external links, fade-up reveals, stacks on mobile.
// Left to do:
//   - Drop the real portrait at public/shane-portrait.jpg (400×500) and swap
//     the placeholder div for <img src="/shane-portrait.jpg" …>.
//     <!-- REPLACE: public/shane-portrait.jpg -->
//   - Replace the bio placeholder with Shane's real bio.
//   - Confirm the LinkedIn URL.

import { useRef } from 'react';
import { useFadeUp } from '@/lib/animations';

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="about" className="relative bg-dark px-6 py-28 md:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[400px_1fr]">
        {/* Portrait — <!-- REPLACE: public/shane-portrait.jpg --> */}
        <div data-reveal className="justify-self-center md:justify-self-start">
          <div className="glass-card flex h-[500px] w-full max-w-[400px] items-center justify-center rounded-xl md:w-[400px]">
            <span className="text-xs uppercase tracking-widest text-white/25">
              Portrait 400×500
            </span>
          </div>
        </div>

        <div>
          <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
            Who&apos;s behind it
          </p>
          <h2 data-reveal className="font-display mt-4 text-4xl text-white md:text-5xl">
            Built by a filmmaker.
            <br />
            Run like a studio.
          </h2>
          <p data-reveal className="mt-6 max-w-xl leading-relaxed text-white/60">
            {/* TODO: cheaper model — replace with real bio */}
            Shane spent a decade telling stories for premium brands before turning the
            camera on business itself. Fifth Ave AI pairs that cinematic instinct with
            production-grade AI systems — so the technology doesn&apos;t just work, it
            performs.
          </p>
          <div data-reveal className="mt-8 flex flex-wrap gap-6">
            <a
              href="https://fifthavefilm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-gold/40 pb-1 text-sm uppercase tracking-widest text-gold transition-colors hover:border-gold"
            >
              fifthavefilm.com
            </a>
            <a
              href="https://www.linkedin.com/" /* TODO: cheaper model — real LinkedIn URL */
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-white/20 pb-1 text-sm uppercase tracking-widest text-white/70 transition-colors hover:border-gold hover:text-gold"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
