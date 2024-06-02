import React from "react";
import Board from "~/components/board";
import { TicTacToeValue } from "~/types";
import JumpToMove from "~/components/move-jumper";

export default function TTTGame() {
    const [gameHistory, setGameHistory] = React.useState<TicTacToeValue[][]>([
        Array(9).fill(null),
    ]);
    const [currentMoveNum, setCurrentMoveNum] = React.useState<number>(0);

    const isXTurn = currentMoveNum % 2 === 0;
    const squareValues = gameHistory[currentMoveNum];

    const handleBoardClick = (nextSquares: TicTacToeValue[]): void => {
        const nextHistory = [
            ...gameHistory.slice(0, currentMoveNum + 1),
            nextSquares,
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
                    squareValues={squareValues}
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
