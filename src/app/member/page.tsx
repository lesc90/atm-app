'use client'
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BalanceView } from '@/components/BalanceView';
import { ManageFundsForm } from '@/components/ManageFundsForm';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();
  const { user } = useAuth();
  const [view, setView] = useState<'balance' | 'deposit' | 'withdraw' | null>(null);

  return (
    <>
      <h1>Welcome {user?.name}</h1>

      <nav className="flex gap-4">
        <button onClick={() => setView('balance')}>View Balance</button>
        <button onClick={() => setView('deposit')}>Deposit Funds</button>
        <button onClick={() => setView('withdraw')}>Withdraw Funds</button>
        <button onClick={() => router.push('/')}>Log Out</button>
      </nav>

      <div className="mt-4">
        {view === 'balance' && <BalanceView />}
        {view === 'deposit' && <ManageFundsForm action="deposit" />}
        {view === 'withdraw' && <ManageFundsForm action="withdraw" />}
      </div>
    </>
  );
}