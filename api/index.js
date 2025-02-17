import client from "./database.js"
// import express from "express";

const connect = async () => {
    try {
        await client.connect();
        console.log("Connecté à la base de données :", client.database);
        // const app = express();
        // app.listen(8800, () => {
        //     console.log('Backend server est lancé!');
        // });
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
}

connect();