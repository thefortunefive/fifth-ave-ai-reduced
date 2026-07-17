'use client';

// Reduced-launch About: minimal, factual, no portrait, no founder storytelling.

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const approachRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(approachRef);

  return (
    <>
      <main className="pt-20">
        {/* Hero */}
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Who We Are
            </p>
            <h1 data-reveal className="font-display mt-4 max-w-3xl text-4xl text-white md:text-6xl">
              About Fifth Ave AI
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              Fifth Ave AI creates custom websites and AI avatar video
              experiences for businesses that want to communicate clearly and
              present themselves professionally.
            </p>
            <p data-reveal className="mt-4 max-w-2xl leading-relaxed text-white/60">
              We combine design, storytelling, and current AI technology to
              build practical digital experiences around a specific business
              goal.
            </p>
          </div>
        </section>

        {/* Approach */}
        <section ref={approachRef} className="bg-dark-2 px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Our Approach
            </p>
            <h2 data-reveal className="font-display mt-4 text-3xl text-white md:text-4xl">
              Purpose first.
            </h2>
            <p data-reveal className="mt-6 max-w-2xl leading-relaxed text-white/60">
              Every project begins with a clear purpose. We focus on useful
              design, direct communication, and technology that supports the
              work instead of complicating it.
            </p>
            <div data-reveal className="mt-12">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
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
