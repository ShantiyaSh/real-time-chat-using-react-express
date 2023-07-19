import { dirname, join } from "path";
import { fileURLToPath } from "url";
import kenx from "knex";

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = kenx({
  client: "sqlite3",
  connection: {
    filename: join(__dirname, "chat.db"),
    flags: ["OPEN_READWRITE"],
  },
  useNullAsDefault: true,
});
export default db;
