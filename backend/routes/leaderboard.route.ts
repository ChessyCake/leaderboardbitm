import { Router } from "express";
import { getLeaderboard } from "../controller/leaderboard.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();
router.get("/",authMiddleware, getLeaderboard);

export default router;