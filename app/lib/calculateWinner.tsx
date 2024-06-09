import type { TicTacToeValue } from "~/types";
import { range } from "./range";

interface WinnerReturn {
    winner: TicTacToeValue;
    winningSquares: number[] | null;
}
function rowWinner(squares: TicTacToeValue[], rowLength: number): WinnerReturn {
    // rows are appended to each other, so we scan for repeated values in a tumbling window
    for (let idx = 0; idx < squares.length; idx += rowLength) {
        const row = squares.slice(idx, idx + rowLength);
        const elements = row.reduce(
            (seen, el) => seen.add(el),
            new Set() as Set<TicTacToeValue>,
        );
        if (elements.size === 1 && !elements.has(null)) {
            return {
                winner: elements.values().next().value,
                winningSquares: range({ start: idx, stop: idx + rowLength }),
            };
        }
    }
    return {
        winner: null,
        winningSquares: null,
    };
}
function colWinner(squares: TicTacToeValue[], colLength: number): WinnerReturn {
    // columns are every idx that is at same remainder as previous
    const columns = squares.reduce((acc, el, idx) => {
        const colIdx = idx % colLength;
        acc[colIdx].push(el);
        return acc;
    }, Array(colLength).fill([]) as TicTacToeValue[][]);

    const winner = columns.reduce(
        (winner, column, colIdx) => {
            const elements = column.reduce(
                (seen, el) => seen.add(el),
                new Set() as Set<TicTacToeValue>,
            );
            if (elements.size === 1 && !elements.has(null)) {
                return {
                    winner: elements.values().next().value,
                    winningSquares: range({
                        start: 0,
                        stop: squares.length,
                        step: colLength,
                    }).map((el) => el + colIdx),
                };
            }
            return winner;
        },
        {
            winner: null,
            winningSquares: null,
        } as WinnerReturn,
    );

    return winner;
}
function diagonalWinner(
    squares: TicTacToeValue[],
    length: number,
): WinnerReturn {
    // diagonals have two easy lines that
    const diagonalSet = new Set() as Set<TicTacToeValue>;
    const diagonalIdx = [];
    for (let row = 0, col = 0; row < length && col < length; col++, row++) {
        const idx = row * length + col;
        diagonalIdx.push(idx);
        diagonalSet.add(squares[idx]);
        if (diagonalSet.size > 1) {
            break;
        }
    }
    if (diagonalSet.size === 1 && !diagonalSet.has(null)) {
        return {
            winner: diagonalSet.values().next().value,
            winningSquares: diagonalIdx,
        };
    }

    diagonalSet.clear();
    // clear array
    diagonalIdx.length = 0;

    for (
        let row = 0, col = length - 1;
        row < length && col >= 0;
        col--, row++
    ) {
        const idx = row * length + col;
        diagonalIdx.push(idx);
        diagonalSet.add(squares[idx]);
        if (diagonalSet.size > 1) {
            break;
        }
    }
    if (diagonalSet.size === 1 && !diagonalSet.has(null)) {
        return {
            winner: diagonalSet.values().next().value,
            winningSquares: diagonalIdx,
        };
    }

    return {
        winner: null,
        winningSquares: null,
    };
}

export function calculateWinner(squares: TicTacToeValue[]): WinnerReturn {
    const size = Math.round(Math.sqrt(squares.length));
    const funcs = [rowWinner, colWinner, diagonalWinner];
    for (const f of funcs) {
        const result = f(squares, size);
        if (result.winner) {
            return result;
        }
    }
    return {
        winner: null,
        winningSquares: null,
    };
}
