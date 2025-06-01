import express from "express";
import { protect } from "@/middleware/auth.middleware";
import {
    createSchool,
    getSchools,
    getSchool,
    updateSchool,
    deleteSchool,
} from "@/controllers/school.controller";

const router = express.Router();

router.post("/", protect, createSchool);
router.get("/", protect, getSchools);           // ✅ Fixed
router.get("/:id", protect, getSchool);         // ✅ Fixed
router.put("/:id", protect, updateSchool);
router.delete("/:id", protect, deleteSchool);

export default router;
