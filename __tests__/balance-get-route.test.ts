import { GET } from '@/app/api/balance/[accountId]/route';

describe('GET /api/balance/[accountId]', () => {
  beforeEach(() => {
    const mockData = [
      { accountId: '1234', name: 'Sam', balance: 1000 },
      { accountId: '5678', name: 'Lee', balance: 500 },
    ];

    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      json: async () => mockData,
    });
  });

  it('returns 200 and user balance if account exists', async () => {
    const req = new Request('http://localhost/api/balance/1234');
    const res = await GET(req, { params: { accountId: '1234' } });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.name).toBe('Sam');
    expect(data.user.balance).toBe(1000);
  });

  it('returns 404 if account not found', async () => {
    const req = new Request('http://localhost/api/balance/9999');
    const res = await GET(req, { params: { accountId: '9999' } });

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toMatch(/not found/i);
  });
});