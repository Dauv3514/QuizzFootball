import express from "express";
import { getUserProfil, updateUserProfil, statsUser, statsOthersUsers } from "../controllers/profil.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getUserProfil", verifyToken, getUserProfil);
router.put("/updateUserProfil", verifyToken, updateUserProfil);
router.get("/statsUser", statsUser);
router.get("/statsOthersUsers", statsOthersUsers);

export default router;