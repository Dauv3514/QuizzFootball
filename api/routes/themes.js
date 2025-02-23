import express from "express";
import {getThemes, getTheme} from "../controllers/theme.js";

const router = express.Router();

router.get("/", getThemes)
router.get("/:id", getTheme)

export default router