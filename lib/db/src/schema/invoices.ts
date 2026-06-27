import { pgTable, serial, text, doublePrecision, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const invoicesTable = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoice_number: text("invoice_number").notNull().unique(),
  invoice_date: text("invoice_date").notNull(),
  e_way_bill_number: text("e_way_bill_number"),
  delivery_note: text("delivery_note"),
  payment_terms: text("payment_terms"),
  supplier_ref: text("supplier_ref"),
  other_ref: text("other_ref"),
  buyer_order_number: text("buyer_order_number"),
  order_date: text("order_date"),
  buyer_name: text("buyer_name").notNull(),
  buyer_address: text("buyer_address").notNull(),
  buyer_gstin: text("buyer_gstin"),
  buyer_phone: text("buyer_phone"),
  buyer_state_name: text("buyer_state_name"),
  buyer_state_code: text("buyer_state_code"),
  dispatch_doc_number: text("dispatch_doc_number"),
  delivery_note_date: text("delivery_note_date"),
  dispatched_through: text("dispatched_through"),
  destination: text("destination"),
  terms_of_delivery: text("terms_of_delivery"),
  subtotal: doublePrecision("subtotal").notNull().default(0),
  discount_amount: doublePrecision("discount_amount").notNull().default(0),
  taxable_value: doublePrecision("taxable_value").notNull().default(0),
  cgst_total: doublePrecision("cgst_total").notNull().default(0),
  sgst_total: doublePrecision("sgst_total").notNull().default(0),
  igst_total: doublePrecision("igst_total").notNull().default(0),
  grand_total: doublePrecision("grand_total").notNull().default(0),
  amount_in_words: text("amount_in_words").notNull().default(""),
  payment_mode: text("payment_mode").notNull().default("cash"),
  invoice_format: text("invoice_format").default("format1"),
  status: text("status").notNull().default("draft"),
  include_gst: boolean("include_gst").notNull().default(true),
  items: jsonb("items").notNull().default([]),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoicesTable).omit({ id: true, created_at: true, updated_at: true });
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoicesTable.$inferSelect;
