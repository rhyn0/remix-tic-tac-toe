import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { TicTacToeValue } from "~/types";

const games = sqliteTable("games", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    displayId: text("display_id").unique(),
    // square board
    boardDimensions: integer("board_dims").notNull(),
    player1Name: text("player_1_name").notNull(),
    player2Name: text("player_2_name").notNull(),
    squares: text("squares", { mode: "json" })
        .notNull()
        .$type<TicTacToeValue[]>(),
    currentMoveNum: integer("current_move_num").notNull().default(0),
    lastPlayTime: integer("last_modified", { mode: "timestamp" })
        .default(sql`(unixepoch())`)
        .$onUpdate(() => new Date()),
});

export { games };
