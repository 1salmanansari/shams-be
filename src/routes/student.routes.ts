import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import * as StudentController from "../controllers/student.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN]), StudentController.createStudent);
router.get("/", protect, roleAuth([ROLES.PUBLIC, ROLES.ADMIN]), StudentController.getStudents);
router.get("/:id/detail", protect, roleAuth([ROLES.PUBLIC, ROLES.ADMIN]), StudentController.getStudentDetail);
router.get("/:id", protect, roleAuth([ROLES.PUBLIC, ROLES.ADMIN]), StudentController.getStudent);
router.put("/:id", protect, roleAuth([ROLES.ADMIN]), StudentController.updateStudent);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN]), StudentController.deleteStudent);

export default router;
