import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { getOngoingGames } from "~/lib/game-db";

export async function loader() {
    const games = await getOngoingGames({});
    return json({ games });
}

export default function ContinueGamePage() {
    const { games } = useLoaderData<typeof loader>();
    return (
        <div className="flex w-full h-full justify-center">
            <div className="flex flex-col space-y-4 justify-center mx-10">
                {games.map((g) => (
                    <Button asChild key={g.displayId} variant="outline">
                        <Link to={`/game/${g.displayId}`}>
                            {`Game on ${g.boardDimensions}x${g.boardDimensions} between ${g.player1Name} and ${g.player2Name}`}
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    );
}
