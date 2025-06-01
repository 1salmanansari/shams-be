import express from "express";
import { protect, roleAuth } from "@/middleware/auth.middleware";
import {
    createSchool,
    getSchools,
    getSchool,
    updateSchool,
    deleteSchool,
} from "@/controllers/school.controller";
import { ROLES } from "@/utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN]), createSchool);
router.get("/", protect, roleAuth([ROLES.PUBLIC]), getSchools);
router.get("/:id", protect, roleAuth([ROLES.PUBLIC]), getSchool);
router.put("/:id", protect, roleAuth([ROLES.ADMIN]), updateSchool);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN]), deleteSchool);

export default router;
