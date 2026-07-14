'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Gold page-scroll progress bar, fixed to the top edge. */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        scrub: 0.3,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-gold/70 via-gold to-[#f4e3ae]"
        style={{ boxShadow: '0 0 12px rgba(215, 183, 90, 0.55)' }}
      />
    </div>
  );
}
