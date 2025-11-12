import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import * as StudentController from "../controllers/student.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN]), StudentController.create);
router.get("/", protect, roleAuth([ROLES.PUBLIC, ROLES.ADMIN]), StudentController.fetch);
router.get("/:id", protect, roleAuth([ROLES.PUBLIC, ROLES.ADMIN]), StudentController.fetchDetail);
router.put("/:id", protect, roleAuth([ROLES.ADMIN]), StudentController.update);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN]), StudentController.omit);

export default router;
