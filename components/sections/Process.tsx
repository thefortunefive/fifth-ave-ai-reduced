'use client';

// Reduced-launch: three concise steps with the animated gold connector line.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFadeUp } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: '01',
    title: 'Discuss',
    body: 'We define the audience, goal, required content, and the result the project needs to achieve.',
  },
  {
    n: '02',
    title: 'Build',
    body: 'We design and create the website, avatar, or video experience around the approved direction.',
  },
  {
    n: '03',
    title: 'Launch',
    body: 'We review, refine, and deliver the finished project for real-world use.',
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  useFadeUp(ref);

  // Animated gold line draws across as the section scrolls through.
  useEffect(() => {
    if (!lineRef.current) return;
    const tween = gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.5,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={ref} id="process" className="relative bg-dark-2 px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
          How it works
        </p>
        <h2 data-reveal className="font-display mt-4 text-4xl text-white md:text-5xl">
          Three steps. No fluff.
        </h2>

        <div className="relative mt-16">
          {/* Animated gold line */}
          <div
            ref={lineRef}
            className="absolute left-0 top-6 hidden h-px w-full origin-left bg-gradient-to-r from-gold via-gold/70 to-gold/20 md:block"
          />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step) => (
              <div key={step.n} data-reveal data-reveal-group="process-steps" className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-dark text-sm text-gold">
                  {step.n}
                </div>
                <h3 className="font-display mt-5 text-2xl text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
