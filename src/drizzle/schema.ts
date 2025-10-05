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
	isOrdered: boolean("is_ordered").notNull().default(false),
	orderNote: text("order_note"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

// --- stores table ---
export const stores = pgTable("stores", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	icon: varchar("icon", { length: 2083 }),
	iconType: varchar("icon_type", { length: 255 }).default("local"),
});

// --- wishlist_links table ---
export const wishlistLinks = pgTable(
	"wishlist_links",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		itemId: uuid("item_id").notNull(),
		storeId: uuid("store_id").notNull(),
		url: varchar("url", { length: 2083 }).notNull(),
		price: decimal("price", { precision: 10, scale: 2 }).notNull(),
		currency: varchar("currency", { length: 3 }).notNull(),
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
		}).onDelete("cascade"),
		storeFk: foreignKey({
			columns: [wishlistLinks.storeId],
			foreignColumns: [stores.id],
			name: "fk_wishlist_links_store_id",
		}),
	}),
);

export const categories = pgTable("categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const wishlistItemsCategories = pgTable(
	"wishlist_items_categories",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		itemId: uuid("item_id").notNull(),
		categoryId: uuid("category_id").notNull(),
	},
	(wishlistItemsCategories) => ({
		itemFk: foreignKey({
			columns: [wishlistItemsCategories.itemId],
			foreignColumns: [wishlistItems.id],
			name: "fk_wishlist_items_categories_item_id",
		}),
		categoryFk: foreignKey({
			columns: [wishlistItemsCategories.categoryId],
			foreignColumns: [categories.id],
			name: "fk_wishlist_items_categories_category_id",
		}),
	}),
);

export const wishlistOrders = pgTable("wishlist_orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	itemId: uuid("item_id").notNull(),
	isOrdered: boolean("is_ordered").notNull().default(false),
	note: text("note"),
});

// --- Relations ---
export const wishlistLinksRelations = relations(
	wishlistLinks,
	({ one, many }) => ({
		item: one(wishlistItems, {
			fields: [wishlistLinks.itemId],
			references: [wishlistItems.id],
			relationName: "fk_wishlist_links_item_id",
		}),
		store: one(stores, {
			fields: [wishlistLinks.storeId],
			references: [stores.id],
			relationName: "fk_wishlist_links_store_id",
		}),
		categories: many(wishlistItemsCategories),
	}),
);

export const wishlistItemsRelations = relations(wishlistItems, ({ many }) => ({
	links: many(wishlistLinks),
	orders: many(wishlistOrders),
}));

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
			relationName: "fk_wishlist_items_categories_item_id",
		}),
		category: one(categories, {
			fields: [wishlistItemsCategories.categoryId],
			references: [categories.id],
			relationName: "fk_wishlist_items_categories_category_id",
		}),
	}),
);

export const wishlistOrdersRelations = relations(wishlistOrders, ({ one }) => ({
	item: one(wishlistItems, {
		fields: [wishlistOrders.itemId],
		references: [wishlistItems.id],
		relationName: "fk_wishlist_orders_item_id",
	}),
}));
