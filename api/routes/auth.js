import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/inscription", registerUser);
router.post("/connexion", loginUser);
router.post("/deconnexion", logoutUser);

export default router;