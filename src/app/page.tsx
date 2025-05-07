'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import Input from "@/components/Input";

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
      setError('')
    } else {
      setError(data.error || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="login max-w-lg mx-auto mt-5 p-3">
      <h1>Welcome</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="pin">
          Enter PIN
        </label>
        <Input
          name="pin"
          id="pin"
          type="password"
          inputMode="numeric"
          maxLength={4}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button variant="primary" className="mt-2">Submit</Button>
      </form>
    </div>
  );
}
