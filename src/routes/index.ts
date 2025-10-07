// src/routes/index.ts
import userRoutes from "../routes/user.routes";
import schoolRoutes from "../routes/school.routes";
import clientRoutes from "../routes/customer.route";
import stockRoutes from "../routes/stock.route";

import { Router } from "express";
const router = Router();

router.use("/users", userRoutes);
router.use("/schools", schoolRoutes);
router.use("/customers", clientRoutes);
router.use("/stock", stockRoutes);

export default router;
