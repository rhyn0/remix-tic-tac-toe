import { createCookieSessionStorage } from "@remix-run/node";
import { isTheme } from "~/components/providers/theme";
import { Theme } from "~/types";

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__remix-themes",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secrets: ["s3cr3t"],
        secure: process.env.NODE_ENV === "production",
    },
});

async function getThemeSession(request: Request) {
    const session = await sessionStorage.getSession(
        request.headers.get("Cookie"),
    );
    return {
        getTheme: () => {
            const themeValue = session.get("theme");
            return isTheme(themeValue) ? themeValue : null;
        },
        setTheme: (theme: Theme) => session.set("theme", theme),
        commit: () => sessionStorage.commitSession(session),
    };
}

export { getThemeSession };

export default sessionStorage;
