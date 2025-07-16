import { wishlistItems } from "@/drizzle/schema";

export type WishlistItem = typeof wishlistItems & {
  lowestPrice: number;
};
