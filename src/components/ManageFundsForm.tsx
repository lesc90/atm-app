'use client'
import { useState } from "react"
import { useAuth } from '@/context/AuthContext';

type ManageFundsFormProps = {
  action: 'deposit' | 'withdraw';
};

const ManageFundsForm = ({ action }: ManageFundsFormProps) => {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const { user, updateUser } = useAuth();
  const displayAction = action.charAt(0).toUpperCase() + action.slice(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const accountId = user?.accountId;
    const amountStr = new FormData(form).get('amount')?.toString();
    const amount = amountStr ? parseFloat(amountStr) : 0;

    const res = await fetch(`/api/balance/${accountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, action }),
    });

    const data = await res.json();
    setCurrentBalance(data.balance);
    updateUser({ balance: data.balance });
    form.reset()
  }

  return (
    <>
      <h1>{displayAction} funds</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount"></label>
        <input
          type="number"
          id="amount"
          name="amount"
          min="0.01"
          step="0.01"
          required
          className="border-1 border-solid rounded-sm" />
        <button type="submit">{displayAction}</button>
      </form>
      <p>Account Balance: {currentBalance || user?.balance}</p>
    </>
  );
}

export { ManageFundsForm };