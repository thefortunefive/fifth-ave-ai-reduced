'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { scrollToId } from '@/lib/lenis';
import { TOP_NAV } from '@/lib/nav';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToId(href.slice(1));
      setOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-[70] transition-all duration-500 ${
          scrolled
            ? 'bg-dark/90 backdrop-blur-md shadow-[0_1px_0_rgba(215,183,90,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="h-8 w-7"
              style={{
                WebkitMaskImage: 'url(/crest.png)',
                maskImage: 'url(/crest.png)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                background:
                  'linear-gradient(165deg, #f0dcae 0%, #d9b789 38%, #c9a46a 60%, #9c7b45 100%)',
              }}
              aria-hidden
            />
            <span className="font-display text-lg tracking-tight text-white transition-colors group-hover:text-gold">
              Fifth Ave AI
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {TOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`text-[13px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  pathname === item.href
                    ? 'text-gold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full border border-gold/40 px-5 py-2 text-[12px] uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span
              className={`block h-px w-5 bg-white transition-all duration-300 ${
                open ? 'translate-y-[6px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-px w-5 bg-white transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-px w-5 bg-white transition-all duration-300 ${
                open ? '-translate-y-[6px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[65] bg-dark/98 backdrop-blur-xl transition-all duration-500 md:hidden ${
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {TOP_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                handleClick(e, item.href);
                setOpen(false);
              }}
              className={`font-display text-3xl tracking-tight transition-colors ${
                pathname === item.href ? 'text-gold' : 'text-white hover:text-gold'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
          >
            Get Started
          </Link>
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-white/30">
            (425) 316-7268
          </p>
        </div>
      </div>
    </>
  );
}
