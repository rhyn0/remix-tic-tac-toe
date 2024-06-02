import React from "react";
import Board from "~/components/board";
import { TicTacToeHistory, TicTacToeValue } from "~/types";
import JumpToMove from "~/components/move-jumper";

export default function TTTGame() {
    const [gameHistory, setGameHistory] = React.useState<TicTacToeHistory[]>([
        {
            squares: Array(9).fill(null),
            row: -1,
            col: -1,
        },
    ]);
    const [currentMoveNum, setCurrentMoveNum] = React.useState<number>(0);

    const isXTurn = currentMoveNum % 2 === 0;
    const squareValues = gameHistory[currentMoveNum];

    const handleBoardClick = (
        nextSquares: TicTacToeValue[],
        clickedRow: number,
        clickedCol: number,
    ): void => {
        const nextHistory: TicTacToeHistory[] = [
            ...gameHistory.slice(0, currentMoveNum + 1),
            {
                squares: nextSquares,
                row: clickedRow,
                col: clickedCol,
            },
        ];
        setGameHistory(nextHistory);
        setCurrentMoveNum(nextHistory.length - 1);
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
                />
            </div>
            <div id="game-info">
                <JumpToMove
                    gameHistory={gameHistory}
                    onClick={handleHistoryClick}
                    currentMove={currentMoveNum}
                />
            </div>
        </div>
    );
}
