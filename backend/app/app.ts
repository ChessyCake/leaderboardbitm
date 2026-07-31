import cookieParser from "cookie-parser";
import express from "express";
import passport from "passport";
import cors from "cors"

import "../config/passport";

import authRoutes from "../routes/auth.routes"
import onboardingRoutes from "../routes/onboarding.routes"

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use("/auth", authRoutes)
app.use("/onboarding", onboardingRoutes)

export default app;