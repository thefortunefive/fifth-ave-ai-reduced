'use client';

import { useRef, useState } from 'react';
import { useFadeUp } from '@/lib/animations';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const heroRef = useRef<HTMLElement>(null);
  useFadeUp(heroRef);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    const subject = encodeURIComponent(`New inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:hello@fifthaveai.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <>
      <main className="pt-20">
        <section ref={heroRef} className="bg-dark px-6 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              Get in Touch
            </p>
            <h1 data-reveal className="font-display mt-4 text-4xl text-white md:text-6xl">
              Let&apos;s talk.
            </h1>
            <p data-reveal className="mt-6 max-w-xl text-lg text-white/60">
              Ready to transform your business? We&apos;d love to hear from you.
              Reach out and let&apos;s start a conversation.
            </p>
          </div>
        </section>

        <section className="bg-dark-2 px-6 py-20 md:py-32">
          <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1fr]">
            {/* Form */}
            <div>
              <h2 className="font-display text-2xl text-white">Send Us a Message</h2>
              {submitted ? (
                <div className="mt-8 glass-card rounded-xl p-8 text-center">
                  <p className="font-display text-2xl text-gold">Thank you!</p>
                  <p className="mt-4 text-white/60">
                    Your email client should have opened with your message. If it
                    didn&apos;t, please email us directly at{' '}
                    <a
                      href="mailto:hello@fifthaveai.com"
                      className="text-gold hover:underline"
                    >
                      hello@fifthaveai.com
                    </a>
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-white/40 hover:text-gold transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs uppercase tracking-[0.2em] text-white/50"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-2 w-full rounded-lg border border-white/10 bg-dark px-4 py-3 text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs uppercase tracking-[0.2em] text-white/50"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full rounded-lg border border-white/10 bg-dark px-4 py-3 text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs uppercase tracking-[0.2em] text-white/50"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-dark px-4 py-3 text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-gold py-4 text-sm font-medium uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,183,90,0.45)]"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-10">
              <div className="glass-card rounded-xl p-8">
                <h3 className="font-display text-xl text-white">Call Us</h3>
                <a
                  href="tel:+14253167268"
                  className="mt-3 block font-display text-2xl text-gold transition-colors hover:text-[#f0dcae]"
                >
                  (425) 316-7268
                </a>
                <p className="mt-2 text-sm text-white/40">Mon-Fri, 9am-6pm PST</p>
              </div>

              <div className="glass-card rounded-xl p-8">
                <h3 className="font-display text-xl text-white">Email</h3>
                <a
                  href="mailto:hello@fifthaveai.com"
                  className="mt-3 block text-gold transition-colors hover:text-[#f0dcae]"
                >
                  hello@fifthaveai.com
                </a>
              </div>

              <div className="glass-card rounded-xl p-8">
                <h3 className="font-display text-xl text-white">Headquarters</h3>
                <p className="mt-3 leading-relaxed text-white/60">
                  11335 NE 122nd Way, Suite 105
                  <br />
                  Kirkland, Washington 98034
                </p>
              </div>

              <div className="glass-card rounded-xl p-8">
                <h3 className="font-display text-xl text-white">
                  Free Consultation
                </h3>
                <p className="mt-3 text-sm text-white/60">
                  Book a free 30-minute call to discuss how AI can transform
                  your business operations.
                </p>
                <a
                  href="mailto:hello@fifthaveai.com?subject=Consultation%20Request"
                  className="mt-5 inline-block rounded-full border border-gold/40 px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-dark"
                >
                  Book a Time Slot
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
