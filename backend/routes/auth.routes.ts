import { Router } from "express"
import passport from "passport"
import { getMe, getOnboardingStatus, googleCallback } from "../controller/auth.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";



const router = Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login?error=bit-email",
    session: false,
  }),
  googleCallback
);


router.get(
    "/failure", 
    (req, res) => {
        res.status(403).json({
            success: false,
            message: "Only BIT emails are allowed"
        })
})

router.get(
    "/me",
    authMiddleware,
    getMe
)

router.get(
  "/onboarding",
  authMiddleware,
  getOnboardingStatus
);

export default router