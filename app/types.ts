import type { themes } from "./components/providers/theme";
import { z } from "zod";

export type TicTacToeValue = "x" | "o" | null;
export interface TicTacToeHistory {
    squares: TicTacToeValue[];
    row: number;
    col: number;
}
export type Theme = (typeof themes)[number];

export const NewGameZ = z.object({
    player1Name: z.string().min(1, { message: "Need a name for player 1." }),
    player2Name: z.string().min(1, { message: "Need a name for player 2." }),
    boardDimensions: z.coerce.number().finite().positive(),
});
export type NewGameT = z.infer<typeof NewGameZ>;

export const GameIdZ = z.string().uuid();
export type GameId = z.infer<typeof GameIdZ>;

export const GameZ = NewGameZ.extend({
    squares: z.enum(["x", "o"]).nullable().array().array(),
    displayId: z.string().uuid(),
    lastPlayTime: z.date(),
});
export type GameT = z.infer<typeof GameZ>;
