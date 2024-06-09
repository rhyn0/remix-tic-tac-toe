import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "~/db/schema";
const client = new Database("games.db", { fileMustExist: false });
// performance enhancer
// More info: https://github.com/WiseLibs/better-sqlite3?tab=readme-ov-file#usage
client.pragma("journal_mode = WAL");
const db = drizzle(client, { schema });

export { db };
