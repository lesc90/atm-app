import fs from 'fs';
import { POST } from '@/app/api/login/route';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockAccounts = [
  { pin: '1234', accountId: 'abc123', name: 'Sam', balance: 1000 },
  { pin: '5678', accountId: 'xyz456', name: 'Lee', balance: 500 },
];

describe('POST /api/login', () => {
  beforeEach(() => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockAccounts));
  });

  it('returns 400 if pin is missing', async () => {
    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    (req as Request & { json: () => Promise<Partial<{ pin: string }>> }).json = async () => ({});

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/pin is required/i);
  });

  it('returns 401 if pin is invalid', async () => {
    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ pin: '0000' }),
      headers: { 'Content-Type': 'application/json' },
    });

    (req as Request & { json: () => Promise<{pin: string}> }).json = async () => ({ pin: '0000' });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toMatch(/invalid pin/i);
  });

  it('returns 200 and user data if pin is valid', async () => {
    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ pin: '1234' }),
      headers: { 'Content-Type': 'application/json' },
    });

    (req as Request & { json: () => Promise<{pin: string}> }).json = async () => ({ pin: '1234' });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      accountId: 'abc123',
      name: 'Sam',
      balance: 1000,
    });
  });
});