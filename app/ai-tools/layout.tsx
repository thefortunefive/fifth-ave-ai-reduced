import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tools',
  description:
    'Explore Fifth Ave AI tools: email automation, listing intelligence, AI avatar video, content engines, chatbot integration, and custom workflow automation.',
};

export default function AIToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
