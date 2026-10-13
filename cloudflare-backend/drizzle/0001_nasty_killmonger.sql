ALTER TABLE `posts` ADD `title` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `priority` text DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `effort` text DEFAULT 'unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `format` text DEFAULT 'plain' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `attachments` text DEFAULT '[]' NOT NULL;