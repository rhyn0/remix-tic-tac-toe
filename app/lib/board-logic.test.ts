import { expect, test, describe } from "vitest";
import calculateWinner, {
    rowWinner,
    colWinner,
    diagonalWinner,
} from "./board-logic";
const boardSize = 9;
const rowLength = 3;

describe("rowWinner", () => {
    test.for([
        ["x", 0, 3],
        ["x", 3, 6],
        ["x", 6, 9],
        ["o", 0, 3],
        ["o", 3, 6],
        ["o", 6, 9],
    ] as [string, number, number][])(
        "when row is filled with '%s' should return a winner",
        ([fillValue, lowerBoundIncl, upperBoundExcl]) => {
            const expectedWinningSquares = Array(
                upperBoundExcl - lowerBoundIncl,
            )
                .fill(null)
                .map((_, idx) => lowerBoundIncl + idx);
            const board = Array(boardSize)
                .fill(null)
                .map((element, idx) =>
                    lowerBoundIncl <= idx && idx < upperBoundExcl
                        ? fillValue
                        : element,
                );
            const winnerResult = rowWinner(board, rowLength);
            expect(winnerResult.winner).not.toBeNull();
            expect(winnerResult.winner).equal(fillValue);
            expect(winnerResult.winningSquares).toEqual(expectedWinningSquares);
        },
    );
    test("should report no winning squares on an empty board", () => {
        const board = Array(boardSize).fill(null);
        expect(rowWinner(board, rowLength).winner).toBeNull();
    });
    test.for([
        ["x", 0],
        ["x", 1],
        ["x", 2],
        ["o", 0],
        ["o", 1],
        ["o", 2],
    ] as [string, number][])(
        "should report no winner when column is filled with a win",
        ([fillValue, colIndex]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((element, idx) =>
                    idx % rowLength === colIndex ? fillValue : element,
                );
            const winnerResult = rowWinner(board, rowLength);
            expect(winnerResult.winner).toBeNull();
            expect(winnerResult.winningSquares).toBeNull();
        },
    );
    test.for([
        ["x", [0, 4, 8]],
        ["x", [2, 4, 6]],
        ["o", [0, 4, 8]],
        ["o", [2, 4, 6]],
    ] as [string, number[]][])(
        "should report no winner (%s) when cells %o are filled",
        ([fillValue, filledCells]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((el, idx) => (filledCells.includes(idx) ? fillValue : el));
            const winnerResult = rowWinner(board, rowLength);
            expect(winnerResult.winner).toBeNull();
            expect(winnerResult.winningSquares).toBeNull();
        },
    );
});
describe("colWinner", () => {
    test.for([
        ["x", 0, 3],
        ["x", 3, 6],
        ["x", 6, 9],
        ["o", 0, 3],
        ["o", 3, 6],
        ["o", 6, 9],
    ] as [string, number, number][])(
        "when row is filled with '%s' should return no winner",
        ([fillValue, lowerBoundIncl, upperBoundExcl]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((element, idx) =>
                    lowerBoundIncl <= idx && idx < upperBoundExcl
                        ? fillValue
                        : element,
                );
            const winnerResult = colWinner(board, rowLength);
            expect(winnerResult.winner).toBeNull();
            expect(winnerResult.winningSquares).toBeNull();
        },
    );
    test("should report no winning squares on an empty board", () => {
        const board = Array(boardSize).fill(null);
        expect(colWinner(board, rowLength).winner).toBeNull();
    });
    test.for([
        [0, "x"],
        [1, "x"],
        [2, "x"],
        [0, "o"],
        [1, "o"],
        [2, "o"],
    ] as [number, string][])(
        "should report a winner when column %d is filled with %s",
        ([colIndex, fillValue]) => {
            const expectedWinningSquares = Array(boardSize)
                .fill(null)
                .map((_, idx) => idx)
                .filter((el) => el % rowLength === colIndex);
            const board = Array(boardSize)
                .fill(null)
                .map((element, idx) =>
                    idx % rowLength === colIndex ? fillValue : element,
                );
            const winnerResult = colWinner(board, rowLength);
            expect(winnerResult.winner).not.toBeNull();
            expect(winnerResult.winner).toBe(fillValue);
            expect(winnerResult.winningSquares).toEqual(expectedWinningSquares);
        },
    );
    test.for([
        ["x", [0, 4, 8]],
        ["x", [2, 4, 6]],
        ["o", [0, 4, 8]],
        ["o", [2, 4, 6]],
    ] as [string, number[]][])(
        "should report no winner (%s) when cells %o are filled",
        ([fillValue, filledCells]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((el, idx) => (filledCells.includes(idx) ? fillValue : el));
            const winnerResult = colWinner(board, rowLength);
            expect(winnerResult.winner).toBeNull();
            expect(winnerResult.winningSquares).toBeNull();
        },
    );
});
describe("calculateWinner", () => {
    test.for([
        ["x", 0, 3],
        ["x", 3, 6],
        ["x", 6, 9],
        ["o", 0, 3],
        ["o", 3, 6],
        ["o", 6, 9],
    ] as [string, number, number][])(
        "should return a winner %s when row [%d, %d) is filled",
        ([fillValue, lowerBoundIncl, upperBoundExcl]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((element, idx) =>
                    lowerBoundIncl <= idx && idx < upperBoundExcl
                        ? fillValue
                        : element,
                );
            const winnerResult = calculateWinner(board);
            expect(winnerResult.winner).not.toBeNull();
            expect(winnerResult.winner).toBe(fillValue);
            expect(winnerResult.winningSquares).not.toBeNull();
        },
    );
    test("should report no winning squares on an empty board", () => {
        const board = Array(boardSize).fill(null);
        expect(calculateWinner(board).winner).toBeNull();
    });
    test.for([
        ["x", 0],
        ["x", 1],
        ["x", 2],
        ["o", 0],
        ["o", 1],
        ["o", 2],
    ] as [string, number][])(
        "should report a winner (%s) when column %d is filled",
        ([fillValue, colIndex]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((element, idx) =>
                    idx % rowLength === colIndex ? fillValue : element,
                );
            const winnerResult = calculateWinner(board);
            expect(winnerResult.winner).not.toBeNull();
            expect(winnerResult.winner).toBe(fillValue);
            expect(winnerResult.winningSquares).not.toBeNull();
        },
    );
    test.for([
        ["x", [0, 4, 8]],
        ["x", [2, 4, 6]],
        ["o", [0, 4, 8]],
        ["o", [2, 4, 6]],
    ] as [string, number[]][])(
        "should report a winner (%s) when cells %o are filled",
        ([fillValue, filledCells]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((el, idx) => (filledCells.includes(idx) ? fillValue : el));
            const winnerResult = calculateWinner(board);
            expect(winnerResult.winner).not.toBeNull();
            expect(winnerResult.winner).toBe(fillValue);
            expect(winnerResult.winningSquares).toEqual(filledCells);
        },
    );
});
describe("diagonalWinner", () => {
    test.for([
        ["x", 0, 3],
        ["x", 3, 6],
        ["x", 6, 9],
        ["o", 0, 3],
        ["o", 3, 6],
        ["o", 6, 9],
    ] as [string, number, number][])(
        "when row is filled with '%s' should return no winner",
        ([fillValue, lowerBoundIncl, upperBoundExcl]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((element, idx) =>
                    lowerBoundIncl <= idx && idx < upperBoundExcl
                        ? fillValue
                        : element,
                );
            const winnerResult = diagonalWinner(board, rowLength);
            expect(winnerResult.winner).toBeNull();
            expect(winnerResult.winningSquares).toBeNull();
        },
    );
    test("should report no winning squares on an empty board", () => {
        const board = Array(boardSize).fill(null);
        expect(diagonalWinner(board, rowLength).winner).toBeNull();
    });
    test.for([
        [0, "x"],
        [1, "x"],
        [2, "x"],
        [0, "o"],
        [1, "o"],
        [2, "o"],
    ] as [number, string][])(
        "should report no winner when column %d is filled with %s",
        ([colIndex, fillValue]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((element, idx) =>
                    idx % rowLength === colIndex ? fillValue : element,
                );
            const winnerResult = diagonalWinner(board, rowLength);
            expect(winnerResult.winner).toBeNull();
            expect(winnerResult.winningSquares).toBeNull();
        },
    );
    test.for([
        ["x", [0, 4, 8]],
        ["x", [2, 4, 6]],
        ["o", [0, 4, 8]],
        ["o", [2, 4, 6]],
    ] as [string, number[]][])(
        "should report a winner %s when cells %o are filled",
        ([fillValue, filledCells]) => {
            const board = Array(boardSize)
                .fill(null)
                .map((el, idx) => (filledCells.includes(idx) ? fillValue : el));
            const winnerResult = diagonalWinner(board, rowLength);
            expect(winnerResult.winner).not.toBeNull();
            expect(winnerResult.winner).toBe(fillValue);
            expect(winnerResult.winningSquares).toEqual(filledCells);
        },
    );
});
