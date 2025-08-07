ALTER TABLE "wishlist_links" DROP CONSTRAINT "fk_wishlist_links_item_id";
--> statement-breakpoint
ALTER TABLE "wishlist_links" ADD CONSTRAINT "fk_wishlist_links_item_id" FOREIGN KEY ("item_id") REFERENCES "public"."wishlist_items"("id") ON DELETE cascade ON UPDATE no action;