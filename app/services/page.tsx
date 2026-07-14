'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

const SERVICES = [
  {
    title: 'AI Email Assistant',
    body: '24/7 automated email responses that sound completely human. Never miss another inquiry.',
    tags: ['24/7 Automated', 'Human-like Tone', '2-5 Min Response'],
  },
  {
    title: 'AI Avatar Video Ads',
    body: 'Scroll-stopping video ads with hyper-realistic AI avatars. Perfect for social media, landing pages, and campaigns.',
    tags: ['Hyper-realistic Avatars', 'Social Optimized', '24-48hr Turnaround'],
  },
  {
    title: 'AI-Powered Websites',
    body: 'Professional website design with AI chatbot integration, mobile-responsive layouts, and built-in SEO.',
    tags: ['AI Chatbot', 'Mobile-First', 'SEO Optimized'],
  },
  {
    title: 'Social Media Management',
    body: 'Consistent content across 7 platforms with zero manual effort. AI creates, schedules, and posts automatically.',
    tags: ['7 Platforms', 'AI Content Creation', 'Performance Reports'],
  },
  {
    title: 'Business Automation',
    body: 'Custom AI workflows that eliminate repetitive tasks and free your team to focus on high-value work.',
    tags: ['Workflow Design', 'Custom Integration', 'Ongoing Support'],
  },
  {
    title: 'AI Consulting',
    body: 'Strategic guidance on where and how AI can drive the most impact in your specific business.',
    tags: ['Discovery Call', 'AI Audit', 'Roadmap'],
  },
];

/* Owner review: confirm all pricing is current */
const PLANS = [
  {
    name: 'Starter',
    price: '$497',
    setup: '$3,000',
    features: [
      '2 AI Avatar Videos/month',
      '200 Emails automated/month',
      '2 Social Platforms',
      '10 Posts/week',
      'Email support',
      'Monthly reports',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '$997',
    setup: '$5,000',
    features: [
      '5 AI Avatar Videos/month',
      '500 Emails automated/month',
      '4 Social Platforms',
      '20 Posts/week',
      '24/7 Priority Support',
      'Advanced Analytics',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$1,997',
    setup: '$10,000',
    features: [
      '10 AI Avatar Videos/month',
      '1,500 Emails automated/month',
      'All 7 Platforms',
      '35 Posts/week',
      'Dedicated Manager',
      'Custom Integrations',
    ],
    popular: false,
  },
];

const WEB_TIERS = [
  {
    name: 'Gold',
    price: '$2,500',
    features: ['5-7 pages', 'Mobile-responsive', 'AI chatbot', 'Contact forms', 'SEO optimization', '1 year hosting'],
  },
  {
    name: 'Platinum',
    price: '$5,000',
    features: ['8-12 pages', 'Custom design', 'AI chatbot', 'Blog integration', 'Advanced features', '1 year hosting'],
  },
  {
    name: 'Diamond',
    price: '$10,000',
    features: ['Up to 50 products', 'Shopping cart', 'Payment processing', 'AI chatbot', 'Order tracking', '1 year hosting'],
  },
];

const FAQ = [
  {
    q: 'How quickly can I expect results from AI marketing?',
    a: 'Most clients see measurable improvements within the first 30 days. Email automation and social media management show immediate efficiency gains, while broader marketing results typically compound over 60-90 days.',
  },
  {
    q: 'What makes your AI Avatar Videos different?',
    a: 'Our avatars are hyper-realistic and customized to your brand voice and style. Unlike generic stock video, each avatar ad is tailored to your audience and optimized for the platform it will run on.',
  },
  {
    q: 'Do I need technical knowledge to use your services?',
    a: 'Not at all. We handle all the technical setup, configuration, and maintenance. You get the results without needing to understand the technology behind them.',
  },
  {
    q: 'Can I upgrade or downgrade my package later?',
    a: 'Absolutely. We design our packages to grow with you. You can adjust your plan at any time based on your evolving needs.',
  },
  {
    q: "What's included in the setup fee?",
    a: 'The setup fee covers initial configuration of all AI tools, integration with your existing systems, custom avatar creation, brand voice calibration, team training, and your first month of content creation.',
  },
  {
    q: 'What kind of support do you provide?',
    a: 'Every plan includes support. Starter plans get email support, Professional plans get 24/7 priority support, and Enterprise clients get a dedicated account manager plus weekly strategy reviews.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={ref}
      className="group border-b border-white/10 py-5"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-white transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
        <span className="pr-4 text-sm md:text-base">{q}</span>
        <span className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{a}</p>
    </details>
  );
}

export default function ServicesPage() {
  const heroRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const webRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);
  useFadeUp(pricingRef);
  useFadeUp(webRef);
  useFadeUp(faqRef);

  return (
    <>
      <main className="pt-20">
        {/* Hero */}
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              What We Offer
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              AI-Powered Solutions
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-white/60">
              Comprehensive AI-driven services designed to transform your
              business and accelerate growth.
            </p>
            <div className="gold-rule mt-10" data-reveal />

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <article
                  key={s.title}
                  data-reveal
                  data-reveal-group="service-cards"
                  className="glass-card group rounded-xl p-8"
                >
                  <h2 className="font-display text-xl text-white transition-colors group-hover:text-gold">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{s.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gold/20 px-3 py-1 text-[11px] uppercase tracking-widest text-gold/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section ref={pricingRef} className="bg-dark-2 px-6 py-28 md:py-40">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-center text-xs uppercase tracking-[0.35em] text-gold">
              Investment
            </p>
            <h2 data-reveal className="font-display mt-4 text-center text-4xl text-white md:text-5xl">
              Pricing Plans
            </h2>
            <p data-reveal className="mx-auto mt-4 max-w-xl text-center text-white/50">
              All plans include setup and ongoing AI automation. Choose the
              package that fits your business needs.
            </p>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  data-reveal
                  data-reveal-group="pricing-cards"
                  className={`glass-card relative rounded-xl p-8 ${
                    plan.popular ? 'ring-1 ring-gold/60' : ''
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-dark">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-2xl text-white">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="font-display text-4xl text-gold">{plan.price}</span>
                    <span className="text-sm text-white/40">/month</span>
                  </p>
                  <p className="mt-1 text-xs text-white/40">Setup: {plan.setup}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="mt-0.5 text-gold">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`mt-8 block rounded-full py-3 text-center text-sm font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gold text-dark hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]'
                        : 'border border-gold/40 text-gold hover:bg-gold hover:text-dark'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Website Packages */}
        <section ref={webRef} className="bg-dark px-6 py-28 md:py-40">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-center text-xs uppercase tracking-[0.35em] text-gold">
              Website Solutions
            </p>
            <h2 data-reveal className="font-display mt-4 text-center text-4xl text-white md:text-5xl">
              AI-Powered Websites
            </h2>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {WEB_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  data-reveal
                  data-reveal-group="web-tiers"
                  className="glass-card rounded-xl p-8"
                >
                  <h3 className="font-display text-2xl text-white">{tier.name}</h3>
                  <p className="font-display mt-3 text-4xl text-gold">{tier.price}</p>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="mt-0.5 text-gold">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="mt-8 block rounded-full border border-gold/40 py-3 text-center text-sm font-medium uppercase tracking-[0.15em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
                  >
                    Get Quote
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef} className="bg-dark-2 px-6 py-28 md:py-40">
          <div className="mx-auto max-w-3xl">
            <p data-reveal className="text-center text-xs uppercase tracking-[0.35em] text-gold">
              Common Questions
            </p>
            <h2 data-reveal className="font-display mt-4 text-center text-4xl text-white md:text-5xl">
              FAQ
            </h2>
            <div data-reveal className="mt-12">
              {FAQ.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
            <div data-reveal className="mt-14 text-center">
              <p className="text-white/50">Still have questions?</p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
