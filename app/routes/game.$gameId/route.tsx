import type { LoaderFunctionArgs } from "@remix-run/node";
import {
    isRouteErrorResponse,
    json,
    redirect,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import TTTGame from "~/components/game";
import { getSpecificGame } from "~/lib/game-db";
import { GameIdZ } from "~/types";

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

export default function Index() {
    const { game } = useLoaderData<typeof loader>();
    console.log(game);

    return <TTTGame />;
}
