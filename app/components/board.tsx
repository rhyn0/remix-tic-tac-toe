import React from "react";
import Square from "./square";
import { TicTacToeValue } from "~/types";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export interface BoardProps {
    isXTurn: boolean;
    squareValues: TicTacToeValue[];
    handlePlay: (nextSquares: TicTacToeValue[]) => void;
}

export function ErrorBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}

export default function Board({
    isXTurn,
    squareValues,
    handlePlay,
}: BoardProps) {
    const calculateWinner = React.useCallback((squares: TicTacToeValue[]) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const [a, b, c] of lines) {
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }
        return null;
    }, []);
    const handleSquareClick = (idx: number) => {
        // don't allow choosing already chosen squares
        if (squareValues[idx] || calculateWinner(squareValues)) {
            return;
        }

        const newValues = squareValues.slice();
        newValues[idx] = isXTurn ? "x" : "o";
        handlePlay(newValues);
    };
    const winner = calculateWinner(squareValues);
    const status = buildStatus({ winner, squareValues, isXTurn });
    return (
        <div>
            <h1 className="text-bold text-2xl text-black text-center">
                {status}
            </h1>
            <div className="grid gap-0 grid-rows-3 w-fit h-fit mx-auto overflow-hidden box-border">
                <div className="after:clear-both after:content[''] after:table">
                    <Square
                        value={squareValues[0]}
                        onMouseDown={() => handleSquareClick(0)}
                    />
                    <Square
                        value={squareValues[1]}
                        onMouseDown={() => handleSquareClick(1)}
                    />
                    <Square
                        value={squareValues[2]}
                        onMouseDown={() => handleSquareClick(2)}
                    />
                </div>
                <div className="after:clear-both after:content[''] after:table">
                    <Square
                        value={squareValues[3]}
                        onMouseDown={() => handleSquareClick(3)}
                    />
                    <Square
                        value={squareValues[4]}
                        onMouseDown={() => handleSquareClick(4)}
                    />
                    <Square
                        value={squareValues[5]}
                        onMouseDown={() => handleSquareClick(5)}
                    />
                </div>
                <div className="after:clear-both after:content[''] after:table">
                    <Square
                        value={squareValues[6]}
                        onMouseDown={() => handleSquareClick(6)}
                    />
                    <Square
                        value={squareValues[7]}
                        onMouseDown={() => handleSquareClick(7)}
                    />
                    <Square
                        value={squareValues[8]}
                        onMouseDown={() => handleSquareClick(8)}
                    />
                </div>
            </div>
        </div>
    );
}

function buildStatus({
    winner,
    squareValues,
    isXTurn,
}: {
    winner: TicTacToeValue;
    squareValues: TicTacToeValue[];
    isXTurn: boolean;
}) {
    if (winner) {
        return `Winner is ${winner}.`;
    } else if (!squareValues.every(Boolean)) {
        return `Next player is ${isXTurn ? "X" : "O"}.`;
    } else {
        return "It's a draw.";
    }
}
