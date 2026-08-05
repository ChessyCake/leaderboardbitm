import { Router } from "express"
import { getOverallStats } from "../controller/stats.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.get("/", 
            authMiddleware ,
            getOverallStats
        )

export default router
