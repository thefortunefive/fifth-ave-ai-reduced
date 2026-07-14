'use client';

// TODO: cheaper model — SECTION 2: PROOF (scaffold)
// Done: layout, brand styling, glass cards w/ gold hover border, shared fade-up reveal.
// Left to do:
//   - Replace the three placeholder image divs with real imagery
//     (<!-- REPLACE: public/proof-avatar.jpg / proof-listing.jpg / proof-content.jpg -->)
//   - Punch up card copy (2–3 sentences each, premium tone)
//   - Optional: subtle gold icon per card

import { useRef } from 'react';
import { useFadeUp } from '@/lib/animations';

const CARDS = [
  {
    title: 'AI Avatar Assistants',
    body: 'Digital team members that greet, qualify, and convert — on camera, in your brand voice, around the clock.',
  },
  {
    title: 'Listing Intelligence',
    body: 'Every listing analyzed, priced, and positioned with data your competitors never see.',
  },
  {
    title: 'Content Systems',
    body: 'A content engine that turns one shoot into a month of on-brand output, automatically.',
  },
];

export default function Proof() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="proof" className="relative bg-dark px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
          What we build
        </p>
        <h2 data-reveal className="font-display mt-4 max-w-2xl text-4xl text-white md:text-5xl">
          Proof, not promises.
        </h2>
        <div className="gold-rule mt-10" data-reveal />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              data-reveal
              data-reveal-group="proof-cards"
              className="glass-card group rounded-xl p-1"
            >
              {/* TODO: cheaper model — replace with real image */}
              {/* <!-- REPLACE: public/proof-*.jpg --> */}
              <div className="flex h-48 items-center justify-center rounded-lg bg-dark-2">
                <span className="text-xs uppercase tracking-widest text-white/25">
                  Image placeholder
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-white transition-colors duration-300 group-hover:text-gold">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
