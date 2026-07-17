import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Custom AI websites and AI avatar video production from Fifth Ave AI. Custom quotes based on project scope.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}