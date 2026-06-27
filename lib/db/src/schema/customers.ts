import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customersTable = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  gstin: text("gstin"),
  state_name: text("state_name"),
  state_code: text("state_code"),
  email: text("email"),
  phone: text("phone"),
  created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, created_at: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
