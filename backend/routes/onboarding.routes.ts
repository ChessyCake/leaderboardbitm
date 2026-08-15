import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middlewares";

import { setUsernames, verifyOwnership } from "../controller/onboarding.controller"

const router = Router();

router.post(
    "/",
    authMiddleware,
    setUsernames
)

router.post(
    "/verify",
    authMiddleware,
    verifyOwnership
)

export default router