CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`display_id` text,
	`board_dims` integer NOT NULL,
	`player_1_name` text NOT NULL,
	`player_2_name` text NOT NULL,
	`squares` text NOT NULL,
	`last_modified` integer DEFAULT strftime('%Y-%m-%dT%H-%M-%fZ', 'now')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_display_id_unique` ON `games` (`display_id`);