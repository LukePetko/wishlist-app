CREATE TABLE "wishlist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" varchar(2083),
	"description" text,
	"is_bought" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"url" varchar(2083) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"store_name" varchar(255),
	"store_icon" varchar(2083),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wishlist_links" ADD CONSTRAINT "fk_wishlist_links_item_id" FOREIGN KEY ("item_id") REFERENCES "public"."wishlist_items"("id") ON DELETE no action ON UPDATE no action;