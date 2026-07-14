'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const VALUES = [
  {
    title: 'Innovation',
    body: 'We push boundaries to deliver cutting-edge AI solutions that keep our clients ahead of the competition.',
  },
  {
    title: 'Partnership',
    body: 'We work alongside our clients as true partners, invested in their success and growth at every step.',
  },
  {
    title: 'Excellence',
    body: 'We are committed to delivering exceptional quality in everything we do, from strategy to execution.',
  },
];

const LOCATIONS = [
  { city: 'Seattle, WA', desc: 'AI innovation in the Pacific Northwest tech hub.' },
  { city: 'Atlanta, GA', desc: 'Serving the booming business capital of the Southeast.' },
  { city: 'New York, NY', desc: 'Our reach extends to the heart of the business world.' },
  { city: 'Philadelphia, PA', desc: 'Serving the thriving business community of the Delaware Valley.' },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const locationsRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(storyRef);
  useFadeUp(valuesRef);
  useFadeUp(locationsRef);

  return (
    <>
      <main className="pt-20">
        {/* Hero */}
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              About Fifth Ave AI
            </p>
            <h1 data-reveal className="font-display mt-4 max-w-3xl text-4xl text-white md:text-6xl">
              Built by a filmmaker.
              <br />
              Run like a studio.
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              We specialize in AI solutions that transform how businesses
              operate — making cutting-edge technology accessible to companies
              of all sizes.
            </p>
          </div>
        </section>

        {/* Story */}
        <section ref={storyRef} className="bg-dark-2 px-6 py-28 md:py-40">
          <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[400px_1fr]">
            {/* Portrait placeholder */}
            <div data-reveal className="justify-self-center md:justify-self-start">
              {/* TODO: replace with real portrait at public/shane-portrait.jpg */}
              <div className="glass-card flex h-[500px] w-full max-w-[400px] items-center justify-center rounded-xl md:w-[400px]">
                <span className="text-xs uppercase tracking-widest text-white/25">
                  Portrait 400&times;500
                </span>
              </div>
            </div>

            <div>
              <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
                Our Story
              </p>
              <h2 data-reveal className="font-display mt-4 text-4xl text-white md:text-5xl">
                Building the Future
              </h2>
              <p data-reveal className="mt-6 leading-relaxed text-white/60">
                Shane spent a decade telling stories for premium brands before
                turning the camera on business itself. Fifth Ave AI pairs that
                cinematic instinct with production-grade AI systems — so the
                technology doesn&apos;t just work, it performs.
              </p>
              <p data-reveal className="mt-4 leading-relaxed text-white/60">
                What started as a consultancy serving a handful of businesses in
                the Pacific Northwest has grown into an AI solutions provider
                serving clients across Seattle, Atlanta, New York, and
                Philadelphia. We believe every business deserves access to the
                same powerful AI tools that enterprise companies use.
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
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section ref={valuesRef} className="bg-dark px-6 py-28 md:py-40">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-center text-xs uppercase tracking-[0.35em] text-gold">
              What Drives Us
            </p>
            <h2 data-reveal className="font-display mt-4 text-center text-4xl text-white md:text-5xl">
              Core Values
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  data-reveal
                  data-reveal-group="values"
                  className="glass-card rounded-xl p-8 text-center"
                >
                  <h3 className="font-display text-2xl text-gold">{v.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations */}
        <section ref={locationsRef} className="bg-dark-2 px-6 py-28 md:py-40">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-center text-xs uppercase tracking-[0.35em] text-gold">
              Where We Operate
            </p>
            <h2 data-reveal className="font-display mt-4 text-center text-4xl text-white md:text-5xl">
              Our Locations
            </h2>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc.city}
                  data-reveal
                  data-reveal-group="locations"
                  className="glass-card rounded-xl p-6 text-center"
                >
                  <h3 className="font-display text-xl text-white">{loc.city}</h3>
                  <p className="mt-2 text-sm text-white/50">{loc.desc}</p>
                </div>
              ))}
            </div>
            <div data-reveal className="mt-16 text-center">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
