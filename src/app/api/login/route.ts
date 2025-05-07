export async function POST(req: Request) {
  const { pin } = await req.json();

  if (!pin) {
    return new Response(JSON.stringify({ error: 'PIN is required' }), { status: 400 });
  }

  const res = await fetch('http://localhost:3000/data.json');
  const data = await res.json();

  const user = data.find((entry: { pin: string }) => entry.pin === pin);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid PIN' }), { status: 401 });
  };

  const { accountId, name, balance } = user;
  return new Response(JSON.stringify({ accountId, name, balance }), { status: 200 });
}