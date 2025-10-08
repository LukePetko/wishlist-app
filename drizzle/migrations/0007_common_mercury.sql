CREATE TABLE "difficulty_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"color" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD COLUMN "difficulty_level" uuid;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "fk_wishlist_items_difficulty_level" FOREIGN KEY ("difficulty_level") REFERENCES "public"."difficulty_levels"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" DROP COLUMN "is_ordered";--> statement-breakpoint
ALTER TABLE "wishlist_items" DROP COLUMN "order_note";