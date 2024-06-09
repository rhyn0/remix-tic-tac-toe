import type { themes } from "./components/providers/theme";
import { z } from "zod";

const TicTacToeValues = ["x", "o"] as const;
export type TicTacToeValue = (typeof TicTacToeValues)[number] | null;
export const TTTValueZ = z
    .enum(TicTacToeValues)
    .nullable() satisfies z.ZodType<TicTacToeValue>;
export interface TicTacToeHistory {
    squares: TicTacToeValue[];
    row: number;
    col: number;
}
export type Theme = (typeof themes)[number];

export const NewGameZ = z.object({
    player1Name: z.string().min(1, { message: "Need a name for player 1." }),
    player2Name: z.string().min(1, { message: "Need a name for player 2." }),
    boardDimensions: z.coerce.number().finite().positive().int(),
});
export type NewGameT = z.infer<typeof NewGameZ>;

export const GameIdZ = z.string().uuid();
export type GameId = z.infer<typeof GameIdZ>;

export const GameZ = NewGameZ.extend({
    squares: TTTValueZ.array(),
    displayId: z.string().uuid(),
    lastPlayTime: z.date(),
    currentMoveNum: z.number().nonnegative().int(),
});
export type GameT = z.infer<typeof GameZ>;

export const GameUpdateZ = GameZ.pick({
    squares: true,
    currentMoveNum: true,
});
export type GameUpdateT = z.infer<typeof GameUpdateZ>;
