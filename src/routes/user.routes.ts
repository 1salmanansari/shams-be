import express from "express";
import { protect, roleAuth } from "@/middleware/auth.middleware";
import {
    registerUser,
    loginUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} from "@/controllers/user.controller";
import { ROLES } from "@/utils/constants";

const router = express.Router();

router.post("/register", registerUser);
// @ts-ignore
router.post("/login", loginUser);
router.get("/", protect, roleAuth([ROLES.ADMIN]), getUsers);
router.get("/:id", protect, roleAuth([ROLES.ADMIN]), getUser);
router.put("/:id", protect, roleAuth([ROLES.ADMIN]), updateUser);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN]), deleteUser);

export default router;
