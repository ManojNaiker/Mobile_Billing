import { Router } from "express";
import { db } from "@workspace/db";
import { customersTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";

const router = Router();

// GET /api/customers
router.get("/", async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    let rows;
    if (search) {
      rows = await db
        .select()
        .from(customersTable)
        .where(
          or(
            ilike(customersTable.name, `%${search}%`),
            ilike(customersTable.gstin, `%${search}%`),
            ilike(customersTable.email, `%${search}%`)
          )
        )
        .orderBy(customersTable.created_at);
    } else {
      rows = await db.select().from(customersTable).orderBy(customersTable.created_at);
    }
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list customers");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/customers
router.post("/", async (req, res) => {
  try {
    const [created] = await db.insert(customersTable).values(req.body).returning();
    return res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to create customer");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/customers/:id
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db
      .update(customersTable)
      .set(req.body)
      .where(eq(customersTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Customer not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update customer");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/customers/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(customersTable).where(eq(customersTable.id, id));
    return res.json({ success: true, message: "Customer deleted" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete customer");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
