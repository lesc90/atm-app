'use client'
import { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from "@/utils/formatCurrency";
import Button from "./Button";
import Input from "./Input";

type ManageFundsFormProps = {
  action: 'deposit' | 'withdraw';
};

const ManageFundsForm = ({ action }: ManageFundsFormProps) => {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user, updateUser } = useAuth();
  const displayAction = action.charAt(0).toUpperCase() + action.slice(1);

  const handleInputChange = () => {
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    const form = e.currentTarget;
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
    setSuccessMessage(`${action === 'deposit' ? 'Deposit' : 'Withdrawal'} of ${formatCurrency(amount)} successful`);
    setIsLoading(false);
    form.reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="amount" className="mb-1">
          Amount to {action}
        </label>
        <Input
          type="number"
          id="amount"
          name="amount"
          min="0.01"
          step="0.01"
          required
          onChange={handleInputChange}
        />
        <Button variant="primary" disabled={isLoading}>{isLoading ? 'Loading...' : displayAction}</Button>
      </form>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {successMessage && (
        <p className="text-green-700 text-sm mt-2">
          {successMessage}
        </p>
      )}
      <p className="mt-3">
        { `Account Balance: ${formatCurrency((user?.balance ?? 0) || currentBalance)}` }
      </p>
    </>
  );
}

export default ManageFundsForm;