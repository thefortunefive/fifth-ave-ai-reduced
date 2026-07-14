'use client';

/**
 * FLOOR 02 — WEB DESIGN directory.
 *
 * A pixel-faithful HTML replica of the gold-framed directory that is painted
 * into the hero elevator video (see the panel at ~t=37s / frame ~120). The
 * in-video panel is canvas pixels and can't hold links; this is the real,
 * interactive version, and it is styled to match the video panel so the hero
 * scrub (which now ends on frame 93 — doors parting, directory not yet shown)
 * hands off to this section with no visible seam.
 *
 * Colors sampled directly from the video frame:
 *   panel dark   #16140F → #1E1B13   (warm near-black)
 *   brass frame  #E4CE9C / #C9A46A / #6E5433
 *   gold text    #C9A46A            row borders / FLOOR 02 / footer
 *   cream text   #E7E1D2            WEB DESIGN / row labels
 *
 * Every row is a real anchor (href to a section) with Lenis smooth-scroll,
 * gold hover tint + lift, >=44px height, keyboard-focusable, mobile reflow.
 *
 * Row → section mapping:
 *   Website Design, Brand Websites, Landing Pages → #proof
 *   UX / UI Design, Prototyping                   → #process
 *   E-Commerce, CMS Development, Maintenance…      → #cta (contact)
 */

import { useRef } from 'react';
import { useFadeUp } from '@/lib/animations';
import { scrollToId } from '@/lib/lenis';

type Service = { label: string; targetId: string; icon: JSX.Element };

const IC = 'h-[18px] w-[18px] shrink-0';
const icons = {
  monitor: (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  pen: (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 20l4-1 9.5-9.5a2 2 0 0 0-3-3L5 16l-1 4z" />
      <path d="M13.5 6.5l3 3" />
    </svg>
  ),
  layout: (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  ),
  cart: (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 4h2l2.4 11.5a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.8L21 8H6" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  ),
  star: (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.9 6.6 19.5l1.2-6L3.4 9.3l6-.7L12 3z" />
    </svg>
  ),
  hex: (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3L12 3z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  ),
  code: (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="4" y="3" width="16" height="18" rx="1.6" />
      <path d="M9 9l-2 2 2 2M15 9l2 2-2 2" />
    </svg>
  ),
  clipboard: (
    <svg className={IC} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="5" y="4" width="14" height="17" rx="1.6" />
      <path d="M9 3h6v3H9zM8 11h8M8 15h6" />
    </svg>
  ),
};

const SERVICES: Service[] = [
  { label: 'Website Design', targetId: 'proof', icon: icons.monitor },
  { label: 'UX / UI Design', targetId: 'process', icon: icons.pen },
  { label: 'Landing Pages', targetId: 'proof', icon: icons.layout },
  { label: 'E-Commerce', targetId: 'cta', icon: icons.cart },
  { label: 'Brand Websites', targetId: 'proof', icon: icons.star },
  { label: 'Prototyping', targetId: 'process', icon: icons.hex },
  { label: 'CMS Development', targetId: 'cta', icon: icons.code },
  { label: 'Maintenance & Support', targetId: 'cta', icon: icons.clipboard },
];

export default function WebDesignMenu() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    scrollToId(targetId);
  };

  return (
    <section
      ref={ref}
      id="web-design"
      aria-label="Floor 02 — Web Design services"
      className="relative flex justify-center px-5 pb-28 pt-10 md:px-6 md:pb-36"
      style={{
        // Matches the dark ribbed elevator wall behind the video panel, and
        // fades in from the hero (frame 93) above so there is no seam line.
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
            {/* ===== Crest (gold, from /crest.png via mask) ===== */}
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

            {/* ===== Header (left-aligned, like the frame) ===== */}
            <div className="mt-5">
              <h2
                className="font-display text-[3rem] font-semibold leading-[0.92] tracking-tight"
                style={{
                  background: 'linear-gradient(180deg, #f0dcae 0%, #d0aa6d 55%, #b48f4f 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                FLOOR 02
              </h2>
              <p className="font-display mt-1 text-[1.6rem] font-medium leading-none tracking-[0.14em] text-[#e7e1d2]">
                WEB DESIGN
              </p>
              <p className="font-display mt-2 text-[0.95rem] tracking-[0.06em] text-[#c9a46a]">
                Digital Architecture
              </p>
            </div>

            {/* ===== Directory rows ===== */}
            <ul className="mt-6 space-y-[7px]">
              {SERVICES.map((s) => (
                <li key={s.label} data-reveal data-reveal-group="floor2-rows">
                  <a
                    href={`#${s.targetId}`}
                    onClick={(e) => handleClick(e, s.targetId)}
                    className="group flex min-h-[46px] items-center gap-3.5 rounded-[6px] px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a46a]"
                    style={{
                      border: '1px solid rgba(201,164,106,0.38)',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.25))',
                    }}
                  >
                    <span className="text-[#c9a46a] transition-colors duration-300 group-hover:text-[#f0dcae]">
                      {s.icon}
                    </span>
                    <span className="font-display flex-1 text-[0.98rem] tracking-[0.03em] text-[#e3ddce] transition-colors duration-300 group-hover:text-[#f4ecda]">
                      {s.label}
                    </span>
                    <span
                      aria-hidden
                      className="text-[#c9a46a] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* ===== Footer ===== */}
            <p className="mt-7 text-center text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[#c9a46a]">
              Design. Build. Elevate.
            </p>
          </div>
        </div>

        {/* row hover tint layer is handled per-row; group hover bg below */}
      </div>

      <style jsx>{`
        a.group:hover {
          background: linear-gradient(180deg, rgba(201, 164, 106, 0.14), rgba(201, 164, 106, 0.06)) !important;
          border-color: rgba(201, 164, 106, 0.85) !important;
        }
      `}</style>
    </section>
  );
}
