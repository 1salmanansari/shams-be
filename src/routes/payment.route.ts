import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import { ROLES } from "../utils/constants";
import {
    addPayment,
    getPayments,
    getPayment,
    updatePayment,
    deletePayment,
} from "../controllers/payment.controller";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), addPayment);
router.get("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getPayments);
router.get("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getPayment);
router.put("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), updatePayment);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), deletePayment);

export default router;
