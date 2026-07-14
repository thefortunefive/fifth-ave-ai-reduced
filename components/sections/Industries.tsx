'use client';

// TODO: cheaper model — SECTION 5: INDUSTRIES (scaffold)
// Done: 6 tags, brand styling, staggered fade-up via shared spec, gold hover tint.
// Left to do:
//   - Upgrade the tag entrance to a more playful animation if desired
//     (e.g. slight scale/rotation randomization per tag).
//   - Optional: marquee/drift loop animation across the row.

import { useRef } from 'react';
import { useFadeUp } from '@/lib/animations';

const INDUSTRIES = [
  'Real Estate',
  'Law Firms',
  'Healthcare',
  'Retail',
  'Restaurants',
  'Consulting',
];

export default function Industries() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="industries" className="relative bg-dark-2 px-6 py-28 md:py-36">
      <div className="mx-auto max-w-5xl text-center">
        <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
          Where it works
        </p>
        <h2 data-reveal className="font-display mt-4 text-4xl text-white md:text-5xl">
          Built for businesses that move.
        </h2>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {INDUSTRIES.map((name) => (
            <span
              key={name}
              data-reveal
              data-reveal-group="industry-tags"
              className="glass-card cursor-default rounded-full px-7 py-3 text-sm uppercase tracking-widest text-white/80 hover:text-gold"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
