import type {
  categories,
  difficultyLevels,
  stores,
  wishlistItems,
  wishlistLinks,
  wishlistOrders,
} from '@/drizzle/schema';

export type WishlistLink = typeof wishlistLinks.$inferSelect & {
  store: typeof stores.$inferSelect;
  priceEur: string;
};

export type WishlistItem = typeof wishlistItems.$inferSelect & {
  links: WishlistLink[];
  isOrdered?: boolean;
  lowestPrice: WishlistLink;
  orders: (typeof wishlistOrders.$inferSelect)[];

  categories: (typeof categories.$inferSelect)[];
  difficultyLevel: typeof difficultyLevels.$inferSelect | null;
};
