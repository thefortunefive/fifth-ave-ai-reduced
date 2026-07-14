import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Career Defense',
  description:
    'Future-proof your career with AI fluency training, workflow automation skills, and career strategy from Fifth Ave AI.',
};

export default function AICareerDefenseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
