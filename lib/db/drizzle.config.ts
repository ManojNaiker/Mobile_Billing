import { defineConfig } from "drizzle-kit";
import path from "path";
import fs from "fs";

const workspaceRoot = path.resolve(__dirname, "../../");
const dbDir = path.join(workspaceRoot, "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, "billease.db");

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
