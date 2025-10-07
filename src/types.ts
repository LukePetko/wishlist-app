import type {
  stores,
  wishlistItems,
  wishlistLinks,
  wishlistOrders,
} from '@/drizzle/schema';

export type WishlistLink = typeof wishlistLinks.$inferSelect & {
  store: typeof stores.$inferSelect;
};

export type WishlistItem = typeof wishlistItems.$inferSelect & {
  links: WishlistLink[];
  isOrdered?: boolean;
  lowestPrice: string;
  orders: typeof wishlistOrders.$inferSelect;
};
