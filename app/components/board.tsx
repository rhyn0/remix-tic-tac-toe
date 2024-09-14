import Square from "./square";
import type { TicTacToeValue } from "~/types";
import { cn } from "~/lib/utils";
import calculateWinner from "~/lib/board-logic";

type XPlayerName = string;
type OPlayerName = string;
export interface BoardProps {
    isXTurn: boolean;
    squareValues: TicTacToeValue[];
    handlePlay: (
        nextSquares: TicTacToeValue[],
        clickedRow: number,
        clickedCol: number,
    ) => void;
    boardSize?: number;
    playerNames: [XPlayerName, OPlayerName];
}

export default function Board({
    isXTurn,
    squareValues,
    handlePlay,
    boardSize = 3,
    playerNames,
}: BoardProps) {
    const handleSquareClick = (idx: number) => {
        // don't allow choosing already chosen squares
        const { winner } = calculateWinner(squareValues);
        if (squareValues[idx] || winner) {
            return;
        }

        const newValues = squareValues.slice();
        newValues[idx] = isXTurn ? "x" : "o";
        const row = Math.floor(idx / boardSize);
        const col = idx % boardSize;
        handlePlay(newValues, row, col);
    };
    const { winner, winningSquares } = calculateWinner(squareValues);
    const status = buildStatus({ winner, squareValues, isXTurn, playerNames });
    return (
        <div>
            <h1 className="text-bold text-2xl text-black text-center">
                {status}
            </h1>
            <div className="grid gap-0 grid-rows-3 w-fit h-fit mx-auto overflow-hidden box-border">
                {Array(boardSize)
                    .fill(null)
                    .map((_, idx) => (
                        <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: only idx is available, never changing
                            key={`row-${idx}`}
                            className="after:clear-both after:content[''] after:table"
                        >
                            {Array(boardSize)
                                .fill(null)
                                .map((_, innerIdx) => {
                                    const squareIdx = 3 * idx + innerIdx;
                                    return (
                                        <Square
                                            key={`cell-${squareIdx}`}
                                            squareValue={
                                                squareValues[squareIdx]
                                            }
                                            onMouseDown={() =>
                                                handleSquareClick(squareIdx)
                                            }
                                            className={cn("bg-white", {
                                                "bg-green-300":
                                                    winningSquares?.includes(
                                                        squareIdx,
                                                    ),
                                            })}
                                        />
                                    );
                                })}
                        </div>
                    ))}
            </div>
        </div>
    );
}

function buildStatus({
    winner,
    squareValues,
    isXTurn,
    playerNames,
}: {
    winner: TicTacToeValue;
    squareValues: TicTacToeValue[];
    isXTurn: boolean;
    playerNames: [string, string];
}) {
    if (winner) {
        return `Winner is ${winner} - ${
            winner === "x" ? playerNames[0] : playerNames[1]
        }.`;
    }
    if (!squareValues.every(Boolean)) {
        return `Next player is ${
            isXTurn ? `X - ${playerNames[0]}` : `O - ${playerNames[1]}`
        }.`;
    }
    return "It's a draw.";
}
