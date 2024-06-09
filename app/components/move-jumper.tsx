import React from "react";
import type { TicTacToeHistory } from "~/types";
import { Button } from "./ui/button";

export interface JumpToMoveProps {
    gameHistory: TicTacToeHistory[];
    onClick: (idx: number) => void;
    currentMove: number;
}

export default function JumpToMove({
    gameHistory,
    onClick,
    currentMove,
}: JumpToMoveProps) {
    const [isAscending, setIsAscending] = React.useState<boolean>(true);
    const buildDescription = ({
        index,
        row,
        col,
    }: {
        index: number;
        row: number;
        col: number;
    }) => {
        if (index === 0) {
            return "Go to game start.";
        }
        if (index === currentMove) {
            return `You are at move #${index}.`;
        }
        return `Go to move #${index} - played (row: ${row + 1}, col: ${
            col + 1
        }).`;
    };
    const historyButtons = gameHistory.map((squares, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <li key={idx}>
            <Button onMouseDown={() => onClick(idx)} variant="secondary">
                {buildDescription({
                    index: idx,
                    row: squares.row,
                    col: squares.col,
                })}
            </Button>
        </li>
    ));
    if (!isAscending) {
        historyButtons.reverse();
    }
    return (
        <div className="flex flex-col">
            <Button onMouseDown={() => setIsAscending((prev) => !prev)}>
                Sort Toggle
            </Button>
            <ol>{historyButtons}</ol>
        </div>
    );
}
