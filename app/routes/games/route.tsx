import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getOngoingGames } from "~/lib/game-db";

export async function loader() {
    const games = await getOngoingGames({});
    return json({ games });
}

export default function ContinueGamePage() {
    const { games } = useLoaderData<typeof loader>();
    return (
        <main>
            <h1>ContinueGamePage</h1>
            <div>
                {games.map((g) => (
                    <div key={g.displayId}>
                        {`Game on ${g.boardDimensions}x${g.boardDimensions} between ${g.player1Name} and ${g.player2Name}`}
                    </div>
                ))}
            </div>
        </main>
    );
}
