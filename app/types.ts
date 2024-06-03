import { themes } from "./components/providers/theme";

export type TicTacToeValue = "x" | "o" | null;
export interface TicTacToeHistory {
    squares: TicTacToeValue[];
    row: number;
    col: number;
}
export type Theme = (typeof themes)[number];
