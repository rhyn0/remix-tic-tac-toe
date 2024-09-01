import {
    GameZ,
    type TicTacToeValue,
    type GameId,
    type GameT,
    type NewGameT,
} from "~/types";
import { db } from "./db";
import { eq, not, sql } from "drizzle-orm";
import { games } from "~/db/schema";
import { inspect } from "node:util";
// Collection of actions to update the database for each game.
export async function createNewGame(data: NewGameT): Promise<GameId | null> {
    const displayId = crypto.randomUUID();
    const defaultSquares = Array(
        data.boardDimensions * data.boardDimensions,
    ).fill(null);
    try {
        await db.insert(games).values({
            ...data,
            displayId,
            squares: defaultSquares,
        });
    } catch (e) {
        console.error(e);
        return null;
    }
    return displayId;
}
export async function getSpecificGame(id: GameId): Promise<GameT | null> {
    try {
        const game = await db
            .select()
            .from(games)
            .where(eq(games.displayId, id))
            .get();
        const filteredGame = GameZ.safeParse(game);
        if (!filteredGame.success) {
            console.warn(
                "Failed to fetch game of id: ",
                id,
                inspect(filteredGame.error, undefined, 3, true),
            );
            return null;
        }
        return filteredGame.data;
    } catch (e) {
        console.error(e);
        return null;
    }
}
export async function updateGameSquares(
    gameId: GameId,
    {
        squares,
        currentMove,
    }: {
        squares: TicTacToeValue[];
        currentMove: number;
    },
): Promise<boolean> {
    try {
        await db
            .update(games)
            .set({
                squares,
                currentMoveNum: currentMove,
            })
            .where(eq(games.displayId, gameId));
        return true;
    } catch (e) {
        console.error("Failed to update DB", e);
        return false;
    }
}
export async function getOngoingGames({
    page = 0,
    limit = 10,
}: { page?: number; limit?: number }): Promise<GameT[]> {
    let ongoingGames: (typeof games.$inferSelect)[];
    try {
        ongoingGames = await db
            .select()
            .from(games)
            .where(
                not(
                    eq(
                        sql<number>`${games.boardDimensions} * ${games.boardDimensions}`,
                        // current move is 0-indexed (first move is 0)
                        sql<number>`${games.currentMoveNum} + 1`,
                    ),
                ),
            )
            .orderBy(games.id)
            .offset(page * limit)
            .limit(limit);
    } catch (e) {
        console.error(e);
        return [];
    }
    const filteredGames = GameZ.array().safeParse(ongoingGames);
    if (!filteredGames.success) {
        console.error(filteredGames.error);
        return [];
    }
    return filteredGames.data;
}
