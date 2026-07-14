import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'See what Fifth Ave AI has built: AI avatar assistants, email automation, listing intelligence, content systems, and business workflow automation.',
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
