import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a project with Fifth Ave AI. Tell us whether you need a custom website, an AI avatar, or branded avatar videos.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}