'use client';

// Portfolio & Demos — LinkedIn-facing portfolio. Route stays /ai-tools.
// Category 1: real website work (this site). Category 2: AI Avatars &
// Advertising with three real YouTube demos. No autoplay, no invented stats.

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const AVATAR_VIDEOS = [
  {
    id: 'RIwE1G70tk0',
    title: 'AI Avatar Brand Introduction',
    description:
      'A branded AI presenter example created to introduce a company, service, or professional message through a polished avatar-led video.',
    demonstrates:
      'Custom avatar production, scripting, visual presentation, editing, captions, and branded communication.',
  },
  {
    id: '5O9651teeiA',
    title: 'Avatar Marketing: Real Estate Example',
    description:
      'A real estate example showing how an AI avatar can present services, explain an offer, promote properties, and create branded marketing content.',
    supporting:
      'The same approach can be adapted for healthcare, legal services, retail, hospitality, education, professional services, e-commerce, and other industries.',
    demonstrates:
      'Industry-specific avatar marketing, promotional storytelling, branded presentation, and adaptable campaign production.',
  },
  {
    id: '_HU8wX9XFJo',
    title: 'AI Avatar Advertising Demo',
    description:
      'An example of using a custom AI avatar to deliver concise branded advertising and promotional content for digital campaigns.',
    demonstrates:
      'Advertising concepts, scripting, avatar performance, visual overlays, editing, and short-form campaign production.',
  },
];

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
              My Work
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              Portfolio &amp; Demos
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              Real work you can experience directly — websites, interactive
              experiences, and AI avatar advertising.
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
                You&apos;re experiencing it right now. This site is my own
                production build: a scroll-controlled cinematic hero with a
                living cloud loop, a custom directory interface, frame-accurate
                video scrubbing tuned separately for desktop and mobile, and a
                fully responsive black-and-gold design system — designed,
                built, and deployed end to end.
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

        {/* Category 2: AI Avatars & Advertising */}
        <section ref={avatarRef} id="avatar-work" className="bg-dark px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.3em] text-gold/70">
              Category 02
            </p>
            <h2 data-reveal className="font-display mt-3 text-3xl text-white md:text-4xl">
              AI Avatars &amp; Advertising
            </h2>
            <p data-reveal className="mt-4 max-w-2xl leading-relaxed text-white/60">
              Custom AI presenters and branded avatar videos for advertising,
              promotion, education, and company communication.
            </p>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {AVATAR_VIDEOS.map((v) => (
                <article
                  key={v.id}
                  data-reveal
                  data-reveal-group="avatar-videos"
                  className="glass-card flex flex-col overflow-hidden rounded-xl"
                >
                  {/* Responsive 16:9 embed — no autoplay */}
                  <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-xl text-white">{v.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      {v.description}
                    </p>
                    {v.supporting && (
                      <p className="mt-3 text-sm leading-relaxed text-white/45">
                        {v.supporting}
                      </p>
                    )}
                    <p className="mt-4 border-t border-white/10 pt-4 text-[13px] leading-relaxed text-white/45">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-gold/60">
                        Demonstrates
                      </span>
                      <br />
                      {v.demonstrates}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div data-reveal className="mt-16 text-center">
              <p className="text-white/50">
                Interested in this kind of work for your company?
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-block rounded-full border border-gold/40 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
              >
                Discuss a Role or Project
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
