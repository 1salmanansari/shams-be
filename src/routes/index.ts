// src/routes/index.ts
import userRoutes from "../routes/user.routes";
import schoolRoutes from "../routes/school.routes";

import { Router } from "express";
const router = Router();

router.use("/users", userRoutes);
router.use("/schools", schoolRoutes);

export default router;
