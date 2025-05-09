import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { accountId: string } }) {
  const { accountId } = await params;

  if (!accountId) {
    return new Response(JSON.stringify({ error: 'Account ID is required' }), { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    const entry = data.find((entry: { accountId: string }) => entry.accountId === accountId);

    if (!entry) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }
    return Response.json({ user: entry });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch data from file' }, { status: 500 });
  }
}


export async function POST(req: Request, { params }: { params: { accountId: string } }) {
  const DAILY_WITHDRAW_LIMIT = 1000;
  const { accountId } = await params;
  if (!accountId) {
    return Response.json({ error: 'Account ID is required' }, { status: 400 });
  }

  try {
    const { amount, action } = await req.json();
    if (typeof amount !== 'number' || !['deposit', 'withdraw'].includes(action)) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    const entryIndex = data.findIndex((entry: { accountId: string }) => entry.accountId === accountId);

    if (entryIndex === -1) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    const entry = data[entryIndex];

    if (action === 'withdraw' && entry.balance < amount) {
      return Response.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    if (action === 'withdraw') {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      const todayWithdrawals = entry.withdrawals?.filter((w: { amount: number; timestamp: string }) => {
        return w.timestamp.startsWith(today);
      }) || [];

      const totalToday = todayWithdrawals.reduce((sum: number, w: { amount: number; timestamp: string }) => sum + w.amount, 0);

      if (totalToday + amount > DAILY_WITHDRAW_LIMIT) {
        return Response.json(
          { error: `Daily withdrawal limit of $${DAILY_WITHDRAW_LIMIT} exceeded` },
          { status: 400 }
        );
      }

      const newWithdrawal = {
        amount,
        timestamp: new Date().toISOString()
      };

      entry.withdrawals = [...todayWithdrawals, newWithdrawal];
    }

    entry.balance = action === 'deposit'
      ? entry.balance + amount
      : entry.balance - amount;

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return Response.json({ balance: entry.balance });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}