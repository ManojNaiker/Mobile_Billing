import { Router } from "express";
import { db } from "@workspace/db";
import { invoicesTable, companyTable } from "@workspace/db";
import { eq, ilike, or, desc, sql } from "drizzle-orm";

const router = Router();

function amountInWords(amount: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertBelowThousand(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "") + " ";
    return ones[Math.floor(n / 100)] + " Hundred " + convertBelowThousand(n % 100);
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  if (rupees === 0 && paise === 0) return "Rupees Zero Only";

  let result = "Rupees ";
  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const remainder = rupees % 1000;

  if (crore > 0) result += convertBelowThousand(crore) + "Crore ";
  if (lakh > 0) result += convertBelowThousand(lakh) + "Lakh ";
  if (thousand > 0) result += convertBelowThousand(thousand) + "Thousand ";
  if (remainder > 0) result += convertBelowThousand(remainder);

  if (paise > 0) result += "and " + convertBelowThousand(paise) + "Paise ";
  result += "Only";
  return result.replace(/\s+/g, " ").trim();
}

// GET /api/invoices/next-number
router.get("/next-number", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const company = await db.select().from(companyTable).limit(1);
    const prefix = company[0]?.invoice_prefix || "INV";
    const counter = company[0]?.invoice_counter || 1;
    const invoice_number = `${prefix}-${String(counter).padStart(4, "0")}`;
    return res.json({ invoice_number });
  } catch (err) {
    req.log.error({ err }, "Failed to get next invoice number");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/invoices
router.get("/", async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const page = parseInt(req.query.page as string || "1");
    const limit = parseInt(req.query.limit as string || "50");
    const offset = (page - 1) * limit;

    let query = db.select().from(invoicesTable).$dynamic();

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(invoicesTable.invoice_number, `%${search}%`),
          ilike(invoicesTable.buyer_name, `%${search}%`)
        )
      );
    }
    if (status && status !== "all") {
      conditions.push(eq(invoicesTable.status, status));
    }

    const allRows = await db.select().from(invoicesTable).orderBy(desc(invoicesTable.created_at));
    let filtered = allRows;
    if (search) {
      filtered = filtered.filter(r =>
        r.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        r.buyer_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status && status !== "all") {
      filtered = filtered.filter(r => r.status === status);
    }
    const total = filtered.length;
    const data = filtered.slice(offset, offset + limit);

    return res.json({ data, total, page, limit });
  } catch (err) {
    req.log.error({ err }, "Failed to list invoices");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/invoices
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (!body.amount_in_words) {
      body.amount_in_words = amountInWords(body.grand_total || 0);
    }

    const [created] = await db.insert(invoicesTable).values(body).returning();

    // Atomically increment company counter
    await db.execute(sql`UPDATE company SET invoice_counter = COALESCE(invoice_counter, 1) + 1`);

    return res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to create invoice");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/invoices/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, id));
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    return res.json(invoice);
  } catch (err) {
    req.log.error({ err }, "Failed to get invoice");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/invoices/:id
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    if (!body.amount_in_words) {
      body.amount_in_words = amountInWords(body.grand_total || 0);
    }
    const [updated] = await db
      .update(invoicesTable)
      .set({ ...body, updated_at: new Date() })
      .where(eq(invoicesTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Invoice not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update invoice");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/invoices/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(invoicesTable).where(eq(invoicesTable.id, id));
    return res.json({ success: true, message: "Invoice deleted" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete invoice");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/invoices/:id/send-email
router.post("/:id/send-email", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { to_email } = req.body as { to_email: string };

    if (!to_email) {
      return res.status(400).json({ success: false, error: "to_email is required" });
    }

    const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, id));
    if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found" });

    const companyRows = await db.select().from(companyTable).limit(1);
    const company = companyRows[0];

    if (!company?.smtp_host || !company?.smtp_user || !company?.smtp_pass) {
      return res.status(400).json({ success: false, error: "SMTP not configured. Please fill SMTP settings in Company Profile > Email Settings." });
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: company.smtp_host,
      port: parseInt(company.smtp_port || "587"),
      secure: company.smtp_secure === "true",
      auth: {
        user: company.smtp_user,
        pass: company.smtp_pass,
      },
    });

    const items = (invoice.items as any[]).map((item: any, i: number) =>
      `<tr>
        <td style="padding:6px 8px;border:1px solid #ddd">${i + 1}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${item.description}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${item.quantity}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">₹${Number(item.rate).toFixed(2)}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">₹${Number(item.total || item.amount || 0).toFixed(2)}</td>
      </tr>`
    ).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#222">
        <h2 style="color:#4f46e5">Invoice ${invoice.invoice_number}</h2>
        <p>Dear ${invoice.buyer_name},</p>
        <p>Please find your invoice details below.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:6px 8px;border:1px solid #ddd;text-align:left">#</th>
              <th style="padding:6px 8px;border:1px solid #ddd;text-align:left">Description</th>
              <th style="padding:6px 8px;border:1px solid #ddd">Qty</th>
              <th style="padding:6px 8px;border:1px solid #ddd;text-align:right">Rate</th>
              <th style="padding:6px 8px;border:1px solid #ddd;text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>${items}</tbody>
        </table>
        <table style="margin-left:auto;border-collapse:collapse">
          <tr><td style="padding:4px 12px">Subtotal</td><td style="padding:4px 12px;text-align:right">₹${Number(invoice.subtotal || 0).toFixed(2)}</td></tr>
          ${invoice.cgst_total ? `<tr><td style="padding:4px 12px">CGST</td><td style="padding:4px 12px;text-align:right">₹${Number(invoice.cgst_total).toFixed(2)}</td></tr>` : ""}
          ${invoice.sgst_total ? `<tr><td style="padding:4px 12px">SGST</td><td style="padding:4px 12px;text-align:right">₹${Number(invoice.sgst_total).toFixed(2)}</td></tr>` : ""}
          ${invoice.igst_total ? `<tr><td style="padding:4px 12px">IGST</td><td style="padding:4px 12px;text-align:right">₹${Number(invoice.igst_total).toFixed(2)}</td></tr>` : ""}
          <tr style="font-weight:bold;font-size:16px"><td style="padding:8px 12px;border-top:2px solid #4f46e5">Total</td><td style="padding:8px 12px;border-top:2px solid #4f46e5;text-align:right;color:#4f46e5">₹${Number(invoice.grand_total || 0).toFixed(2)}</td></tr>
        </table>
        <p style="margin-top:24px;color:#666;font-size:13px">
          ${company.name}<br/>
          ${company.phone ? `Phone: ${company.phone}<br/>` : ""}
          ${company.email ? `Email: ${company.email}` : ""}
        </p>
      </div>`;

    await transporter.sendMail({
      from: `"${company.smtp_from_name || company.name}" <${company.smtp_user}>`,
      to: to_email,
      subject: `Invoice ${invoice.invoice_number} from ${company.name}`,
      html,
    });

    return res.json({ success: true, message: `Invoice sent to ${to_email}` });
  } catch (err) {
    req.log.error({ err }, "Failed to send invoice email");
    return res.status(500).json({ success: false, error: "Failed to send email. Check SMTP settings." });
  }
});

// POST /api/invoices/:id/duplicate
router.post("/:id/duplicate", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [original] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, id));
    if (!original) return res.status(404).json({ error: "Invoice not found" });

    // Get next invoice number
    const company = await db.select().from(companyTable).limit(1);
    const prefix = company[0]?.invoice_prefix || "INV";
    const counter = company[0]?.invoice_counter || 1;
    const newNumber = `${prefix}-${String(counter).padStart(4, "0")}`;

    const today = new Date().toISOString().split("T")[0];
    const { id: _id, created_at, updated_at, invoice_number, ...rest } = original;

    const [duplicated] = await db.insert(invoicesTable).values({
      ...rest,
      invoice_number: newNumber,
      invoice_date: today,
      status: "draft",
    }).returning();

    // Increment company counter
    if (company.length > 0) {
      await db.update(companyTable)
        .set({ invoice_counter: counter + 1 })
        .where(eq(companyTable.id, company[0].id));
    }

    return res.status(201).json(duplicated);
  } catch (err) {
    req.log.error({ err }, "Failed to duplicate invoice");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
