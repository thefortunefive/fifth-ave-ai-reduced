'use client';

// Reduced-launch homepage: the two client services, presented as two large
// editorial panels (side-by-side on desktop, stacked on mobile). Typography-led
// by design — no imagery required for launch.

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';

const SERVICES = [
  {
    kicker: 'Service 01',
    title: 'Custom AI Websites',
    core: 'Custom websites designed around your business, your offer, and the action you want visitors to take.',
    items: [
      'Business and brand websites',
      'Landing pages',
      'Product and service presentations',
      'Interactive web experiences',
      'Responsive desktop and mobile builds',
      'Deployment-ready websites',
    ],
    cta: { label: 'Discuss Your Website', href: '/contact' },
  },
  {
    kicker: 'Service 02',
    title: 'AI Avatars and Video',
    core: 'Custom AI presenters and branded video content for marketing, education, sales, and customer communication.',
    items: [
      'Custom AI avatars',
      'Branded avatar presenters',
      'Website welcome videos',
      'Product and service explainers',
      'Educational videos',
      'Social media video content',
      'Scripted avatar video production',
    ],
    cta: { label: 'Discuss Your Avatar Project', href: '/contact' },
  },
];

export default function TwoServices() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="services-home" className="relative bg-dark px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
          What we build
        </p>
        <h2 data-reveal className="font-display mt-4 max-w-3xl text-4xl text-white md:text-5xl">
          Two things, done properly.
        </h2>
        <div className="gold-rule mt-10" data-reveal />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              data-reveal
              data-reveal-group="service-panels"
              className="glass-card group flex flex-col rounded-xl p-10 md:p-12"
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold/60">
                {s.kicker}
              </p>
              <h3 className="font-display mt-4 text-3xl text-white transition-colors duration-300 group-hover:text-gold md:text-4xl">
                {s.title}
              </h3>
              <p className="mt-5 text-base leading-relaxed text-white/65">{s.core}</p>

              <ul className="mt-8 grid flex-1 grid-cols-1 content-start gap-x-6 gap-y-3 sm:grid-cols-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/55">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Link
                  href={s.cta.href}
                  className="inline-block rounded-full border border-gold/40 px-8 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
                >
                  {s.cta.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
