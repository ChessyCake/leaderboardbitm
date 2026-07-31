import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middlewares";

import { setUsernames } from "../controller/onboarding.controller"

const router = Router();

router.post(
    "/",
    authMiddleware,
    setUsernames
)

export default router