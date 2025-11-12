import express from "express";
import { protect, roleAuth } from "../middleware/auth.middleware";
import { create, fetch, fetchDetail, update, remove, } from "../controllers/school.controller";
import { ROLES } from "../utils/constants";

const router = express.Router();

router.post("/", protect, roleAuth([ROLES.ADMIN]), create);
router.get("/", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), fetch);
router.get("/:id", protect, roleAuth([ROLES.ADMIN, ROLES.PUBLIC]), fetchDetail);
router.put("/:id", protect, roleAuth([ROLES.ADMIN]), update);
router.delete("/:id", protect, roleAuth([ROLES.ADMIN]), remove);

export default router;
