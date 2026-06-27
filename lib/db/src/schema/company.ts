import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companyTable = pgTable("company", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  gstin: text("gstin"),
  state_name: text("state_name"),
  state_code: text("state_code"),
  email: text("email").notNull(),
  phone: text("phone"),
  bank_name: text("bank_name"),
  account_number: text("account_number"),
  ifsc_code: text("ifsc_code"),
  branch_name: text("branch_name"),
  upi_id: text("upi_id"),
  logo_url: text("logo_url"),
  declaration_text: text("declaration_text"),
  authorized_signatory: text("authorized_signatory"),
  invoice_prefix: text("invoice_prefix"),
  invoice_counter: integer("invoice_counter").default(1),
  invoice_format: text("invoice_format").default("format1"),
  watermark_text: text("watermark_text"),
  watermark_font: text("watermark_font"),
  watermark_opacity: text("watermark_opacity"),
  watermark_color: text("watermark_color"),
  watermark_size: text("watermark_size"),
  smtp_host: text("smtp_host"),
  smtp_port: text("smtp_port"),
  smtp_user: text("smtp_user"),
  smtp_pass: text("smtp_pass"),
  smtp_from_name: text("smtp_from_name"),
  smtp_secure: text("smtp_secure"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companyTable).omit({ id: true, created_at: true, updated_at: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companyTable.$inferSelect;
