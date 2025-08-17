import express from "express";
import { getLosers, getWinners } from "../controllers/wlControllers.js";
import { verifyJwtToken } from "../middleware/verify.js";

const router = express.Router();

router.post("/won", verifyJwtToken, getWinners);
router.post("/lost", verifyJwtToken, getLosers);

export default router;
