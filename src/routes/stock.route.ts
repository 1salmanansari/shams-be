import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import {
    addStock,
    getStock,
    getStockItem,
    getStockDetails,
    setInventory,
    updateStock,
    deleteStock,
} from "../controllers/stock.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), addStock);
router.get("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getStock);
router.get("/:id/statement", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getStockDetails);
router.get("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getStockItem);
router.patch("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), setInventory);
router.put("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), updateStock);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), deleteStock);

export default router;
