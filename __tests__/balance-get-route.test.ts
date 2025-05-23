import { NextRequest } from 'next/server';
import { GET } from '@/app/api/balance/[accountId]/route';
import fs from 'fs';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

const mockAccounts = [
  { accountId: '1234', name: 'Sam', balance: 1000 },
  { accountId: '5678', name: 'Lee', balance: 500 },
];

describe('GET /api/balance/[accountId]', () => {
  beforeEach(() => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockAccounts));
  });

  it('returns 200 and user balance if account exists', async () => {
    const req = new NextRequest('http://localhost/api/balance/1234');
    // @ts-expect-error - route expects a Promise-wrapped params object
    const res = await GET(req, { params: { accountId: '1234' } });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.name).toBe('Sam');
    expect(data.user.balance).toBe(1000);
  });

  it('returns 404 if account not found', async () => {
    const req = new NextRequest('http://localhost/api/balance/9999');
    // @ts-expect-error - route expects a Promise-wrapped params object
    const res = await GET(req, { params: { accountId: '9999' } });

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toMatch(/not found/i);
  });
});