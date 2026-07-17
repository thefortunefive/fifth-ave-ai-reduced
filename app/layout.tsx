import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import CinematicOverlays from '@/components/CinematicOverlays';
import Navbar from '@/components/Navbar';

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
  title: {
    default: 'Fifth Ave AI — Where Business Meets Intelligence',
    template: '%s | Fifth Ave AI',
  } as Metadata['title'],
  description:
    'Custom websites and AI avatar video experiences for businesses that want to communicate clearly and present themselves professionally.',
  metadataBase: new URL('https://fifthaveai.com'),
  openGraph: {
    title: 'Fifth Ave AI — Where Business Meets Intelligence',
    description:
      'Custom websites and AI avatar video experiences for businesses.',
    url: 'https://fifthaveai.com',
    siteName: 'Fifth Ave AI',
    type: 'website',
  },
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
          <Navbar />
          <ScrollProgressBar />
          {children}
          <CinematicOverlays />
        </SmoothScroll>
      </body>
    </html>
  );
}
