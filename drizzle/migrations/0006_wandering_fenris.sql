CREATE TABLE "wishlist_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"is_ordered" boolean DEFAULT false NOT NULL,
	"note" text
);
