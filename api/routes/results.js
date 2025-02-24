import express from "express";
import { addResultsUser } from "../controllers/results.js";

const router = express.Router();

router.post("/:id", addResultsUser);

export default router;