import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./app/db/schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: "./games.db",
    },
    verbose: true,
    strict: true,
});
