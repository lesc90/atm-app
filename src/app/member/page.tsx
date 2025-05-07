'use client'
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BalanceView } from '@/components/BalanceView';
import { ManageFundsForm } from '@/components/ManageFundsForm';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function Welcome() {
  const router = useRouter();
  const { user } = useAuth();
  const [view, setView] = useState<'balance' | 'deposit' | 'withdraw' | null>(null);

  return (
    <div className="max-w-lg mx-auto mt-5 p-3">
      <h1>Welcome {user?.name}</h1>

      <nav className="flex gap-2">
        <Button onClick={() => setView('balance')} variant="secondary">View Balance</Button>
        <Button onClick={() => setView('deposit')} variant="secondary">Deposit Funds</Button>
        <Button onClick={() => setView('withdraw')} variant="secondary">Withdraw Funds</Button>
        <Button onClick={() => router.push('/')} variant="secondary">Log Out</Button>
      </nav>

      <div className="mt-4">
        {view === 'balance' && <BalanceView />}
        {view === 'deposit' && <ManageFundsForm action="deposit" />}
        {view === 'withdraw' && <ManageFundsForm action="withdraw" />}
      </div>
    </div>
  );
}