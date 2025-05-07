'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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
    <>
      <nav className="flex gap-4">
        <Link href="/member/balance">View Balance</Link>
        <Link href="/member/withdraw">Withdraw Funds</Link>
        <Link href="/member/deposit">Deposit Funds</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}