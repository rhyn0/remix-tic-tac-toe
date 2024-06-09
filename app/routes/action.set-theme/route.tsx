import {
    type ActionFunctionArgs,
    type LoaderFunction,
    json,
    redirect,
} from "@remix-run/node";
import { isTheme } from "~/components/providers/theme";
import { getThemeSession } from "~/utils/theme-session.server";
export const action = async ({ request }: ActionFunctionArgs) => {
    const { setTheme, commit } = await getThemeSession(request);
    const requestText = await request.text();
    const form = new URLSearchParams(requestText);
    const theme = form.get("theme");

    if (!isTheme(theme)) {
        return json({
            success: false,
            message: `theme value of ${theme} is not a valid theme`,
        });
    }
    setTheme(theme);
    return json(
        { success: true },
        {
            headers: {
                "set-cookie": await commit(),
            },
        },
    );
};

export const loader: LoaderFunction = () => redirect("/", { status: 404 });
