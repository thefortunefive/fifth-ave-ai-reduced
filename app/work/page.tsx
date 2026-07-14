'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const PROJECTS = [
  {
    title: 'AI Avatar Assistants',
    problem: 'Businesses lose leads after hours when no one is available to respond.',
    solution: 'Digital team members that greet, qualify, and convert — on camera, in your brand voice, around the clock.',
    tags: ['AI Avatars', 'Lead Conversion', 'Brand Voice'],
    status: 'Active',
  },
  {
    title: 'AI Email Automation',
    problem: 'Manual email responses create delays and inconsistent customer experiences.',
    solution: '24/7 automated email responses that sound completely human, with 2-5 minute response times.',
    tags: ['Email AI', 'Automation', '24/7 Response'],
    status: 'Active',
  },
  {
    title: 'Listing Intelligence',
    problem: 'Real estate professionals lack time to analyze every listing opportunity.',
    solution: 'Every listing analyzed, priced, and positioned with data your competitors never see.',
    tags: ['Real Estate', 'Data Analysis', 'Market Intelligence'],
    status: 'Active',
  },
  {
    title: 'Content Systems',
    problem: 'Creating consistent, on-brand content across platforms is time-consuming and expensive.',
    solution: 'A content engine that turns one shoot into a month of on-brand output, automatically.',
    tags: ['Content AI', 'Social Media', 'Automation'],
    status: 'Active',
  },
  {
    title: 'AI Video Production',
    problem: 'Traditional video production is slow and expensive for ongoing marketing needs.',
    solution: 'Scroll-stopping video ads with hyper-realistic AI avatars, delivered in 24-48 hours.',
    tags: ['AI Video', 'Avatars', 'Marketing'],
    status: 'Active',
  },
  {
    title: 'Business Workflow Automation',
    problem: 'Teams waste hours on repetitive tasks that could be automated.',
    solution: 'Custom AI workflows designed around your specific operations, eliminating busywork and freeing your team.',
    tags: ['Workflow', 'Custom AI', 'Integration'],
    status: 'Active',
  },
];

export default function WorkPage() {
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(gridRef);

  return (
    <>
      <main className="pt-20">
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Our Work
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              Proof, not promises.
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              Real solutions we&apos;ve built for real businesses. Each project
              started with a specific problem and ended with measurable results.
            </p>
            <div className="gold-rule mt-10" data-reveal />
          </div>
        </section>

        <section ref={gridRef} className="bg-dark-2 px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2">
              {PROJECTS.map((p) => (
                <article
                  key={p.title}
                  data-reveal
                  data-reveal-group="work-cards"
                  className="glass-card group rounded-xl p-8"
                >
                  <div className="flex items-start justify-between">
                    <h2 className="font-display text-xl text-white transition-colors group-hover:text-gold">
                      {p.title}
                    </h2>
                    <span className="shrink-0 rounded-full border border-gold/30 px-3 py-0.5 text-[10px] uppercase tracking-widest text-gold/70">
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-widest text-white/30">Problem</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{p.problem}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-widest text-white/30">Solution</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{p.solution}</p>
                  </div>

                  {/* Placeholder for screenshots/demo */}
                  <div className="mt-5 flex h-32 items-center justify-center rounded-lg bg-dark">
                    <span className="text-[10px] uppercase tracking-widest text-white/15">
                      Demo / Screenshot
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gold/20 px-3 py-1 text-[10px] uppercase tracking-widest text-gold/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div data-reveal className="mt-16 text-center">
              <p className="text-white/50">
                Ready to see what AI can do for your business?
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
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
