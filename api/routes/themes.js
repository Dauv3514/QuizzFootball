import express from "express"
import {getThemes} from "../controllers/theme.js"

const router = express.Router();

router.get("/", getThemes)

export default router