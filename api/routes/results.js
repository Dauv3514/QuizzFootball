import express from "express";
import { addResultsUser, getBestScoreUser, getAllScoresUser } from "../controllers/results.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/themes/:themeId", verifyToken, addResultsUser);
router.get("/themes/:themeId/best-score", verifyToken, getBestScoreUser);
router.get("/themes/:themeId/scores", verifyToken, getAllScoresUser);
export default router;