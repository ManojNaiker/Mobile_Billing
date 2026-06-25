import { Router } from "express";
import { db } from "@workspace/db";
import { invoicesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

// GET /api/dashboard/summary
router.get("/summary", async (req, res) => {
  try {
    const allInvoices = await db.select().from(invoicesTable);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const total_invoices = allInvoices.length;

    const monthlyInvoices = allInvoices.filter(inv => {
      const d = new Date(inv.created_at!);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const monthly_revenue = monthlyInvoices.reduce((sum, inv) => sum + (inv.grand_total || 0), 0);

    const tax_collected = allInvoices.reduce((sum, inv) =>
      sum + (inv.cgst_total || 0) + (inv.sgst_total || 0) + (inv.igst_total || 0), 0);

    const avg_invoice_value = total_invoices > 0
      ? allInvoices.reduce((sum, inv) => sum + (inv.grand_total || 0), 0) / total_invoices
      : 0;

    return res.json({
      total_invoices,
      monthly_revenue: Math.round(monthly_revenue * 100) / 100,
      tax_collected: Math.round(tax_collected * 100) / 100,
      avg_invoice_value: Math.round(avg_invoice_value * 100) / 100,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/dashboard/recent-invoices
router.get("/recent-invoices", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(invoicesTable)
      .orderBy(desc(invoicesTable.created_at))
      .limit(10);
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to get recent invoices");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/dashboard/monthly-revenue
router.get("/monthly-revenue", async (req, res) => {
  try {
    const allInvoices = await db.select().from(invoicesTable);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const now = new Date();
    const result = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = date.getMonth();
      const y = date.getFullYear();

      const revenue = allInvoices
        .filter(inv => {
          const d = new Date(inv.created_at!);
          return d.getMonth() === m && d.getFullYear() === y;
        })
        .reduce((sum, inv) => sum + (inv.grand_total || 0), 0);

      result.push({
        month: `${months[m]} ${y}`,
        revenue: Math.round(revenue * 100) / 100,
      });
    }

    return res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get monthly revenue");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
