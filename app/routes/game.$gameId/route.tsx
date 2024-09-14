import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
    isRouteErrorResponse,
    json,
    redirect,
    useLoaderData,
    useRouteError,
    useSubmit,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import TTTGame from "~/components/game";
import { formatZodError } from "~/lib/error";
import { getSpecificGame, updateGameSquares } from "~/lib/game-db";
import { GameIdZ, GameUpdateZ, type TicTacToeValue } from "~/types";

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
    }
    if (error instanceof Error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    }
    return <h1>Unknown Error</h1>;
}

export async function loader({ params }: LoaderFunctionArgs) {
    invariant(params.gameId, "Game ID was not given");
    const validId = GameIdZ.safeParse(params.gameId);
    if (!validId.success) {
        console.warn(
            `Tried to load game of id '${params.gameId}' which is not a valid id`,
        );
        throw redirect("/", { status: 404 });
    }
    const game = await getSpecificGame(validId.data);
    if (!game) {
        console.warn(`Game of id ${params.gameId} does not exist`);
        throw redirect("/", { status: 404 });
    }
    return json({ game });
}

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.gameId, "Expected a game identifier to be present");
    const bodyData = await request.json();
    const data = GameUpdateZ.safeParse(bodyData);
    if (!data.success) {
        const gameUpdateErrors = formatZodError(data);
        return json(
            {
                message: "Invalid Game update submitted.",
                detail: gameUpdateErrors,
            },
            { status: 400 },
        );
    }
    const result = await updateGameSquares(params.gameId, {
        squares: data.data.squares,
        currentMove: data.data.currentMoveNum,
    });
    // await delay(5000);
    if (result) {
        return json({ message: "Success" }, { status: 200 });
    }
    return json({ message: "Bad request" }, { status: 400 });
}

export default function Index() {
    const { game } = useLoaderData<typeof loader>();
    const submit = useSubmit();

    const handlePlay = (squares: TicTacToeValue[], currentMove: number) => {
        submit(
            {
                squares,
                currentMoveNum: currentMove,
            },
            { method: "POST", encType: "application/json", replace: true },
        );
    };
    return (
        <TTTGame
            disableHistory
            onPlay={handlePlay}
            boardSize={game.boardDimensions}
            squares={game.squares}
            xPlayerName={game.player1Name}
            oPlayerName={game.player2Name}
            currentMoveNum={game.currentMoveNum}
        />
    );
}
