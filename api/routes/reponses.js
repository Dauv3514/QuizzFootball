import express from "express"
import {getReponses} from "../controllers/reponse.js"

const router = express.Router();

router.get("/", getReponses)

export default router