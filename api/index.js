import client from "./database.js";
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import themesRoute from "./routes/themes.js";
import authRoute from "./routes/auth.js";
import resultsRoute from "./routes/results.js";
import profilRoute from "./routes/profil.js";
import dotenv from 'dotenv';
import { verifyToken } from "../api/middlewares/auth.js";

dotenv.config();

const connect = async () => {
    try {
        await client.connect();
        const app = express();
        
        app.use(cors());
        app.use(cookieParser());
        app.use(express.json());

        app.use("/api/auth", authRoute);
        app.use("/api/themes", themesRoute);
        app.use("/api/results", resultsRoute);
        app.use("/api/profil", verifyToken, profilRoute);

        app.listen(8800, () => {
            console.log('Backend server est lancé!');
        });
        console.log("Connecté à la base de données :", client.database);
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
}

connect();