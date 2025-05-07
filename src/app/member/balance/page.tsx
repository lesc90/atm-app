'use client'

import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext';

export default function Balance() {
  const [balance, setBalance] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('user', user)
    async function fetchData() {
      try {
        const response = await fetch(`/api/balance/${user?.accountId}`);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        setBalance(data.user.balance);
      } catch (e) {
        console.log('Error fetching balance', e);
      }
    }
    fetchData();
  }, [user]);


  return (
    <h2>Balance: ${balance}</h2>
  );
}