'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) {
      router.push('/');
    }
  }, [isAuthed, router]);

  if (!isAuthed) return null;

  return (
    <div>{children}</div>
  )
}