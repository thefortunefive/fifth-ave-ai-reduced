'use client';

// Portfolio & Demos — reduced launch. Route stays /ai-tools to avoid breaking
// existing links; all visible naming is "Portfolio & Demos".
// Only real, verifiable work is shown. No invented projects, no Coming Soon.

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

export default function PortfolioDemosPage() {
  const heroRef = useRef<HTMLElement>(null);
  const webRef = useRef<HTMLElement>(null);
  const avatarRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(webRef);
  useFadeUp(avatarRef);

  return (
    <>
      <main className="pt-20">
        {/* Hero */}
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Our Work
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              Portfolio &amp; Demos
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              Real work you can experience directly — websites, interactive
              experiences, and AI avatar video.
            </p>
            <div className="gold-rule mt-10" data-reveal />
          </div>
        </section>

        {/* Category 1: Website Projects and Interactive Experiences */}
        <section ref={webRef} className="bg-dark-2 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.3em] text-gold/70">
              Category 01
            </p>
            <h2 data-reveal className="font-display mt-3 text-3xl text-white md:text-4xl">
              Website Projects and Interactive Experiences
            </h2>

            <article data-reveal className="glass-card mt-10 rounded-xl p-10 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold/60">
                Live project
              </p>
              <h3 className="font-display mt-3 text-2xl text-white md:text-3xl">
                The Fifth Ave AI Website
              </h3>
              <p className="mt-4 max-w-3xl leading-relaxed text-white/65">
                You&apos;re experiencing it right now. This site is our own
                production build: a scroll-controlled cinematic hero with a
                living cloud loop, a custom directory interface, frame-accurate
                video scrubbing tuned separately for desktop and mobile, and a
                fully responsive black-and-gold design system — designed,
                built, and deployed by Fifth Ave AI.
              </p>
              <ul className="mt-6 grid max-w-3xl gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  'Scroll-driven cinematic video hero',
                  'Seamless idle cloud loop',
                  'Mobile-tuned video scrubbing',
                  'Interactive directory navigation',
                  'Responsive desktop and mobile layouts',
                  'Static production deployment',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/55">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="mt-8 inline-block rounded-full border border-gold/40 px-7 py-2.5 text-[12px] uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
              >
                Revisit the Experience
              </Link>
            </article>
          </div>
        </section>

        {/* Category 2: AI Avatar and Video Demos */}
        <section ref={avatarRef} className="bg-dark px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.3em] text-gold/70">
              Category 02
            </p>
            <h2 data-reveal className="font-display mt-3 text-3xl text-white md:text-4xl">
              AI Avatar and Video Demos
            </h2>

            <div data-reveal className="glass-card mt-10 rounded-xl p-10 md:p-12">
              <p className="max-w-3xl leading-relaxed text-white/65">
                We produce custom AI presenters and branded avatar video —
                welcome videos, explainers, educational content, and social
                media pieces. Avatar demos are shared directly during project
                conversations so we can show work that matches your industry
                and use case.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
              >
                Request an Avatar Demo
              </Link>
            </div>

            <div data-reveal className="mt-16 text-center">
              <p className="text-white/50">Have a project in mind?</p>
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
