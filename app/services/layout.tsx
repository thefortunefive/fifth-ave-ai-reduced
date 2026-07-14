import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'AI-powered solutions: email automation, avatar video ads, website design, social media management, and business consulting. Pricing and packages.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
