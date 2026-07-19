'use client';

// Portfolio & Demos — LinkedIn-facing portfolio. Route stays /ai-tools.
// Category 1: real website work. Category 2: AI Avatars & Advertising with
// three stacked editorial rows, portrait-friendly embed sizing.

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const AVATAR_VIDEOS = [
  {
    id: '50MgpHl38n8',
    title: 'Portfolio Overview',
    iframeTitle: 'Portfolio Overview video',
    description:
      'An overview of the creative and technical work behind Fifth Ave AI, including custom websites, AI avatars, branded video, generative AI, and digital experience development.',
    demonstrates:
      'Creative direction, web design and development, AI production, visual storytelling, prompt engineering, editing, deployment, and complete project execution.',
  },
  {
    id: '3ei472Ym8vU',
    title: 'Avatar Assistant Demo',
    iframeTitle: 'Avatar Assistant Demo video',
    description:
      'A demonstration of an AI avatar assistant designed to introduce information, guide website visitors, explain services, and support branded customer communication.',
    demonstrates:
      'Avatar creation, conversational presentation, website integration, scripting, branded communication, and interactive customer experience design.',
  },
  {
    id: 'fy9i82qJ27s',
    title: 'Custom Content Creation Demo',
    iframeTitle: 'Custom Content Creation Demo video',
    description:
      'A real estate example showing how custom AI-assisted content can be created for a specific company, offer, or industry.',
    supporting:
      'Real estate is the first industry example, but the same content-production approach can be adapted for professional services, healthcare, legal services, hospitality, retail, education, e-commerce, and other industries.',
    demonstrates:
      'Content strategy, AI avatar production, scripting, branded visuals, editing, promotional storytelling, and industry-specific content creation.',
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

            {/* Stacked editorial project rows */}
            <div className="mt-14 space-y-16 md:space-y-24">
              {AVATAR_VIDEOS.map((v, i) => (
                <article
                  key={v.id}
                  data-reveal
                  className="glass-card overflow-hidden rounded-xl"
                >
                  {/*
                    Desktop: video + copy side by side, alternating sides.
                    Mobile: video first, then copy below.
                  */}
                  <div
                    className={`flex flex-col md:flex-row md:items-stretch${
                      i % 2 === 1 ? ' md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Portrait-friendly video column — narrower than copy column */}
                    <div className="w-full md:w-[42%] shrink-0">
                      {/*
                        Portrait embed container: 9:16 ratio on mobile,
                        fill the column height on desktop via a fixed-ratio
                        box that keeps the player portrait without cropping.
                      */}
                      <div
                        className="relative w-full bg-black"
                        style={{ aspectRatio: '9 / 16' }}
                      >
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                          title={v.iframeTitle}
                          loading="lazy"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                          className="absolute inset-0 h-full w-full border-0"
                        />
                      </div>
                    </div>

                    {/* Copy column */}
                    <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-gold/60">
                        {`0${i + 1}`}
                      </p>
                      <h3 className="font-display mt-3 text-2xl text-white md:text-3xl">
                        {v.title}
                      </h3>
                      <p className="mt-4 leading-relaxed text-white/65">
                        {v.description}
                      </p>
                      {v.supporting && (
                        <p className="mt-3 leading-relaxed text-white/45 text-sm">
                          {v.supporting}
                        </p>
                      )}
                      <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/45">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-gold/60">
                          Demonstrates
                        </span>
                        <br />
                        {v.demonstrates}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div data-reveal className="mt-20 text-center">
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
