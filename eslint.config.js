// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintReact from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        plugins: {
            react: eslintReact,
        },
        rules: {
            ...eslintReact.configs.recommended.rules,
        },
        settings: {
            react: {
                version: "detect", // You can add this if you get a warning about the React version when you lint
            },
        },
    },
    {
        plugins: {
            "react-hooks": hooksPlugin,
        },
        // @ts-expect-error - react hook library does not type like this yet
        rules: hooksPlugin.configs.recommended.rules,
    },
);
