import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function HomeScreen() {
    return (
        <main className="mx-auto flex flex-col w-2/3 h-1/2 bg-background">
            <h1 className="text-2xl text-center mb-10">
                Welcome to Tic Tac Toe
            </h1>
            <div className="flex flex-col justify-center w-1/2 mx-auto space-y-2">
                <Button asChild variant="link" className="bg-slate-500">
                    <Link to="/new-game">New Game</Link>
                </Button>
                <Button asChild variant="link" className="bg-slate-500">
                    <Link to="/games">Continue Game</Link>
                </Button>
            </div>
        </main>
    );
}
