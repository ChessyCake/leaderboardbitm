import { Router } from "express";
import { getArchive } from "../controller/archive.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();
router.get("/", authMiddleware, getArchive);

export default router;