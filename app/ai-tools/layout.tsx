import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tools & Demos',
  description:
    'AI tools and demonstrations built by Fifth Ave AI: email automation, listing intelligence, and AI avatar video production.',
};

export default function AIToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
