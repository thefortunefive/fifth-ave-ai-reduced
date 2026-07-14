// TODO: cheaper model — CONTACT PAGE (stub)
// Left to do: contact form (use a static-friendly provider — Formspree, Tally,
// or Cloudflare Pages Functions), calendar embed, or mailto flow. Keep the
// brand styling below.

import Link from 'next/link';

export const metadata = {
  title: 'Contact — Fifth Ave AI',
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark px-6 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">Contact</p>
      <h1 className="font-display mt-4 text-4xl text-white md:text-6xl">
        Let&apos;s talk.
      </h1>
      <p className="mt-6 max-w-md text-white/60">
        We take 3 clients per quarter. Tell us where your business leaks time,
        and we&apos;ll tell you what AI can do about it.
      </p>
      <a
        href="mailto:hello@fifthaveai.com"
        className="mt-10 inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
      >
        hello@fifthaveai.com
      </a>
      <Link
        href="/"
        className="mt-12 text-xs uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-gold"
      >
        ← Back to home
      </Link>
    </main>
  );
}
