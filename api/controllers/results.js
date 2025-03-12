import client from "../database.js"

export const addResultsUser = async (req, res) => {
    try {
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
        const {rows} = await client.query(query, values);
        const quizTermines = await calculerQuizTermines(userId);
        const tentatives = await calculerTentatives(userId);

        await attribuerBadges(userId, quizTermines, tentatives);

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

// Fonction pour calculer le nombre de quiz terminés du User

const calculerQuizTermines = async (userId) => {
    const query = `
        SELECT COUNT(DISTINCT theme_id)
        FROM results
        WHERE user_id = $1 AND score = totalquestions;
    `;
    const values = [userId];
    const result = await client.query(query, values);
    return parseInt(result.rows[0].count);
}

// Fonction pour calculer le nombre total de tentatives du User

const calculerTentatives = async (userId) => {
    const query = `
        SELECT COUNT(*)
        FROM results
        WHERE user_id = $1
    `
    const values = [userId];
    const result = await client.query(query, values);
    return parseInt(result.rows[0].count);
}

// Fonction pour attribuer un Badge à un User

const attribuerBadges = async (userId, quizTermines, tentatives) => {
    const badgesQuizTermines = [
        { badge: 'Débutant', min: 1, max: 3, icon: '🏅' },
        { badge: 'Intermédiaire', min: 4, max: 7, icon: '🏆' },
        { badge: 'Expert', min: 8, max: 9999, icon: '👑' }
    ];

    const badgesTentatives = [
        { badge: 'Explorateur', min: 1, max: 30, icon: '🔍' },
        { badge: 'Challenger', min: 31, max: 69, icon: '⚔️' },
        { badge: 'Addict', min: 70, max: 9999, icon: '🎮' }
    ];

    const attribuerBadge = async (badgeName, badgeIcon, userId) => {
        try {
            // Vérifier si le badge existe déjà dans la table `badges`
            let badgeResult = await client.query(
                `
                    SELECT id 
                    FROM badges 
                    WHERE badge_name = $1
                `,
                [badgeName]
            );

            let badgeId;
            if (badgeResult.rows.length === 0) {
                // Si le badge n'existe pas, l'insérer et récupérer son ID
                badgeResult = await client.query(
                    `
                        INSERT INTO badges (badge_name, badge_icon, user_id) 
                        VALUES ($1, $2, $3) 
                        RETURNING id
                    `,
                    [badgeName, badgeIcon, userId]
                );
                badgeId = badgeResult.rows[0].id;
            } else {
                badgeId = badgeResult.rows[0].id;
            }

            // Vérifier si l'utilisateur a déjà ce badge
            const userBadgeResult = await client.query(
                `
                    SELECT *
                    FROM user_badge
                    WHERE user_id = $1 AND badge_id = $2
                `,
                [userId, badgeId]
            );

            if (userBadgeResult.rows.length === 0) {
                // Associer le badge à l'utilisateur
                await client.query(
                    `
                        INSERT INTO user_badge (user_id, badge_id, created_at) 
                        VALUES ($1, $2, NOW())
                    `,
                    [userId, badgeId]
                );
            }
        } catch (error) {
            console.error("Erreur SQL:", error);
            return;
        }
    };

    // Vérifier et attribuer les badges pour les quiz terminés
    for (const badge of badgesQuizTermines) {
        if (quizTermines >= badge.min) {
            await attribuerBadge(badge.badge, badge.icon, userId);
        }
    }

    // Vérifier et attribuer les badges pour les tentatives
    for (const badge of badgesTentatives) {
        if (tentatives >= badge.min) {
            await attribuerBadge(badge.badge, badge.icon, userId);
        }
    }
};

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