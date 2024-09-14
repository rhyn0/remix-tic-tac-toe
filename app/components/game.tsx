import React from "react";
import Board from "~/components/board";
import type { TicTacToeHistory, TicTacToeValue } from "~/types";
import JumpToMove from "~/components/move-jumper";
import { cn } from "~/lib/utils";

export interface TTTGameProps {
    disableHistory?: boolean;
    onPlay: (sq: TicTacToeValue[], currentMove: number) => void;
    squares: TicTacToeValue[];
    xPlayerName: string;
    oPlayerName: string;
    boardSize: number;
    currentMoveNum: number;
}
export default function TTTGame({
    disableHistory = false,
    onPlay,
    squares,
    xPlayerName,
    oPlayerName,
    boardSize,
    currentMoveNum: givenCurrentMove,
}: TTTGameProps) {
    const [gameHistory, setGameHistory] = React.useState<TicTacToeHistory[]>([
        {
            squares,
            row: -1,
            col: -1,
        },
    ]);
    const [currentMoveNum, setCurrentMoveNum] =
        React.useState<number>(givenCurrentMove);

    const isXTurn = currentMoveNum % 2 === 0;
    const squareValues =
        gameHistory[Math.min(currentMoveNum, gameHistory.length - 1)];

    const handleBoardClick = (
        nextSquares: TicTacToeValue[],
        clickedRow: number,
        clickedCol: number,
    ): void => {
        onPlay(nextSquares, currentMoveNum + 1);
        const nextHistory: TicTacToeHistory[] = [
            ...gameHistory.slice(0, currentMoveNum + 1),
            {
                squares: nextSquares,
                row: clickedRow,
                col: clickedCol,
            },
        ];
        setGameHistory(nextHistory);
        setCurrentMoveNum(currentMoveNum + 1);
    };

    const handleHistoryClick = React.useCallback((index: number) => {
        setCurrentMoveNum(index);
    }, []);

    return (
        <div className="flex flex-row space-x-10 justify-center">
            <div id="game-board">
                <Board
                    isXTurn={isXTurn}
                    squareValues={squareValues.squares}
                    handlePlay={handleBoardClick}
                    boardSize={boardSize}
                    playerNames={[xPlayerName, oPlayerName]}
                />
            </div>
            <div id="game-info" className={cn({ hidden: disableHistory })}>
                <JumpToMove
                    gameHistory={gameHistory}
                    onClick={handleHistoryClick}
                    currentMove={currentMoveNum}
                />
            </div>
        </div>
    );
}
