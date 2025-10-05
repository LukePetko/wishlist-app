import { cookies } from 'next/headers';
import argon2 from 'argon2';
import ENV from '@/lib/env';
import { db } from '@/drizzle';
import { wishlistOrders } from '@/drizzle/schema';

export async function POST(req: Request) {
  // check if user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token || !argon2.verify(token.value, ENV.ORDER_MODE_PASSWORD)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { itemId } = await req.json();

  const response = db
    .insert(wishlistOrders)
    .values({
      itemId,
      isOrdered: true,
    })
    .returning({ id: wishlistOrders.id, itemId: wishlistOrders.itemId })
    .execute();

  console.log(response);
  return new Response('Success', { status: 200 });
}
