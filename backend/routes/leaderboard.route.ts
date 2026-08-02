import { Router } from "express";
import { getLeaderboard } from "../controller/leaderboard.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { totalActive } from "../controller/instance.controller";

const router = Router();

router.get("/",authMiddleware, getLeaderboard);
router.get("/totalActive",authMiddleware,  totalActive)

export default router;