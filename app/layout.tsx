import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import CinematicOverlays from '@/components/CinematicOverlays';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fifth Ave AI — Where Business Meets Intelligence',
  description:
    'We don’t just talk about AI. We build it into your business — and it works while you sleep. AI avatar assistants, listing intelligence, and content systems for premium brands.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-dark font-body text-white antialiased">
        <SmoothScroll>
          <ScrollProgressBar />
          {children}
          <CinematicOverlays />
        </SmoothScroll>
      </body>
    </html>
  );
}
