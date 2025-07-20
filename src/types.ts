import { stores, wishlistItems, wishlistLinks } from "@/drizzle/schema";

export type WishlistLink = typeof wishlistLinks.$inferSelect & {
  store: typeof stores.$inferSelect;
};

export type WishlistItem = typeof wishlistItems.$inferSelect & {
  links: WishlistLink[];
  lowestPrice: number;
};
