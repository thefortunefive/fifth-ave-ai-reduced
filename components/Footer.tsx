import Link from 'next/link';
import { TOP_NAV } from '@/lib/nav';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
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
            <span className="font-display text-lg tracking-tight text-white">
              Fifth Ave AI
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
            Custom websites and AI avatar video experiences for businesses.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-3">
            {TOP_NAV.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/50 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/50">
            <li>
              <a href="tel:+14253167268" className="transition-colors hover:text-gold">
                (425) 316-7268
              </a>
            </li>
            <li>
              <a href="mailto:hello@fifthaveai.com" className="transition-colors hover:text-gold">
                hello@fifthaveai.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl border-t border-white/5 pt-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/25">
          &copy; {new Date().getFullYear()} Fifth Ave AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
