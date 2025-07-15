import {
  mysqlTable,
  varchar,
  char,
  boolean,
  decimal,
  timestamp,
  text,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const wishlistItems = mysqlTable("wishlist_items", {
  id: char("id", { length: 36 })
    .primaryKey()
    .default(sql`UUID()`),
  name: varchar("name", { length: 255 }).notNull(),
  image: varchar("image", { length: 2083 }),
  description: text("description"),
  isBought: boolean("is_bought").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const wishlistLinks = mysqlTable(
  "wishlist_links",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .default(sql`UUID()`),
    itemId: char("item_id", { length: 36 }).notNull(),
    url: varchar("url", { length: 2083 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    storeName: varchar("store_name", { length: 255 }),
    storeIcon: varchar("store_icon", { length: 2083 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (wishlistLinks) => ({
    itemFk: foreignKey({
      columns: [wishlistLinks.itemId],
      foreignColumns: [wishlistItems.id],
      name: "fk_wishlist_links_item_id",
    }),
  }),
);
