'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const TOOLS = [
  {
    title: 'AI Email Assistant',
    desc: 'Automated responses that sound completely human. Handles inquiries, qualifies leads, and follows up — 24/7 with 2-5 minute response times.',
    tags: ['Live', '24/7 Automated', 'Human-like Tone'],
    cta: { label: 'Learn More', href: '/services' },
  },
  {
    title: 'Listing Intelligence',
    desc: 'Every listing analyzed, priced, and positioned with data your competitors never see. Built for real estate professionals who want a market edge.',
    tags: ['Live', 'Real Estate', 'Data Analysis'],
    cta: { label: 'See How It Works', href: '/work' },
  },
  {
    title: 'AI Avatar Video',
    desc: 'Hyper-realistic AI avatars that deliver your brand message on camera. Scroll-stopping video ads created and delivered in 24-48 hours.',
    tags: ['Live', 'Video Production', 'Marketing'],
    cta: { label: 'View Examples', href: '/work' },
  },
  {
    title: 'Content Engine',
    desc: 'Turn one shoot into a month of on-brand content across 7 platforms. AI creates, schedules, and posts automatically.',
    tags: ['Live', 'Social Media', 'Automation'],
    cta: { label: 'Explore Plans', href: '/services' },
  },
  {
    title: 'Node Banana Customization',
    desc: 'Custom AI node configurations tailored to your workflow. We build and integrate bespoke automation pipelines that fit your exact business processes.',
    tags: ['Custom Build', 'Workflow', 'Integration'],
    cta: { label: 'Get a Quote', href: '/contact' },
  },
  {
    title: 'AI Chatbot Integration',
    desc: 'Intelligent chatbots embedded in your website that answer questions, book appointments, and capture leads while you sleep.',
    tags: ['Live', 'Website', 'Lead Capture'],
    cta: { label: 'See Pricing', href: '/services' },
  },
];

const COMING_SOON = [
  {
    title: 'Voice AI Agent',
    desc: 'AI-powered phone agents that handle calls, book appointments, and answer FAQs in your brand voice.',
  },
  {
    title: 'AI Document Processing',
    desc: 'Extract, classify, and route information from contracts, invoices, and forms automatically.',
  },
  {
    title: 'Predictive Analytics Dashboard',
    desc: 'Real-time business intelligence that forecasts trends and surfaces opportunities before your competitors see them.',
  },
];

export default function AIToolsPage() {
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLElement>(null);
  const comingRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(gridRef);
  useFadeUp(comingRef);

  return (
    <>
      <main className="pt-20">
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Our Technology
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              AI Tools That Work <span className="text-gold-gradient">While You Sleep</span>
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              Production-grade AI systems built for real businesses. Each tool is
              designed, trained, and integrated to solve a specific problem — not
              a generic demo.
            </p>
            <div className="gold-rule mt-10" data-reveal />
          </div>
        </section>

        <section ref={gridRef} className="bg-dark-2 px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => (
                <article
                  key={tool.title}
                  data-reveal
                  data-reveal-group="tool-cards"
                  className="glass-card group flex flex-col rounded-xl p-8"
                >
                  <h2 className="font-display text-xl text-white transition-colors group-hover:text-gold">
                    {tool.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                    {tool.desc}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
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
                    className="mt-6 block rounded-full border border-gold/40 py-2.5 text-center text-[12px] uppercase tracking-[0.15em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
                  >
                    {tool.cta.label}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section ref={comingRef} className="bg-dark px-6 py-28 md:py-40">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-center text-xs uppercase tracking-[0.35em] text-gold">
              In Development
            </p>
            <h2 data-reveal className="font-display mt-4 text-center text-4xl text-white md:text-5xl">
              Coming Soon
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {COMING_SOON.map((item) => (
                <div
                  key={item.title}
                  data-reveal
                  data-reveal-group="coming-soon"
                  className="glass-card rounded-xl p-8 text-center"
                >
                  <h3 className="font-display text-xl text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{item.desc}</p>
                  <span className="mt-4 inline-block rounded-full border border-white/10 px-4 py-1 text-[10px] uppercase tracking-widest text-white/30">
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>
            <div data-reveal className="mt-16 text-center">
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
