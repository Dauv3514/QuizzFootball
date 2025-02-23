import client from "./database.js";
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import themesRoute from "./routes/themes.js";
import authRoute from "./routes/auth.js";
import dotenv from 'dotenv';

dotenv.config();

const connect = async () => {
    try {
        await client.connect();
        const app = express();
        app.listen(8800, () => {
            console.log('Backend server est lancé!');
        });
        app.use(express.json());
        app.use(cors());
        app.use(cookieParser());
        app.use("/api/themes", themesRoute);
        app.use("/api/auth", authRoute); // Assurez-vous que cette ligne est présente
        console.log("Connecté à la base de données :", client.database);
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
}

connect();