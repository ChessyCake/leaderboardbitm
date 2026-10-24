import { Router } from "express"
import {lastLeaderBoard  } from "../controller/cfcontest.controller"

const router = Router();

router.get("/", lastLeaderBoard)

export default router