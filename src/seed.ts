// src/seed.ts
import { db } from "@/drizzle";
import { wishlistItems, wishlistLinks } from "./drizzle/schema";

const itemId = crypto.randomUUID();

await db.insert(wishlistItems).values({
  id: itemId,
  name: "Nintendo Switch OLED",
  image: "https://example.com/switch.jpg",
  description: "The latest OLED version of the Nintendo Switch",
  isBought: false,
});

console.log("✅ Seeded wishlist item with links!");
