import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import {
    addTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    editTransaction,
    deleteTransation,
} from "../controllers/account.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), addTransaction);
router.get("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getTransactions);
router.get("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getTransaction);
router.patch("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), editTransaction);
router.put("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), updateTransaction);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), deleteTransation);

export default router;
