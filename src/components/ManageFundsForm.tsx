'use client'
import { useState } from "react"
import { useAuth } from '@/context/AuthContext';
import Button from "./Button";
import Input from "./Input";
import { formatCurrency } from "@/utils/formatCurrency";

type ManageFundsFormProps = {
  action: 'deposit' | 'withdraw';
};

const ManageFundsForm = ({ action }: ManageFundsFormProps) => {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const { user, updateUser } = useAuth();
  const displayAction = action.charAt(0).toUpperCase() + action.slice(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
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

    if (!res.ok) {
      if (data.error?.includes('Daily withdrawal limit')) {
        setError('You can not withdraw more than $1000 per day');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
      setIsLoading(false);
      return;
    }

    setCurrentBalance(data.balance);
    updateUser({ balance: data.balance });
    form.reset()
    setIsLoading(false);
  }

  return (
    <>
      <h2>{displayAction} funds</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="amount"></label>
        <Input
          type="number"
          id="amount"
          name="amount"
          min="0.01"
          step="0.01"
          required
          className="border-1 border-solid rounded-sm" />
        <Button variant="primary" disabled={isLoading}>{isLoading ? 'Loading...' : displayAction}</Button>
      </form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="mt-3">
        Account Balance:{` `}
        { currentBalance !== null
            ? formatCurrency(currentBalance)
            : formatCurrency(user?.balance ?? 0)
        }
      </p>
    </>
  );
}

export { ManageFundsForm };