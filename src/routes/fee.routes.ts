import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import * as FeeController from "../controllers/fee.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN]), FeeController.add);
router.get("/", protect, roleAuth([ROLES.ADMIN]), FeeController.get);
router.get("/:id", protect, roleAuth([ROLES.ADMIN]), FeeController.getDetail);
router.put("/:id", protect, roleAuth([ROLES.ADMIN]), FeeController.set);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN]), FeeController.remove);

export default router;
