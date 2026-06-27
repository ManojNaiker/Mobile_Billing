---
name: SQLite migration quirks
description: Non-obvious pitfalls when using better-sqlite3 with pnpm workspaces + esbuild
---

## Rules

1. **better-sqlite3 must be a direct dep of @workspace/api-server** — even though @workspace/db already declares it. pnpm does not hoist by default, so the bundled api-server dist cannot find it at runtime unless it's listed in api-server's own package.json.

2. **DB file path must use `import.meta.url`, not `process.cwd()`** — `process.cwd()` changes depending on which directory starts the process (api-server vs lib/db). Use `path.dirname(fileURLToPath(import.meta.url))` in lib/db/src/index.ts and navigate up to workspace root with `../../../`.

3. **drizzle.config.ts uses `__dirname`** — drizzle-kit runs from lib/db directory, so `path.resolve(__dirname, "../../")` correctly reaches workspace root. Create the data/ dir there if it doesn't exist.

4. **`ilike` → `like`** — SQLite does not support `ilike`. Replace all `ilike` imports and usages in routes with `like`.

5. **`boolean` → `integer({mode: 'boolean'})`** and **`jsonb` → `text({mode: 'json'})`** — SQLite type mappings in drizzle-orm/sqlite-core.

6. **`timestamp` → `text` with `sql\`(CURRENT_TIMESTAMP)\`` default** — SQLite stores dates as text. When setting updated_at manually, use `new Date().toISOString()`.

7. **`better-sqlite3` in pnpm-workspace.yaml `onlyBuiltDependencies`** — must be added or pnpm blocks its postinstall script.

**Why:** These were all discovered during the PostgreSQL → SQLite migration for BillEase.
