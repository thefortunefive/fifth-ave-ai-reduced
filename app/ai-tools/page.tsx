'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const TOOLS = [
  {
    title: 'AI Email Assistant',
    desc: 'Automated responses that sound completely human. Handles inquiries, qualifies leads, and follows up — 24/7 with 2-5 minute response times.',
    tags: ['24/7 Automated', 'Human-like Tone'],
    status: 'Available' as const,
    cta: { label: 'Learn More', href: '/services' },
    demo: {
      title: 'AI Email Automation',
      problem: 'Manual email responses create delays and inconsistent customer experiences.',
      solution: '24/7 automated email responses that sound completely human, with 2-5 minute response times.',
    },
  },
  {
    title: 'Listing Intelligence',
    desc: 'Every listing analyzed, priced, and positioned with data your competitors never see. Built for real estate professionals who want a market edge.',
    tags: ['Real Estate', 'Data Analysis'],
    status: 'Available' as const,
    cta: { label: 'See How It Works', href: '/contact' },
    demo: {
      title: 'Listing Intelligence',
      problem: 'Real estate professionals lack time to analyze every listing opportunity.',
      solution: 'Every listing analyzed, priced, and positioned with data your competitors never see.',
    },
  },
  {
    title: 'AI Avatar Video',
    desc: 'Hyper-realistic AI avatars that deliver your brand message on camera. Scroll-stopping video ads created and delivered in 24-48 hours.',
    tags: ['Video Production', 'Marketing'],
    status: 'Demo Available' as const,
    cta: { label: 'Get Started', href: '/contact' },
    demo: {
      title: 'AI Avatar Assistants',
      problem: 'Businesses lose leads after hours when no one is available to respond.',
      solution: 'Digital team members that greet, qualify, and convert — on camera, in your brand voice, around the clock.',
    },
  },
];

const MORE_TOOLS = [
  'Content Engine',
  'Node Banana Customization',
  'AI Chatbot Integration',
];

export default function AIToolsPage() {
  const heroRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(toolsRef);
  useFadeUp(moreRef);

  const statusColor = (s: string) => {
    if (s === 'Available') return 'border-green-500/30 text-green-400/70';
    if (s === 'Demo Available') return 'border-gold/30 text-gold/70';
    return 'border-white/10 text-white/30';
  };

  return (
    <>
      <main className="pt-20">
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Our Technology
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              AI Tools &amp; Demos
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              Production-grade AI systems built for real businesses. Each tool is
              designed, trained, and integrated to solve a specific problem — not
              a generic demo.
            </p>
            <div className="gold-rule mt-10" data-reveal />
          </div>
        </section>

        <section ref={toolsRef} className="bg-dark-2 px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl space-y-10">
            {TOOLS.map((tool) => (
              <article
                key={tool.title}
                data-reveal
                className="glass-card rounded-xl p-8 md:p-10"
              >
                <div className="flex flex-col gap-8 md:flex-row md:items-start">
                  {/* Tool info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-2xl text-white">
                        {tool.title}
                      </h2>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-widest ${statusColor(tool.status)}`}
                      >
                        {tool.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      {tool.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-gold/20 px-3 py-1 text-[10px] uppercase tracking-widest text-gold/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={tool.cta.href}
                      className="mt-6 inline-block rounded-full border border-gold/40 px-6 py-2.5 text-[12px] uppercase tracking-[0.15em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
                    >
                      {tool.cta.label}
                    </Link>
                  </div>

                  {/* Demo / Work example */}
                  <div className="flex-1 rounded-lg bg-dark p-6">
                    <p className="text-[10px] uppercase tracking-widest text-gold/50">
                      In Practice
                    </p>
                    <h3 className="font-display mt-2 text-lg text-white">
                      {tool.demo.title}
                    </h3>
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-widest text-white/30">Problem</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/50">{tool.demo.problem}</p>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-widest text-white/30">Solution</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/50">{tool.demo.solution}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section ref={moreRef} className="bg-dark px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 data-reveal className="font-display text-center text-xl text-white/40">
              More Tools in Development
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {MORE_TOOLS.map((name) => (
                <span
                  key={name}
                  data-reveal
                  className="rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-widest text-white/30"
                >
                  {name} — Coming Soon
                </span>
              ))}
            </div>
            <div data-reveal className="mt-14 text-center">
              <p className="text-white/50">
                Want early access to our newest tools?
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
              >
                Get on the List
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
