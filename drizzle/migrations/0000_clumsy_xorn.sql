CREATE TABLE `wishlist_items` (
	`id` char(36) NOT NULL DEFAULT UUID(),
	`name` varchar(255) NOT NULL,
	`image` varchar(2083),
	`description` text,
	`is_bought` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wishlist_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlist_links` (
	`id` char(36) NOT NULL DEFAULT UUID(),
	`item_id` char(36) NOT NULL,
	`url` varchar(2083) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`store_name` varchar(255),
	`store_icon` varchar(2083),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wishlist_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `wishlist_links` ADD CONSTRAINT `fk_wishlist_links_item_id` FOREIGN KEY (`item_id`) REFERENCES `wishlist_items`(`id`) ON DELETE no action ON UPDATE no action;