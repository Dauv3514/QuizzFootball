import express from "express";
import {getUserProfil, updateUserProfil, getStatsUser} from "../controllers/profil.js";
import {verifyToken} from "../middlewares/auth.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
const router = express.Router();

router.get("/getUserProfil", verifyToken, getUserProfil);
router.put("/updateUserProfil", verifyToken, upload.single("profile_image"), updateUserProfil);
router.get("/statsUser", verifyToken, getStatsUser);

export default router;