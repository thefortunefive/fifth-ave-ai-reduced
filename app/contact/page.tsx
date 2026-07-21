'use client';

import { useRef, useState } from 'react';
import Script from 'next/script';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        params: Record<string, unknown>,
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const INQUIRY_TYPES = [
  'Hiring or Employment Opportunity',
  'Custom Website Project',
  'AI Avatar Advertising Project',
  'Collaboration',
  'Other / Not Sure',
] as const;

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const FIELD =
  'mt-2 w-full rounded-lg border border-white/10 bg-dark px-4 py-3 text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30';
const LABEL = 'block text-xs uppercase tracking-[0.2em] text-white/50';

export default function ContactPage() {
  const heroRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);

  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [tsToken, setTsToken]     = useState('');

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef  = useRef<string | null>(null);
  const statusRef    = useRef<HTMLDivElement>(null);

  const isSubmitting = formState === 'submitting';

  const resetWidget = () => {
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
    setTsToken('');
  };

  const initTurnstile = () => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey || !turnstileRef.current || !window.turnstile) return;
    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: siteKey,
      callback:           (token: unknown) => setTsToken(token as string),
      'expired-callback': () => setTsToken(''),
      'error-callback':   () => setTsToken(''),
      action: 'contact_form',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    setFormState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:           data.get('name'),
          email:          data.get('email'),
          inquiryType:    data.get('inquiryType'),
          message:        data.get('message'),
          turnstileToken: tsToken,
          company:        data.get('company'),
        }),
      });

      const json = (await res.json()) as { success: boolean; message: string };

      if (res.ok && json.success) {
        setFormState('success');
        form.reset();
        resetWidget();
      } else {
        setErrorMsg(json.message || 'Please check the form and try again.');
        setFormState('error');
        resetWidget();
      }
    } catch {
      setErrorMsg('Your message could not be sent right now. Please try again shortly.');
      setFormState('error');
      resetWidget();
    }

    // Move focus to status region so screen readers announce the outcome
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  return (
    <>
      {/* Turnstile — explicit render mode so we control the mount point */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={initTurnstile}
      />

      <main className="pt-20">
        {/* ── Hero ── */}
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Get in Touch
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              Let&apos;s talk.
            </h1>
            <p data-reveal className="mt-6 max-w-xl text-lg text-white/60">
              Contact me about a role, collaboration, or project involving
              custom websites, AI avatars, branded video, or digital
              experiences.
            </p>
          </div>
        </section>

        {/* ── Form + Contact info ── */}
        <section className="bg-dark-2 px-6 py-20 md:py-32">
          <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1fr]">

            {/* Left — form */}
            <div>
              <h2 className="font-display text-2xl text-white">Let&apos;s Connect</h2>

              {/* Status region — always in DOM for aria-live to work */}
              <div
                ref={statusRef}
                aria-live="polite"
                aria-atomic="true"
                tabIndex={-1}
                className="outline-none"
              >
                {formState === 'success' && (
                  <div role="status" className="mt-8 glass-card rounded-xl p-8 text-center">
                    <p className="font-display text-2xl text-gold">Message sent.</p>
                    <p className="mt-4 text-white/60">
                      Your message has been sent. I&apos;ll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="mt-6 text-sm text-white/40 transition-colors hover:text-gold"
                    >
                      Send another message
                    </button>
                  </div>
                )}
                {formState === 'error' && (
                  <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-400"
                  >
                    {errorMsg}
                  </p>
                )}
              </div>

              {formState !== 'success' && (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                  aria-busy={isSubmitting}
                  noValidate
                >
                  {/* Honeypot — visually hidden, traps automated bots */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      width: '1px',
                      height: '1px',
                      overflow: 'hidden',
                    }}
                  >
                    <label htmlFor="company">Website field — leave blank</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className={LABEL}>Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                      className={FIELD}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={LABEL}>Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      className={FIELD}
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiryType" className={LABEL}>Inquiry Type</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      required
                      defaultValue={INQUIRY_TYPES[0]}
                      className={`${FIELD} appearance-none`}
                    >
                      {INQUIRY_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-dark text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={LABEL}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={5}
                      className={`${FIELD} resize-none`}
                      placeholder="Tell me about the role, project, or collaboration."
                    />
                  </div>

                  {/* Turnstile widget container */}
                  <div ref={turnstileRef} />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-gold py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Sending…' : 'Send Details'}
                  </button>
                </form>
              )}
            </div>

            {/* Right — contact info (unchanged) */}
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-8">
                <h3 className="font-display text-xl text-white">Email</h3>
                <a
                  href="mailto:shane@fifthaveai.com"
                  className="mt-3 block text-gold transition-colors hover:text-[#f0dcae]"
                >
                  shane@fifthaveai.com
                </a>
              </div>

              <div className="glass-card rounded-xl p-8">
                <h3 className="font-display text-xl text-white">Phone</h3>
                <a
                  href="tel:+14253167268"
                  className="mt-3 block font-display text-2xl text-gold transition-colors hover:text-[#f0dcae]"
                >
                  (425) 316-7268
                </a>
              </div>

              <div className="glass-card rounded-xl p-8">
                <h3 className="font-display text-xl text-white">Location</h3>
                <p className="mt-3 text-white/60">Kirkland, Washington</p>
                <p className="mt-2 text-sm text-white/40">
                  Open to remote, hybrid, and selected on-site opportunities.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
