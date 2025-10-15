import argon2 from 'argon2';
import { cookies } from 'next/headers';
import ENV from '@/lib/env';

export async function POST(req: Request) {
  const body = await req.json();
  const awaitedCookie = await cookies();

  if (body.password !== ENV.ORDER_MODE_PASSWORD) {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }

  const hash = await argon2.hash(body.password);

  awaitedCookie.set('token', hash, {
    httpOnly: true,
    secure: true,
    path: '/',
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
