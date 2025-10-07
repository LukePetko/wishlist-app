'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import argon2 from 'argon2';
import ENV from '@/lib/env';
import { db } from '@/drizzle';
import { wishlistOrders } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

type PlaceOrderInput = { itemId: string; note?: string };
type PlaceOrderResult =
  | { ok: true; data: { id: string; itemId: string } }
  | {
      ok: false;
      error: 'UNAUTHORIZED' | 'DB_ERROR' | 'BAD_INPUT' | 'ALREADY_ORDERED';
    };

export async function createOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  try {
    if (!input?.itemId) return { ok: false, error: 'BAD_INPUT' };

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return { ok: false, error: 'UNAUTHORIZED' };

    const valid = await argon2.verify(token, ENV.ORDER_MODE_PASSWORD);
    if (!valid) return { ok: false, error: 'UNAUTHORIZED' };

    const existingOrder = await db
      .select()
      .from(wishlistOrders)
      .where(eq(wishlistOrders.itemId, input.itemId));

    if (existingOrder.length > 0)
      return { ok: false, error: 'ALREADY_ORDERED' };

    const [row] = await db
      .insert(wishlistOrders)
      .values({ itemId: input.itemId, isOrdered: true, note: input.note })
      .returning({ id: wishlistOrders.id, itemId: wishlistOrders.itemId });

    revalidatePath('/wishlist');

    return { ok: true, data: row };
  } catch (err) {
    console.error(err);
    return { ok: false, error: 'DB_ERROR' };
  }
}
