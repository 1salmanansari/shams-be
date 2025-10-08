import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import {
    addCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
} from "../controllers/customer.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), addCustomer);
router.get("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getCustomers);
router.get("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getCustomer);
router.put("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), updateCustomer);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), deleteCustomer);

export default router;
