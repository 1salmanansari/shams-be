// src/routes/index.ts
import userRoutes from "../routes/user.routes";
import schoolRoutes from "../routes/school.routes";
import studentRoutes from "../routes/student.routes";
import classesRouter from "../routes/class.routes";
import feeRoutes from "../routes/fee.routes";

import { Router } from "express";
const router = Router();

router.use("/users", userRoutes);
router.use("/schools", schoolRoutes);
router.use("/students", studentRoutes);
router.use("/classes", classesRouter);
router.use("/fees", feeRoutes);

export default router;
