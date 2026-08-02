import { Router } from "express";
import { getLeaderboard } from "../controller/leaderboard.controller";
 prahlad/backend-contoller
import { authMiddleware } from "../middlewares/auth.middlewares";
import { totalActive } from "../controller/instance.controller";

const router = Router();

router.get("/",authMiddleware, getLeaderboard);
router.get("/totalActive",authMiddleware,  totalActive)
=======

const router = Router();

router.get("/", getLeaderboard);
 main

export default router;