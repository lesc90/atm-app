import { promises as fs } from 'fs';
import path from 'path';
export const dynamic = 'force-static'

export async function GET(req: Request, { params }: { params: { accountId: string } }) {
  const { accountId } = await params;
  if (!accountId) {
    return new Response(JSON.stringify({ error: 'Account ID is required' }), { status: 400 });
  }

  try {
    const res = await fetch('http://localhost:3000/data.json');
    const data = await res.json();
    const entry = data.find((entry: { accountId: string }) => entry.accountId === accountId);

    if (!entry) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }
    return Response.json({ user: entry });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch data from file' }, { status: 500 })
  }
}


export async function POST(req: Request, { params }: { params: { accountId: string } }) {
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