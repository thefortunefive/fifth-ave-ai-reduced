'use client';

// LinkedIn-facing positioning: two capabilities presented as portfolio proof,
// with CTAs routing to Portfolio & Demos. Typography-led — no imagery required.

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';

const CAPABILITIES = [
  {
    kicker: 'Capability 01',
    title: 'Custom Websites and Digital Experiences',
    core: 'Distinctive websites built around a company, product, campaign, or business goal. Projects can include business websites, landing pages, interactive presentations, responsive experiences, and AI-enhanced web design.',
    items: [
      'Business and brand websites',
      'Landing pages',
      'Interactive presentations',
      'Responsive experiences',
      'AI-enhanced web design',
      'Deployment-ready builds',
    ],
    cta: { label: 'View Website Work', href: '/ai-tools' },
  },
  {
    kicker: 'Capability 02',
    title: 'AI Avatars and Advertising',
    core: 'Custom AI presenters and branded avatar videos created for advertising, product promotion, customer education, social media, internal communications, and company campaigns.',
    items: [
      'Custom AI avatars',
      'Branded avatar presenters',
      'Advertising and promotional videos',
      'Customer education content',
      'Social media video content',
      'Internal communications',
    ],
    cta: { label: 'View Avatar Work', href: '/ai-tools#avatar-work' },
  },
];

export default function TwoServices() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="services-home" className="relative bg-dark px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
          What I do
        </p>
        <h2 data-reveal className="font-display mt-4 max-w-3xl text-4xl text-white md:text-5xl">
          I build custom websites and AI avatar advertising for companies.
        </h2>
        <p data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
          I combine design, AI technology, visual storytelling, and practical
          implementation to create distinctive digital experiences and branded
          video content.
        </p>
        <div data-reveal className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/ai-tools"
            className="inline-block rounded-full bg-gold px-9 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
          >
            View My Work
          </Link>
          <Link
            href="/contact"
            className="inline-block rounded-full border border-gold/40 px-9 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
          >
            Discuss a Role or Project
          </Link>
        </div>
        <div className="gold-rule mt-12" data-reveal />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {CAPABILITIES.map((s) => (
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
