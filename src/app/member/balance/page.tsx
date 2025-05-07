'use client'

import { useEffect, useState } from "react"

export default function Balance() {
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // update to get PIN from auth context
        const response = await fetch('/api/balance/1234');
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (e) {
        console.log('error fetching balance', e);
      }
    }
    fetchData();
  }, []);


  return (
    <h2>Balance: ${balance}</h2>
  );
}