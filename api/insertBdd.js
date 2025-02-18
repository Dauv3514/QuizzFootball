import { promises as fs } from 'fs';
import client from "./database.js"

// Lire le fichier JSON de manière asynchrone
const readJSON = async () => {
    try {
        await client.connect();
        const data = await fs.readFile('client/src/data/quiz.json', 'utf8');
        const quizs = JSON.parse(data);

        // Insertion des themes

        // for (const quiz of quizs) {
        //     const query = 'INSERT INTO themes (id, name, image) VALUES ($1, $2, $3) RETURNING *';
        //     const values = [quiz.id, quiz.name, quiz.img];
        //     try {
        //         const result = await client.query(query, values);
        //         console.log('Thème inséré avec succès:', result.rows[0]);
        //     } catch (error) {
        //         console.error('Détails de l\'erreur:', error);
        //     }
        // }


        // Insertion des questions

        // for (const quiz of quizs) {
        //     for(const question of quiz.questions) {
        //         const query = 'INSERT INTO questions (id, text, indice, theme_id) VALUES ($1, $2, $3, $4) RETURNING *'
        //         const values = [
        //             question.id, 
        //             question.text, 
        //             question.indice, 
        //             quiz.id
        //         ];
        //         try {
        //             const result = await client.query(query, values);
        //             console.log('Thème inséré avec succès:', result.rows[0]);
        //         } catch (error) {
        //             console.error('Détails de l\'erreur:', error);
        //         }
        //     }
        // }

        // Insertion des réponses
        
        for (const quiz of quizs) {
            for(const question of quiz.questions) {
                for (const options of question.options) {
                    const query = 'INSERT INTO answers (id, text, label, "isCorrect", question_id) VALUES ($1, $2, $3, $4, $5) RETURNING *'
                    const values = [
                        options.id, 
                        options.text, 
                        options.label,
                        options.isCorrect,
                        question.id
                    ];
                    try {
                        const result = await client.query(query, values);
                        console.log('Thème inséré avec succès:', result.rows[0]);
                    } catch (error) {
                        console.error('Détails de l\'erreur:', error);
                    }
                }
            }
        }

    } catch (err) {
        console.error("Erreur principale:", err.message);
    } finally {
        await client.end();
    }
}
readJSON();