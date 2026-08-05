import cookieParser from "cookie-parser";
import express from "express";
import passport from "passport";
import cors from "cors"

import "../config/passport";

import authRoutes from "../routes/auth.routes"
import onboardingRoutes from "../routes/onboarding.routes"
import leaderboardRoutes from "../routes/leaderboard.route";
import statsRoutes from "../routes/stats.route";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use("/auth", authRoutes)
app.use("/api/v1/onboarding", onboardingRoutes)
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/stats", statsRoutes);

export default app;