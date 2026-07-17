import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Fifth Ave AI creates custom websites and AI avatar video experiences for businesses that want to communicate clearly.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}