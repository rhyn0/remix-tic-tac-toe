import { useFetcher } from "@remix-run/react";
import React, { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { Theme } from "~/types";

export const themes = ["light", "dark"] as const;
function isTheme(value: unknown): value is Theme {
    return typeof value === "string" && themes.includes(value as Theme);
}

export type ThemeContextType = [
    Theme | null,
    Dispatch<SetStateAction<Theme | null>>,
];
// media query
const prefersDarkMQ = "(prefers-color-scheme: dark)";
const getPreferredTheme = () =>
    window.matchMedia(prefersDarkMQ).matches ? "dark" : "light";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({
    children,
    specifiedTheme,
}: {
    children: ReactNode;
    specifiedTheme: Theme | null;
}) {
    const [theme, setTheme] = useState<Theme | null>(() => {
        if (specifiedTheme) {
            if (themes.includes(specifiedTheme)) {
                return specifiedTheme;
            }
            return null;
        }
        // there's no way for us to know what the theme should be in this context
        // the client will have to figure it out before hydration.
        if (typeof window !== "object") {
            return null;
        }

        return getPreferredTheme();
    });
    const persistTheme = useFetcher();

    // TODO: remove this when persistTheme is memoized properly
    const persistThemeRef = React.useRef(persistTheme);
    React.useEffect(() => {
        persistThemeRef.current = persistTheme;
    }, [persistTheme]);

    const mountRun = React.useRef(false);

    React.useEffect(() => {
        if (!mountRun.current) {
            mountRun.current = true;
            return;
        }
        if (!theme) {
            return;
        }

        persistThemeRef.current.submit(
            { theme },
            { action: "action/set-theme", method: "post" },
        );
    }, [theme]);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia(prefersDarkMQ);
        const handleChange = () => {
            setTheme(mediaQuery.matches ? "dark" : "light");
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            {children}
        </ThemeContext.Provider>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
    ? 'dark'
    : 'light';
  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (!themeAlreadyApplied) {
      cl.add(theme);
  }
})();
const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  }
})();
`;
function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: Theme | null }) {
    const [theme] = useTheme();
    return ssrTheme ? null : (
        <>
            <meta
                name="color-scheme"
                content={theme === "light" ? "light dark" : "dark light"}
            />
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Only way to avoid flashing */}
            <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
        </>
    );
}

export {
    ThemeContext,
    ThemeProvider,
    useTheme,
    NonFlashOfWrongThemeEls,
    isTheme,
};
