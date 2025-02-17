import { promises as fs } from 'fs';
import client from "./database.js"

// Lire le fichier JSON de manière asynchrone
const readJSON = async () => {
    try {
        // await client.connect();
        console.log("Connecté à la base de données :", client.database);
        const data = await fs.readFile('./client/src/data/quiz.json', 'utf8');
        // Lecture du fichier JSON
        const quizs = JSON.parse(data);
        // console.log("Données lues avec succès:", quizs);

        for (const quiz of quizs) {
            console.log(quiz, "test");
            const query = 'INSERT INTO themes (id, name, image) VALUES ($1, $2, $3) RETURNING *';
            const values = [
                quiz.id,
                quiz.name,
                quiz.img
            ];

            try {
                const result = await client.query(query, values);
                console.log('Thème inséré :', result.rows[0]);
            } catch (queryError) {
                console.error('Erreur lors de l\'insertion :', queryError);
            }
        }

        // Vérification finale
        const checkResult = await client.query('SELECT * FROM themes');
        console.log('Tous les thèmes insérés :', checkResult.rows);
    } catch (err) {
        console.error("Erreur lors de la lecture du fichier JSON", err);
    }
}

readJSON();