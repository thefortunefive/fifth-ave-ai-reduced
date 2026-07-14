import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Fifth Ave AI: AI consulting and custom software serving businesses in Seattle, Atlanta, New York, and Philadelphia. Our story, values, and team.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
