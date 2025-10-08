import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// --- wishlist_items table ---
export const wishlistItems = pgTable(
  'wishlist_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    image: varchar('image', { length: 2083 }),
    description: text('description'),
    isBought: boolean('is_bought').notNull().default(false),
    difficultyLevel: uuid('difficulty_level'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (wishlistItems) => ({
    difficultyLevelFk: foreignKey({
      columns: [wishlistItems.difficultyLevel],
      foreignColumns: [difficultyLevels.id],
      name: 'fk_wishlist_items_difficulty_level',
    }).onDelete('set null'),
  }),
);

// --- stores table ---
export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 2083 }),
  iconType: varchar('icon_type', { length: 255 }).default('local'),
});

// --- wishlist_links table ---
export const wishlistLinks = pgTable(
  'wishlist_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: uuid('item_id').notNull(),
    storeId: uuid('store_id').notNull(),
    url: varchar('url', { length: 2083 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (wishlistLinks) => ({
    itemFk: foreignKey({
      columns: [wishlistLinks.itemId],
      foreignColumns: [wishlistItems.id],
      name: 'fk_wishlist_links_item_id',
    }).onDelete('cascade'),
    storeFk: foreignKey({
      columns: [wishlistLinks.storeId],
      foreignColumns: [stores.id],
      name: 'fk_wishlist_links_store_id',
    }),
  }),
);

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const wishlistItemsCategories = pgTable(
  'wishlist_items_categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: uuid('item_id').notNull(),
    categoryId: uuid('category_id').notNull(),
  },
  (wishlistItemsCategories) => ({
    itemFk: foreignKey({
      columns: [wishlistItemsCategories.itemId],
      foreignColumns: [wishlistItems.id],
      name: 'fk_wishlist_items_categories_item_id',
    }),
    categoryFk: foreignKey({
      columns: [wishlistItemsCategories.categoryId],
      foreignColumns: [categories.id],
      name: 'fk_wishlist_items_categories_category_id',
    }),
  }),
);

export const wishlistOrders = pgTable('wishlist_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id').notNull(),
  isOrdered: boolean('is_ordered').notNull().default(false),
  note: text('note'),
});

export const difficultyLevels = pgTable('difficulty_levels', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 255 }).notNull(),
});

// --- Relations ---
export const wishlistLinksRelations = relations(
  wishlistLinks,
  ({ one, many }) => ({
    item: one(wishlistItems, {
      fields: [wishlistLinks.itemId],
      references: [wishlistItems.id],
      relationName: 'fk_wishlist_links_item_id',
    }),
    store: one(stores, {
      fields: [wishlistLinks.storeId],
      references: [stores.id],
      relationName: 'fk_wishlist_links_store_id',
    }),
    categories: many(wishlistItemsCategories),
  }),
);

export const wishlistItemsRelations = relations(
  wishlistItems,
  ({ one, many }) => ({
    links: many(wishlistLinks),
    orders: many(wishlistOrders),
    categories: many(wishlistItemsCategories),
    difficultyLevel: one(difficultyLevels, {
      fields: [wishlistItems.difficultyLevel],
      references: [difficultyLevels.id],
      relationName: 'fk_wishlist_items_difficulty_level',
    }),
  }),
);

export const storesRelations = relations(stores, ({ many }) => ({
  links: many(wishlistLinks),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(wishlistItemsCategories),
}));

export const wishlistItemsCategoriesRelations = relations(
  wishlistItemsCategories,
  ({ one }) => ({
    item: one(wishlistItems, {
      fields: [wishlistItemsCategories.itemId],
      references: [wishlistItems.id],
      relationName: 'fk_wishlist_items_categories_item_id',
    }),
    category: one(categories, {
      fields: [wishlistItemsCategories.categoryId],
      references: [categories.id],
      relationName: 'fk_wishlist_items_categories_category_id',
    }),
  }),
);

export const wishlistOrdersRelations = relations(wishlistOrders, ({ one }) => ({
  item: one(wishlistItems, {
    fields: [wishlistOrders.itemId],
    references: [wishlistItems.id],
    relationName: 'fk_wishlist_orders_item_id',
  }),
}));
