import express from "express";
import { protect } from "@/middleware/auth.middleware";
import {
    registerUser,
    loginUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} from "@/controllers/user.controller";

const router = express.Router();

router.post("/register", registerUser);
// @ts-ignore
router.post("/login", loginUser);
router.get("/", protect, getUsers);
router.get("/:id", protect, getUser);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
