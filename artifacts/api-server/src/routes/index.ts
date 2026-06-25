import { Router, type IRouter } from "express";
import healthRouter from "./health";
import companyRouter from "./company";
import customersRouter from "./customers";
import productsRouter from "./products";
import invoicesRouter from "./invoices";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/company", companyRouter);
router.use("/customers", customersRouter);
router.use("/products", productsRouter);
router.use("/invoices", invoicesRouter);
router.use("/dashboard", dashboardRouter);

export default router;
