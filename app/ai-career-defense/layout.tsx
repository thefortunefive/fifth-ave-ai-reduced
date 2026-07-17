import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Career Defense',
  description:
    'Practical guides for understanding AI job risk and positioning your career: free job-risk list, career defense guide, and the 2030 Blueprint.',
};

export default function AICareerDefenseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}