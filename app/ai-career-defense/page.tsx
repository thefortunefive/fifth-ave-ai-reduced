'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const PILLARS = [
  {
    title: 'AI Fluency Training',
    body: 'Learn the tools, terminology, and workflows that hiring managers expect. Move from curious to competent.',
  },
  {
    title: 'Workflow Automation Skills',
    body: 'Build real automation projects you can demo in interviews. Show employers you can save them time and money.',
  },
  {
    title: 'Personal Brand with AI',
    body: 'Use AI to create content, build authority, and position yourself as the candidate who gets it.',
  },
  {
    title: 'Career Strategy',
    body: 'Identify roles where AI skills command a premium. Position yourself for the jobs that are growing, not shrinking.',
  },
];

const FAQ = [
  {
    q: 'Who is AI Career Defense for?',
    a: 'Professionals in any industry who want to future-proof their career. Whether you are in marketing, operations, sales, finance, or management — AI fluency is becoming a baseline expectation.',
  },
  {
    q: 'Do I need a technical background?',
    a: 'No. We focus on practical AI skills that business professionals can apply immediately. No coding required.',
  },
  {
    q: 'How is this different from an online course?',
    a: 'This is not a passive video library. It is a hands-on program with real projects, personalized strategy, and direct access to people who build AI systems for a living.',
  },
];

export default function AICareerDefensePage() {
  const heroRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(pillarsRef);
  useFadeUp(faqRef);

  return (
    <>
      <main className="pt-20">
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Future-Proof Your Career
            </p>
            <h1 data-reveal className="font-display mt-4 max-w-4xl text-4xl text-white md:text-6xl">
              AI Career Defense
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              AI is not coming for your job — but someone who knows AI might.
              Learn the tools, build the skills, and position yourself as the
              person companies cannot afford to lose.
            </p>
            <div data-reveal className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
              >
                Apply Now
              </Link>
              <Link
                href="/services"
                className="inline-block rounded-full border border-gold/40 px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
              >
                See All Services
              </Link>
            </div>
          </div>
        </section>

        <section ref={pillarsRef} className="bg-dark-2 px-6 py-28 md:py-40">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-center text-xs uppercase tracking-[0.35em] text-gold">
              The Program
            </p>
            <h2 data-reveal className="font-display mt-4 text-center text-4xl text-white md:text-5xl">
              Four Pillars of AI Career Defense
            </h2>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((p, i) => (
                <div
                  key={p.title}
                  data-reveal
                  data-reveal-group="pillars"
                  className="glass-card rounded-xl p-8"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-dark text-sm text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-display mt-5 text-xl text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={faqRef} className="bg-dark px-6 py-28 md:py-40">
          <div className="mx-auto max-w-3xl">
            <p data-reveal className="text-center text-xs uppercase tracking-[0.35em] text-gold">
              Questions
            </p>
            <h2 data-reveal className="font-display mt-4 text-center text-4xl text-white md:text-5xl">
              FAQ
            </h2>
            <div data-reveal className="mt-12 space-y-0">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-white/10 py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-white transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
                    <span className="pr-4 text-sm md:text-base">{item.q}</span>
                    <span className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{item.a}</p>
                </details>
              ))}
            </div>
            <div data-reveal className="mt-16 text-center">
              <p className="font-display text-2xl text-white">Ready to future-proof your career?</p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
              >
                Start the Conversation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
