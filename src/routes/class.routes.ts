import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import {
    createClass,
    getClasses,
    getClass,
    updateClass,
    deleteClass,
} from "../controllers/class.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN]), createClass);
router.get("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getClasses);
router.get("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), getClass);
router.put("/:id", protect, roleAuth([ROLES.ADMIN]), updateClass);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN]), deleteClass);

export default router;
