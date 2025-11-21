// src/routes/index.ts
import userRoutes from "../routes/user.routes";
import schoolRoutes from "../routes/school.routes";
import clientRoutes from "../routes/customer.route";
import stockRoutes from "../routes/stock.route";
import accountRoutes from "../routes/account.route";
import studentRoutes from "../routes/student.routes";
import classesRouter from "../routes/class.routes";
import feeRoutes from "../routes/fee.routes";
import paymentRoutes from "../routes/payment.route";

import { Router } from "express";
const router = Router();

router.use("/users", userRoutes);
router.use("/schools", schoolRoutes);
router.use("/customers", clientRoutes);
router.use("/stock", stockRoutes);
router.use("/transaction", accountRoutes);
router.use("/students", studentRoutes);
router.use("/classes", classesRouter);
router.use("/fees", feeRoutes);
router.use("/payments", paymentRoutes);

export default router;
