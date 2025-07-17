import {
  pgTable,
  uuid,
  varchar,
  boolean,
  decimal,
  timestamp,
  text,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- wishlist_items table ---
export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  image: varchar("image", { length: 2083 }),
  description: text("description"),
  isBought: boolean("is_bought").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- wishlist_links table ---
export const wishlistLinks = pgTable(
  "wishlist_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id").notNull(),
    url: varchar("url", { length: 2083 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    storeName: varchar("store_name", { length: 255 }),
    storeIcon: varchar("store_icon", { length: 2083 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (wishlistLinks) => ({
    itemFk: foreignKey({
      columns: [wishlistLinks.itemId],
      foreignColumns: [wishlistItems.id],
      name: "fk_wishlist_links_item_id",
    }),
  }),
);

// --- Relations ---
export const wishlistLinksRelations = relations(wishlistLinks, ({ one }) => ({
  item: one(wishlistItems, {
    fields: [wishlistLinks.itemId],
    references: [wishlistItems.id],
    relationName: "fk_wishlist_links_item_id",
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ many }) => ({
  links: many(wishlistLinks),
}));
