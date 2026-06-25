import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router = Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    let rows;
    if (search) {
      rows = await db
        .select()
        .from(productsTable)
        .where(ilike(productsTable.name, `%${search}%`))
        .orderBy(productsTable.created_at);
    } else {
      rows = await db.select().from(productsTable).orderBy(productsTable.created_at);
    }
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const [created] = await db.insert(productsTable).values(req.body).returning();
    return res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db
      .update(productsTable)
      .set(req.body)
      .where(eq(productsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Product not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    return res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
