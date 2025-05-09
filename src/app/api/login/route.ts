import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { pin } = await req.json();

  if (!pin) {
    return new Response(JSON.stringify({ error: 'PIN is required' }), { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContents);

  const user = data.find((entry: { pin: string }) => entry.pin === pin);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid PIN' }), { status: 401 });
  };

  const { accountId, name, balance } = user;
  return new Response(JSON.stringify({ accountId, name, balance }), { status: 200 });
}