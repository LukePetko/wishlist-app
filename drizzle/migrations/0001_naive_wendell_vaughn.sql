CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon" varchar(2083),
	"icon_type" varchar(255) DEFAULT 'local'
);
--> statement-breakpoint
ALTER TABLE "wishlist_links" ADD COLUMN "store_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist_links" ADD CONSTRAINT "fk_wishlist_links_store_id" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_links" DROP COLUMN "store_name";--> statement-breakpoint
ALTER TABLE "wishlist_links" DROP COLUMN "store_icon";