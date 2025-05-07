export const dynamic = 'force-static'

export async function GET(req: Request, { params }: { params: { accountId: string } }) {
  console.log('in GET Req')
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
    const { amount, type } = await req.json();
    if (typeof amount !== 'number' || !['deposit', 'withdrawal'].includes(type)) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const res = await fetch('http://localhost:3000/data.json');
    const data = await res.json();

    const entry = data.find((entry: { accountId: string }) => entry.accountId === accountId);

    if (!entry) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    if (type === 'withdrawal' && entry.balance < amount) {
      return Response.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    const updatedBalance = type === 'deposit'
      ? entry.balance + amount
      : entry.balance - amount;

    // Simulated update (not persisted) -- update to fs write
    entry.balance = updatedBalance;

    return Response.json({ balance: updatedBalance });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}