'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to tasks page by default
    router.push('/dashboard/tasks');
  }, [router]);

  return null;
}