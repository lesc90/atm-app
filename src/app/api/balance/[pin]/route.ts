export const dynamic = 'force-static'

export async function GET(req: Request, { params }: { params: { pin: string } }) {
  const { pin } = params;

  if (!pin) {
    return new Response(JSON.stringify({ error: 'PIN is required' }), { status: 400 });
  }

  try {

    const res = await fetch('http://localhost:3000/data.json');
    const data = await res.json();

    const entry = data.find((entry: { pin: string }) => entry.pin === pin);

    if (!entry) {
      return Response.json({ error: 'No data found for the provided PIN' }, { status: 404 });
    }
    return Response.json({ balance: entry.balance });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch data from file' }, { status: 500 })
  }

}