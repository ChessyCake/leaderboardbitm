import { Router } from "express";
import { botMiddleware } from "../middlewares/dc-bot.middleware";
import { getLeaderboard } from "../controller/leaderboard.controller";
import { getOverallStats } from "../controller/stats.controller";
import archiveModel from "../models/archive.model";

const router = Router();

router.get("/leaderboard", botMiddleware,getLeaderboard)
router.get("/stats", botMiddleware,getOverallStats)

router.get("/latest-archive", botMiddleware ,async (_req, res) => {
  const archive = await archiveModel.findOne().sort({ date: -1 });

  return res.json({
    success: true,
    archive,
  });
});

export default router;