'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useFadeUp } from '@/lib/animations';
import { scrollToId } from '@/lib/lenis';
import { DIRECTORY_MENU } from '@/lib/nav';

const IC = 'h-[18px] w-[18px] shrink-0';
const icons: Record<string, JSX.Element> = {
  '/services': (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  ),
  '/ai-tools': (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="15" r="1" fill="currentColor" />
    </svg>
  ),
  '/about': (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  ),
  '/contact': (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 5 9-5" />
    </svg>
  ),
};

export default function WebDesignMenu() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToId(id);
  };

  const rowClasses =
    'group flex min-h-[50px] items-center gap-3.5 rounded-[6px] px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a46a]';
  const rowStyle = {
    border: '1px solid rgba(201,164,106,0.38)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.25))',
  };

  return (
    <section
      ref={ref}
      id="web-design"
      aria-label="Site directory"
      className="relative flex justify-center px-5 pb-28 pt-10 md:px-6 md:pb-36"
      style={{
        background:
          'linear-gradient(180deg, #0A0A0A 0%, #0c0b09 12%, #0c0b09 100%), repeating-linear-gradient(90deg, #0b0b0b 0px, #0b0b0b 7px, #0e0d0c 7px, #0e0d0c 14px)',
      }}
    >
      {/* ===== Brass outer frame ===== */}
      <div
        data-reveal
        className="relative w-full max-w-[440px] rounded-[12px] p-[5px]"
        style={{
          background:
            'linear-gradient(150deg, #6e5433 0%, #e4ce9c 22%, #b98f4f 44%, #6b5231 62%, #d9b789 82%, #7a5d38 100%)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.5)',
        }}
      >
        {/* dark recess between brass and inner gold line */}
        <div className="rounded-[9px] bg-[#0a0908] p-[3px]">
          {/* thin gold inner line + dark panel field */}
          <div
            className="rounded-[7px] px-6 py-8 md:px-9 md:py-10"
            style={{
              border: '1px solid rgba(201,164,106,0.55)',
              background:
                'radial-gradient(120% 80% at 50% 0%, #1e1b13 0%, #17150f 55%, #121009 100%)',
              boxShadow: 'inset 0 1px 0 rgba(228,206,156,0.10), inset 0 0 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* ===== Crest ===== */}
            <div
              aria-hidden
              className="mx-auto h-[152px] w-[135px]"
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
            />

            {/* ===== Header ===== */}
            {/* DIRECTORY is promoted to the headline (gold gradient) so the
                header stays visually balanced without the floor designation. */}
            <div className="mt-5">
              <h2
                className="font-display text-[2.4rem] font-semibold leading-[0.95] tracking-[0.1em]"
                style={{
                  background: 'linear-gradient(180deg, #f0dcae 0%, #d0aa6d 55%, #b48f4f 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                DIRECTORY
              </h2>
              <p className="font-display mt-2 text-[0.95rem] tracking-[0.06em] text-[#c9a46a]">
                AI Solutions &amp; Services
              </p>
            </div>

            {/* ===== Directory rows ===== */}
            {/* Four rows (was five) — slightly larger row height + gap keeps
                the card's vertical presence balanced under the crest. */}
            <ul className="mt-7 space-y-[9px]">
              {DIRECTORY_MENU.map((item) => {
                const isAnchor = item.href.startsWith('/#');
                const icon = icons[item.href] ?? icons['/services'];

                const inner = (
                  <>
                    <span className="text-[#c9a46a] transition-colors duration-300 group-hover:text-[#f0dcae]">
                      {icon}
                    </span>
                    <span className="font-display flex-1 text-[0.98rem] tracking-[0.03em] text-[#e3ddce] transition-colors duration-300 group-hover:text-[#f4ecda]">
                      {item.label}
                    </span>
                    <span
                      aria-hidden
                      className="text-[#c9a46a] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </>
                );

                return (
                  <li key={item.href} data-reveal data-reveal-group="directory-rows">
                    {isAnchor ? (
                      <a
                        href={item.href}
                        onClick={(e) => handleAnchorClick(e, item.href.slice(2))}
                        className={rowClasses}
                        style={rowStyle}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={item.href} className={rowClasses} style={rowStyle}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* ===== Footer ===== */}
            <p className="mt-7 text-center text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[#c9a46a]">
              Design. Build. Elevate.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        a.group:hover,
        :global(a.group:hover) {
          background: linear-gradient(180deg, rgba(201, 164, 106, 0.14), rgba(201, 164, 106, 0.06)) !important;
          border-color: rgba(201, 164, 106, 0.85) !important;
        }
      `}</style>
    </section>
  );
}
