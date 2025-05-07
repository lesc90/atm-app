'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    const pin = formData.get('pin')?.toString() || '';
    const pinValidation = /^\d+$/
    if (!pinValidation.test(pin)) {
      setError('PIN must only include numbers.')
      return
    }
    const res = await fetch('api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ pin })
    })
    const data = await res.json();

    if (res.ok) {
      login({ accountId: data.accountId, name: data.name, balance: data.balance });
      router.push('/member')
    }
    setError('')
  }

  return (
    <div className="login">
      <h1>Welcome</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pin">
          Enter PIN
        </label>
        <input
          name="pin"
          id="pin"
          type="password"
          inputMode="numeric"
          maxLength={4}
          className="border-1 border-solid rounded-sm"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="cursor-pointer">
          Submit
        </button>
      </form>
    </div>
  );
}
