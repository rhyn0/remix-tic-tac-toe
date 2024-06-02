export type TicTacToeValue = "x" | "o" | null;
export interface TicTacToeHistory {
    squares: TicTacToeValue[];
    row: number;
    col: number;
}
