import React from "react";
import { TicTacToeValue } from "~/types";
import { Button } from "./ui/button";

export interface JumpToMoveProps {
    gameHistory: TicTacToeValue[][];
    onClick: (idx: number) => void;
    currentMove: number;
}

export default function JumpToMove({
    gameHistory,
    onClick,
    currentMove,
}: JumpToMoveProps) {
    const buildDescription = React.useCallback((index: number) => {
        if (index === 0) {
            return "Go to game start.";
        } else {
            return `Go to move #${index}.`;
        }
    }, []);
    return (
        <ol>
            {gameHistory.slice(0, currentMove).map((_squares, idx) => (
                <li key={idx}>
                    <Button
                        onMouseDown={() => onClick(idx)}
                        variant="secondary"
                    >
                        {buildDescription(idx)}
                    </Button>
                </li>
            ))}
        </ol>
    );
}
