// drizzle/seed.ts
import { db } from "@/drizzle"; // adjust path as needed
import { wishlistItems, wishlistLinks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function main() {
  console.log("🌱 Seeding wishlist_items...");

  const itemId1 = randomUUID();
  const itemId2 = randomUUID();

  await db.insert(wishlistItems).values([
    {
      id: itemId1,
      name: "Nintendo Switch OLED",
      image: "https://example.com/switch.jpg",
      description: "A handheld/home console hybrid.",
      isBought: false,
    },
    {
      id: itemId2,
      name: "Keychron K2",
      image: "https://example.com/keychron.jpg",
      description: "A wireless mechanical keyboard.",
      isBought: true,
    },
  ]);

  console.log("🌱 Seeding wishlist_links...");

  await db.insert(wishlistLinks).values([
    {
      id: randomUUID(),
      itemId: itemId1,
      url: "https://store.example.com/switch",
      price: "349.99",
      currency: "USD",
      storeName: "Example Store",
      storeIcon: "https://store.example.com/favicon.ico",
    },
    {
      id: randomUUID(),
      itemId: itemId2,
      url: "https://store.example.com/keychron",
      price: "89.00",
      currency: "USD",
      storeName: "Keychron Official",
      storeIcon: "https://keychron.com/favicon.ico",
    },
  ]);

  console.log("✅ Done seeding!");
}

main()
  .catch((err) => {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
