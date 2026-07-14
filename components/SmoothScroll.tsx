'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { setLenis } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. All ScrollTriggers in the app rely on this being mounted
 * once at the root.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);
    setLenis(lenis); // expose for scrollToId (see lib/lenis.ts)

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
