'use client'

import { useAuth } from "@/context/AuthContext";

export default function Deposit() {
  const { user } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accountId = user?.accountId;
    const amountStr = new FormData(e.currentTarget).get('amount')?.toString();
    const amount = amountStr ? parseFloat(amountStr) : 0;
    const type = 'deposit';

    const res = await fetch(`/api/balance/${accountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, type }),
    });

    const data = await res.json();
    console.log('Updated balance:', data.balance);
  }
  return (
    <>
      <h1>Deposit funds</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount"></label>
        <input type="number" id="amount" name="amount" min="0.01" step="0.01" required></input>
        <button type="submit">Deposit</button>
      </form>
    </>
  );
}