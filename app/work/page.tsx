'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/ai-tools');
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-dark">
      <p className="text-sm text-white/40">Redirecting to Portfolio &amp; Demos…</p>
    </main>
  );
}
