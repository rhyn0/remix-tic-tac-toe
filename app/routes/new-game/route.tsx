import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import {
    Form,
    isRouteErrorResponse,
    json,
    useActionData,
    useNavigate,
    useRouteError,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { X, Circle } from "lucide-react";
import { NewGameZ } from "~/types";
import { createNewGame } from "~/lib/game-db";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const gameData = NewGameZ.safeParse(Object.fromEntries(formData));
    if (!gameData.success) {
        const perFieldErrors = gameData.error.errors.reduce(
            (errors: Record<string, string>, issue) => {
                errors[issue.path[0]] = issue.message;
                return errors;
            },
            {},
        );
        return json(
            {
                message: "Invalid Game details submitted.",
                detail: perFieldErrors,
            },
            { status: 400 },
        );
    }
    const id = await createNewGame(gameData.data);
    console.log("🚀 ~ action ~ id:", id);
    if (!id) {
        throw new Response("Internal Server Error", { status: 500 });
    }
    return redirect(`/game/${id}`);
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

export default function NewGameForm() {
    const navigate = useNavigate();
    const actionData = useActionData<typeof action>();

    return (
        <main className="w-1/2 h-2/3 mx-auto flex justify-center">
            <Form method="post" id="new-game-form" className="space-y-4">
                {actionData?.message ? (
                    <span className="text-red-500">{actionData.message}</span>
                ) : null}
                <div className="flex flex-col space-y-5">
                    <Label>
                        <span className="flex flex-row">
                            <X />
                            Player 1 Name
                        </span>
                        <Input
                            name="player1Name"
                            type="text"
                            placeholder="Player Name"
                        />
                        {actionData?.detail ? (
                            <span className="text-red-500">
                                {actionData.detail.player1Name ?? ""}
                            </span>
                        ) : null}
                    </Label>
                    <Label>
                        <span className="flex flex-row">
                            <Circle />
                            Player 2 Name
                        </span>
                        <Input
                            name="player2Name"
                            type="text"
                            placeholder="Player Name"
                        />
                        {actionData?.detail ? (
                            <span className="text-red-500">
                                {actionData.detail.player2Name ?? ""}
                            </span>
                        ) : null}
                    </Label>
                    <Label>
                        <span>Size of Board (Locked at 3)</span>
                        <Input
                            name="boardDimensions"
                            type="number"
                            defaultValue="3"
                            onChange={(e) => {
                                e.target.value = "3";
                            }}
                        />
                        {actionData?.detail ? (
                            <span className="text-red-500">
                                {actionData.detail.boardDimensions ?? ""}
                            </span>
                        ) : null}
                    </Label>
                </div>
                <div>
                    <Button type="submit">Submit</Button>
                    <Button
                        variant="destructive"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                </div>
            </Form>
        </main>
    );
}
