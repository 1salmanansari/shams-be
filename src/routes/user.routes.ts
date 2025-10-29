import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import {
    registerUser,
    loginUser,
    getUsers,
    getUser,
    updateUser,
    hardDelete,
    softDelete,
    getOverview,
    ping
} from "../controllers/user.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.get("/ping", ping);
router.post("/register", registerUser);
// @ts-ignore
router.post("/login", loginUser);
router.put("/:id", protect, roleAuth([ROLES.ADMIN]), updateUser);
router.patch("/:id", protect, roleAuth([ROLES.PUBLIC]), softDelete);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN]), hardDelete);
router.get("/overview", protect, roleAuth([ROLES.ADMIN]), getOverview);
router.get("/:id", protect, roleAuth([ROLES.ADMIN]), getUser);
router.get("/", protect, roleAuth([ROLES.ADMIN]), getUsers);

export default router;
