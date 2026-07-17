'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const SERVICES = [
  {
    id: 'custom-ai-websites',
    kicker: 'Service 01',
    title: 'Custom AI Websites',
    what: 'Custom websites designed around your business, your offer, and the action you want visitors to take — built with modern web technology and current AI tooling.',
    who: 'Businesses, professionals, and product owners who want a site that presents them clearly and moves visitors toward one specific action.',
    deliverables: [
      'Business and brand websites',
      'Landing pages',
      'Product and service presentations',
      'Interactive web experiences',
      'Responsive desktop and mobile builds',
      'Deployment-ready websites',
    ],
    cta: 'Discuss Your Website',
  },
  {
    id: 'ai-avatars-and-video',
    kicker: 'Service 02',
    title: 'AI Avatars and Video',
    what: 'Custom AI presenters and branded video content for marketing, education, sales, and customer communication — scripted, produced, and delivered ready to publish.',
    who: 'Businesses that want a consistent on-camera presence for their brand without scheduling shoots for every new message.',
    deliverables: [
      'Custom AI avatars',
      'Branded avatar presenters',
      'Website welcome videos',
      'Product and service explainers',
      'Educational videos',
      'Social media video content',
      'Scripted avatar video production',
    ],
    cta: 'Discuss Your Avatar Project',
  },
];

export default function ServicesPage() {
  const heroRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(listRef);

  return (
    <>
      <main className="pt-20">
        {/* Hero */}
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              What We Offer
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              Two services. Built properly.
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              Fifth Ave AI creates custom websites and AI avatar video
              experiences. Every project is scoped, designed, and delivered
              around a specific business goal.
            </p>
            <div className="gold-rule mt-10" data-reveal />
          </div>
        </section>

        {/* Services */}
        <section ref={listRef} className="bg-dark-2 px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl space-y-10">
            {SERVICES.map((s) => (
              <article
                key={s.id}
                id={s.id}
                data-reveal
                className="glass-card rounded-xl p-10 md:p-14"
              >
                <p className="text-[11px] uppercase tracking-[0.35em] text-gold/60">
                  {s.kicker}
                </p>
                <h2 className="font-display mt-4 text-3xl text-white md:text-4xl">
                  {s.title}
                </h2>

                <div className="mt-8 grid gap-10 md:grid-cols-2">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                      What it is
                    </h3>
                    <p className="mt-3 leading-relaxed text-white/65">{s.what}</p>

                    <h3 className="mt-8 text-xs uppercase tracking-[0.25em] text-gold">
                      Who it&apos;s for
                    </h3>
                    <p className="mt-3 leading-relaxed text-white/65">{s.who}</p>

                    <h3 className="mt-8 text-xs uppercase tracking-[0.25em] text-gold">
                      Pricing
                    </h3>
                    <p className="mt-3 text-white/65">
                      Custom quote based on project scope.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                      What we can deliver
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-sm text-white/60">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    {/* Space reserved for real project examples as they become available */}
                  </div>
                </div>

                <div className="mt-10">
                  <Link
                    href="/contact"
                    className="inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
                  >
                    {s.cta}
                  </Link>
                </div>
              </article>
            ))}

            <div data-reveal className="pt-6 text-center">
              <p className="text-white/50">
                Not sure which one fits? Tell us what you&apos;re trying to do.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-block rounded-full border border-gold/40 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
