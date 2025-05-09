'use client'
import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatCurrency';

const BalanceView = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    async function fetchBalance() {
      if (!user?.accountId) return;

      const res = await fetch(`/api/balance/${user?.accountId}`);
      const data = await res.json();
      const latestBalance = data.user.balance;
      setBalance(latestBalance);
      if (latestBalance !== user.balance) {
        updateUser({ balance: latestBalance });
      }
    }
    fetchBalance();
  }, [user]);

  return (
    <h2>Account Balance: {balance ? formatCurrency(balance) : '...'}</h2>
  );
}

export default BalanceView;