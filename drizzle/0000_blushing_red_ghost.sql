CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`display_id` text,
	`board_dims` integer NOT NULL,
	`player_1_name` text NOT NULL,
	`player_2_name` text NOT NULL,
	`squares` text NOT NULL,
	`current_move_num` integer DEFAULT 0 NOT NULL,
	`last_modified` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_display_id_unique` ON `games` (`display_id`);