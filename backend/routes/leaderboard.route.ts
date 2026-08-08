import { Router } from "express";
import { getLeaderboard } from "../controller/leaderboard.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { botMiddleware } from "../middlewares/dc-bot.middleware";

const router = Router();
router.get("/", authMiddleware, getLeaderboard);

export default router;