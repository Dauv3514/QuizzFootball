import client from "../database.js"
import { 
            calculerQuizTermines, 
            calculerTentatives,
            calculerTempsDeReponseQuiz,
            attribuerBadges
       } from "../services/badges.js";
import { redisClient } from "../redis.js"; 

export const addResultsUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const themeId = parseInt(req.params.themeId);
        const query = `
            INSERT INTO results (user_id, theme_id, score, totalquestions, created_at, timetaken) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;

        const values = [
            userId,
            themeId,
            req.body.score, 
            req.body.totalquestions, 
            new Date(),
            req.body.timetaken
        ];
        const {rows} = await client.query(query, values);
        const quizTermines = await calculerQuizTermines(userId);
        const tentatives = await calculerTentatives(userId);
        const times = await calculerTempsDeReponseQuiz(userId);

        await attribuerBadges(userId, quizTermines, tentatives, times);

        return res.status(200).json({
            success: true,
            message: "Resultat enregistré avec succès",
            result: rows[0],
            stats: {
                quizTermines,
                tentatives
            }
        });

    } catch (err) {
        console.error('Erreur SQL:', err);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de l'enregistrement du résultat",
            error: err.message
        });
    }
}

export const getBestScoreUser = async (req, res) => {
    const userId = req.user.id;
    const themeId = parseInt(req.params.themeId);

    // Vérifier si la donnée existe déjà dans Redis
    const cacheKey = `bestScore:${userId}:${themeId}`;
    const cachedScore = await redisClient.get(cacheKey);

    if (cachedScore) {
        // Si la donnée est dans le cache, renvoyer directement
        return res.status(200).json({
            success: true,
            bestScore: cachedScore
        });
    }

    const query = `
        SELECT MAX(score)
        FROM results
        WHERE user_id = $1 AND theme_id = $2
    `;

    const values = [userId, themeId];

    try {
        const { rows } = await client.query(query, values);

        if (rows[0].max !== null && rows[0].max !== undefined) {
            await redisClient.set(cacheKey, rows[0].max, 'EX', 3600); // Expire après 1 heure
            const cachedValue = await redisClient.get(cacheKey);
            console.log("🔍 Vérification immédiate : Score dans Redis =", cachedValue);
        } else {
            console.log("⚠️ Aucun score trouvé en base de données.");
        }
        return res.status(200).json({
            success: true,
            bestScore: rows[0].max
        });
    } catch (err) {
        console.error('Erreur SQL:', err);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du meilleur score",
            error: err
        });
    }
}

export const getAllScoresUser = (req, res) => {
    const userId = req.user.id;
    const themeId = parseInt(req.params.themeId);

    const query = `
        SELECT score, created_at, totalquestions, timetaken
        FROM results
        WHERE user_id = $1 AND theme_id = $2
        ORDER BY created_at DESC
    `;

    const values = [userId, themeId];

    client.query(query, values, (err, data) => {
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des scores",
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            scores: data.rows
        });
    });
}

export const getAllScoresUsers = (req, res) => {

    const query = `
        SELECT DISTINCT ON (r.user_id, r.theme_id)
            r.score, 
            r.created_at, 
            r.totalquestions,
            r.theme_id,
            r.user_id,
            u.username
        FROM results r
        JOIN users u ON r.user_id = u.id
        WHERE r.score = r.totalquestions
        ORDER BY r.user_id, r.theme_id, r.created_at DESC;
    `;

    client.query(query, (err, data) => {
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des scores",
                error: err
            });
        }
        return res.status(200).json({
            scores: data.rows
        });
    });
}

export const getQuizAttempts = (req, res) => {

    const query = `
        SELECT user_id, 
            COUNT(*) AS quiz_attempts,
            ROUND(AVG(timetaken), 2) AS average_time
        FROM results
        GROUP BY user_id;
    `;

    client.query(query, (err, data) => {
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des scores",
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            attempts: data.rows
        });
    });
}