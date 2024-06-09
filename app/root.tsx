import {
    json,
    type LinksFunction,
    type LoaderFunctionArgs,
} from "@remix-run/node";
import type React from "react";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/styles/tailwind.css?url";
import {
    NonFlashOfWrongThemeEls,
    ThemeProvider,
    useTheme,
} from "./components/providers/theme";
import { cn } from "./lib/utils";
import Header from "./components/header";
import { getThemeSession } from "~/utils/theme-session.server";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const themeSession = await getThemeSession(request);
    return json({ theme: themeSession.getTheme() });
};

export function Layout({ children }: { children: React.ReactNode }) {
    const { theme } = useLoaderData<typeof loader>();
    return (
        <html lang="en" className={cn(theme)}>
            <ThemeProvider specifiedTheme={theme}>
                <head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <Meta />
                    <Links />
                </head>
                <body>
                    {children}
                    <ScrollRestoration />
                    <NonFlashOfWrongThemeEls ssrTheme={theme} />
                    <Scripts />
                </body>
            </ThemeProvider>
        </html>
    );
}

export default function App() {
    const [theme] = useTheme();
    return (
        <>
            <Header />
            <main className={cn(theme)}>
                <Outlet />
            </main>
        </>
    );
}
