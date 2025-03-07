import client from "../database.js"

export const addResultsUser = (req, res) => {
    const userId = req.user.id;
    const themeId = parseInt(req.params.themeId);
    const query = `
        INSERT INTO results (user_id, theme_id, score, totalquestions, created_at) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
    `;

    const values = [
        userId,
        themeId,
        req.body.score, 
        req.body.totalquestions, 
        new Date()
    ];
    
    client.query(query, values, (err, data) => {
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de l'enregistrement du résultat",
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            message: "Resultat enregistré avec succès",
            result: data.rows[0]
        });
    });
}

export const getBestScoreUser = (req, res) => {
    const userId = req.user.id;
    const themeId = parseInt(req.params.themeId);

    const query = `
        SELECT MAX(score)
        FROM results
        WHERE user_id = $1 AND theme_id = $2
    `;

    const values = [userId, themeId];

    client.query(query, values, (err, data) => {
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération du meilleur score",
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            bestScore: data.rows[0].max
        });
    });
}

export const getAllScoresUser = (req, res) => {
    const userId = req.user.id;
    const themeId = parseInt(req.params.themeId);

    const query = `
        SELECT score, created_at, totalquestions
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
        SELECT user_id, COUNT(*) AS quiz_attempts
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