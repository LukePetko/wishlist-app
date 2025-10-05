// drizzle/seed.ts
import { db } from '@/drizzle'; // adjust path as needed
import { wishlistItems, wishlistLinks, stores } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

async function main() {
  console.log('🌱 Seeding stores...');

  const storeId1 = randomUUID();
  const storeId2 = randomUUID();

  await db.insert(stores).values([
    {
      id: storeId1,
      name: 'Example Store',
      icon: 'https://store.example.com/favicon.ico',
    },
    {
      id: storeId2,
      name: 'Keychron Official',
      icon: 'https://keychron.com/favicon.ico',
    },
  ]);

  console.log('🌱 Seeding wishlist_items...');

  const itemId1 = randomUUID();
  const itemId2 = randomUUID();

  await db.insert(wishlistItems).values([
    {
      id: itemId1,
      name: 'Nintendo Switch OLED',
      image: '/images/switch.png',
      description:
        'The new Nintendo Switch OLED model features a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.',
      isBought: false,
    },
    {
      id: itemId2,
      name: 'Keychron K2',
      image: 'https://example.com/keychron.jpg',
      description:
        'The Keychron K2 is a 75% layout (84-key) white backlit compact Bluetooth mechanical keyboard. The K2 is crafted to maximize your workspace with an ergonomic design, while retaining all necessary multimedia and function keys.',
      isBought: true,
    },
  ]);

  console.log('🌱 Seeding wishlist_links...');

  await db.insert(wishlistLinks).values([
    {
      id: randomUUID(),
      itemId: itemId1,
      storeId: storeId1,
      url: 'https://store.example.com/switch',
      price: '349.99',
      currency: 'USD',
    },
    {
      id: randomUUID(),
      itemId: itemId2,
      storeId: storeId2,
      url: 'https://store.example.com/keychron',
      price: '89.00',
      currency: 'USD',
    },
  ]);

  console.log('✅ Done seeding!');
}

main()
  .catch((err) => {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
