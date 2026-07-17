import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio & Demos',
  description:
    'Real work from Fifth Ave AI: website projects, interactive experiences, and AI avatar video demos.',
};

export default function PortfolioDemosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
