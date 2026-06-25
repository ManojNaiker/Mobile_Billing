import { Router } from "express";
import { db } from "@workspace/db";
import { companyTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/company
router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(companyTable).limit(1);
    if (rows.length === 0) {
      // Return empty company profile
      return res.json({
        id: 0,
        name: "",
        address: "",
        gstin: null,
        state_name: null,
        state_code: null,
        email: "",
        phone: null,
        bank_name: null,
        account_number: null,
        ifsc_code: null,
        branch_name: null,
        logo_url: null,
        declaration_text: null,
        authorized_signatory: null,
        invoice_prefix: "INV",
        invoice_counter: 1,
        watermark_text: null,
        watermark_font: null,
        watermark_opacity: null,
        watermark_color: null,
        watermark_size: null,
        smtp_host: null,
        smtp_port: null,
        smtp_user: null,
        smtp_pass: null,
        smtp_from_name: null,
        smtp_secure: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    return res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get company");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/company
router.put("/", async (req, res) => {
  try {
    const body = req.body;
    const existing = await db.select().from(companyTable).limit(1);
    if (existing.length === 0) {
      const [created] = await db
        .insert(companyTable)
        .values({ ...body, updated_at: new Date() })
        .returning();
      return res.json(created);
    } else {
      const [updated] = await db
        .update(companyTable)
        .set({ ...body, updated_at: new Date() })
        .where(eq(companyTable.id, existing[0].id))
        .returning();
      return res.json(updated);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update company");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
