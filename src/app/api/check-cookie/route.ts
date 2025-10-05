import ENV from '@/lib/env';
import { cookies } from 'next/headers';
import argon2 from 'argon2';

export async function GET() {
  const cookieStore = await cookies();
  const headers = {
    'Content-Type': 'text/plain',
  };

  const invalidTokenResponse = new Response('Invalid token', {
    status: 401,
    headers,
  });

  if (!cookieStore.get('token')) {
    return invalidTokenResponse;
  }

  const token = cookieStore.get('token');

  if (token === undefined) {
    return invalidTokenResponse;
  }

  if (!(await argon2.verify(token.value, ENV.ORDER_MODE_PASSWORD))) {
    return invalidTokenResponse;
  }

  return new Response('OK', {
    status: 200,
    headers,
  });
}
