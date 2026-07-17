'use client';

// AI Career Defense — separate educational product line (not a client service).
// Only real products are listed. No coaching, consulting, or application
// language. Purchase buttons route through the contact flow until dedicated
// checkout links are provided.

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const PRODUCTS = [
  {
    name: 'AI Job-Risk List',
    price: 'Free',
    body: 'A free resource covering which roles are most exposed to AI — and where the risk actually comes from.',
    cta: 'Get the Free List',
    highlight: false,
  },
  {
    name: 'AI Career Defense Guide',
    price: '$9.99',
    body: 'A practical guide to understanding your exposure and taking the first concrete steps to protect your career.',
    cta: 'Get the Guide',
    highlight: false,
  },
  {
    name: 'AI Career Defense: The 2030 Blueprint',
    price: '$49.99',
    body: 'The complete blueprint: how AI is reshaping work through 2030, and a step-by-step path to positioning yourself on the right side of it.',
    cta: 'Get the Blueprint',
    highlight: true,
  },
];

export default function AICareerDefensePage() {
  const heroRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(productsRef);

  return (
    <>
      <main className="pt-20">
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Educational Products
            </p>
            <h1 data-reveal className="font-display mt-4 max-w-4xl text-4xl text-white md:text-6xl">
              AI Career Defense
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              AI is not coming for your job — but someone who knows AI might.
              Clear, practical guides for understanding the risk and positioning
              your career for what&apos;s ahead.
            </p>
          </div>
        </section>

        <section ref={productsRef} className="bg-dark-2 px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              {PRODUCTS.map((p) => (
                <div
                  key={p.name}
                  data-reveal
                  data-reveal-group="acd-products"
                  className={`glass-card relative flex flex-col rounded-xl p-8 ${
                    p.highlight ? 'ring-1 ring-gold/60' : ''
                  }`}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-dark">
                      Complete Blueprint
                    </span>
                  )}
                  <h2 className="font-display text-xl text-white">{p.name}</h2>
                  <p className="font-display mt-4 text-4xl text-gold">{p.price}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-white/60">
                    {p.body}
                  </p>
                  <Link
                    href="/contact"
                    className={`mt-8 block rounded-full py-3 text-center text-sm font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                      p.highlight
                        ? 'bg-gold text-dark hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]'
                        : 'border border-gold/40 text-gold hover:bg-gold hover:text-dark'
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>

            <p data-reveal className="mx-auto mt-14 max-w-xl text-center text-sm text-white/40">
              Digital products, delivered directly. No subscriptions, no
              upsells — just the information.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
