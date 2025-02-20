import client from "./database.js"
import express from "express";
import cors from 'cors'
import themesRoute from "./routes/themes.js";

const connect = async () => {
    try {
        await client.connect();
        const app = express();
        app.listen(8800, () => {
            console.log('Backend server est lancé!');
        });
        app.use(express.json());
        app.use(cors())
        app.use("/api/themes", themesRoute);
        console.log("Connecté à la base de données :", client.database);
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
}

connect();