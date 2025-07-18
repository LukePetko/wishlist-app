import { wishlistItems, wishlistLinks } from "@/drizzle/schema";

export type WishlistItem = typeof wishlistItems.$inferSelect & {
  links: (typeof wishlistLinks.$inferSelect)[];
  lowestPrice: number;
};
