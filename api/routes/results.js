import express from "express";
import { addResultsUser, getBestScoreUser } from "../controllers/results.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/themes/:quizId", verifyToken, addResultsUser);
router.get("/themes/:quizId/best-score", verifyToken, getBestScoreUser);

export default router;