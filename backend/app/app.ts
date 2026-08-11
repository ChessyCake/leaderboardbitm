import cookieParser from "cookie-parser";
import express from "express";
import passport from "passport";
import cors from "cors"

import "../config/passport";

import authRoutes from "../routes/auth.routes"
import onboardingRoutes from "../routes/onboarding.routes"
import leaderboardRoutes from "../routes/leaderboard.route";
import statsRoutes from "../routes/stats.route";
import archiveRoutes from "../routes/archive.route";
import usernameRoutes from "../routes/username.route";
import botRoutes from "../routes/bot.routes";

const app = express();

const allowedOrigins = [
  process.env.BOT_URL,
  process.env.BACKEND_URL,
];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null,true)

      if(allowedOrigins.includes(origin)){
        callback(null, true)
      } else {
        callback( new Error('CORS not allowed'))
      }
  },
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use("/auth", authRoutes)
app.use("/api/v1/onboarding", onboardingRoutes)
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/archive", archiveRoutes);
app.use("/api/v1/username", usernameRoutes);

app.use("/internal/bot", botRoutes);

export default app;