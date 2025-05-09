import { NextRequest } from 'next/server';
import { POST } from '@/app/api/balance/[accountId]/route';
import fs from 'fs';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const today = new Date().toISOString();
const mockAccounts = [
  {
    accountId: '1234abc',
    name: 'Sam',
    balance: 1000,
    withdrawals: [
      { amount: 500, timestamp: today },
      { amount: 500, timestamp: today }
    ],
  },
  {
    accountId: '5678abc',
    name: 'Lee',
    balance: 500,
    withdrawals: [
      { amount: 100, timestamp: today },
      { amount: 200, timestamp: today }
    ],
  }
];

describe('POST /api/balance/[accountId]', () => {
  beforeEach(() => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockAccounts));
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
  });

  it('should deposit funds into a valid account', async () => {
    const body = { amount: 250, action: 'deposit' };

    const req = new NextRequest('http://localhost/api/balance/1234abc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    (req as NextRequest).json = async () => body;

    const res = await POST(req, { params: { accountId: '1234abc' } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.balance).toBe(1250); // 1000 + 250
  });

  it('should withdraw funds from a valid account if daily limit has not been reached', async () => {
    const body = { amount: 250, action: 'withdraw' };

    const req = new NextRequest('http://localhost/api/balance/5678abc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    (req as NextRequest).json = async () => body;

    const res = await POST(req, { params: { accountId: '5678abc' } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.balance).toBe(250); // 500 - 250
  });

  it('should prevent withdrawal if funds are insufficient', async () => {
    const body = { amount: 10000, action: 'withdraw' };
    const req = new NextRequest('http://localhost/api/balance/1234abc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    (req as NextRequest).json = async () => body;

    const res = await POST(req, { params: { accountId: '1234abc' } });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/insufficient/i);
  });

  it('should prevent withdrawal if daily limit has been reached', async () => {
    const body = { amount: 100, action: 'withdraw' };

    const req = new NextRequest('http://localhost/api/balance/1234abc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    (req as NextRequest).json = async () => body;

    const res = await POST(req, { params: { accountId: '1234abc' } });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/daily.*limit/i);
  });

  it('returns 404 if account is not found', async () => {
    const body = { amount: 100, action: 'deposit' };
    const req = new NextRequest('http://localhost/api/balance/9999', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    (req as NextRequest).json = async () => body;

    const res = await POST(req, { params: { accountId: '9999' } });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toMatch(/not found/i);
  });

  it('returns 400 if body is invalid - amount is not a number', async () => {
    const body = { amount: 'not-a-number', action: 'deposit' };
    const req = new NextRequest('http://localhost/api/balance/1234abc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    (req as NextRequest).json = async () => body;

    const res = await POST(req, { params: { accountId: '1234abc' } });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/invalid/i);
  });

  it('returns 400 if body is invalid - action is not deposit or withdraw', async () => {
    const body = { amount: 800, action: 'foo' };
    const req = new NextRequest('http://localhost/api/balance/1234abc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    (req as NextRequest).json = async () => body;

    const res = await POST(req, { params: { accountId: '1234abc' } });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/invalid/i);
  });
});