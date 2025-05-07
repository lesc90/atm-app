'use client'
import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext';

const BalanceView = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    async function fetchBalance() {
      const res = await fetch(`/api/balance/${user?.accountId}`);
      const data = await res.json();
      setBalance(data.user.balance);
      updateUser({ balance: data.user.balance });
    }
    fetchBalance();
  }, [user, updateUser]);


  return (
    <h2>Account Balance: ${balance}</h2>
  );
}

export { BalanceView };