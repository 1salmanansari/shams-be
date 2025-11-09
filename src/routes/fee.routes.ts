import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import * as FeeController from "../controllers/fee.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN]), FeeController.createFeeRecord);
router.get("/", protect, roleAuth([ROLES.ADMIN]), FeeController.getAll);
router.post("/:studentId/:academicYear/payment", protect, roleAuth([ROLES.ADMIN, ROLES.TEACHER]), FeeController.addPayment);
router.get("/:studentId/:academicYear", protect, roleAuth([ROLES.ADMIN, ROLES.TEACHER]), FeeController.getFeeSummary);
router.post("/reset", protect, roleAuth([ROLES.ADMIN]), FeeController.resetFees);

export default router;
