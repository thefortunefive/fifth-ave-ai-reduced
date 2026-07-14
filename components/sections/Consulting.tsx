'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';

const FEATURES = [
  {
    title: 'Dedicated AI Strategist',
    body: 'Work directly with a senior consultant who becomes an extension of your leadership team.',
  },
  {
    title: 'Full Business Transformation',
    body: 'Comprehensive workflow overhaul, custom AI solutions, and implementation support across your organization.',
  },
  {
    title: 'Measurable Results',
    body: 'Strategic improvements designed to deliver significant returns on your investment.',
  },
];

const INCLUDES = [
  'Complete workflow audit & redesign',
  'Custom AI tool development',
  'Team training & onboarding',
  'Ongoing strategic support',
  'Direct access to leadership',
];

export default function Consulting() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="consulting" className="relative bg-dark px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
            Executive Program &middot; Limited Availability
          </p>
          <h2 data-reveal className="font-display mt-4 text-4xl text-white md:text-5xl">
            1-on-1 AI Consulting
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-2xl text-white/60">
            For business leaders ready to make a transformational investment. Our
            elite consulting program provides hands-on, personalized AI
            integration strategies designed to transform your entire operation.
          </p>
        </div>

        <div className="gold-rule mt-12" data-reveal />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              data-reveal
              data-reveal-group="consulting-features"
              className="glass-card rounded-xl p-8"
            >
              <h3 className="font-display text-xl text-white">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{f.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-12 md:grid-cols-2">
          <div data-reveal>
            <h3 className="font-display text-2xl text-white">Premium Partnership</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              This is not a course or a template. It&apos;s a high-touch,
              white-glove engagement for serious business owners ready to invest
              in transformational growth.
            </p>
            <ul className="mt-6 space-y-3">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="mt-0.5 text-gold">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="glass-card rounded-xl p-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Investment Starting At
            </p>
            {/* Owner review: confirm current pricing */}
            <p className="font-display mt-3 text-5xl text-gold">$25,000+</p>
            <p className="mt-2 text-sm text-white/50">
              Tailored to your business scope
            </p>
            <div className="gold-rule my-6" />
            <p className="text-xs text-white/40">
              We take 3 clients per quarter. Limited availability &middot; By
              application only.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
            >
              Inquire About Availability
            </Link>
          </div>
        </div>

        {/* Testimonial */}
        <blockquote data-reveal className="mx-auto mt-20 max-w-3xl text-center">
          <p className="font-display text-xl leading-relaxed text-white/80 md:text-2xl">
            &ldquo;Fifth Ave AI transformed our marketing strategy with
            innovative AI solutions. Their expertise helped our small business
            thrive in a competitive market.&rdquo;
          </p>
          <footer className="mt-6">
            <cite className="not-italic">
              <span className="text-sm font-medium text-gold">Vance C.</span>
              <span className="ml-2 text-sm text-white/40">
                CEO, QCS Renovations
              </span>
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
