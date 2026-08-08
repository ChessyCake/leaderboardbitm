import { Router } from "express";
import { updateUsernames } from "../controller/username.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/", authMiddleware, updateUsernames);

export default router;
