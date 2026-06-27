import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  code: text("code"),
  hsn_sac: text("hsn_sac"),
  unit: text("unit").notNull().default("PCS"),
  rate: real("rate").notNull().default(0),
  tax_percent: real("tax_percent").notNull().default(18),
  created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, created_at: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
