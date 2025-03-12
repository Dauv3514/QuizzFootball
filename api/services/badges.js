import client from "../database.js";

// Fonction pour calculer le nombre de quiz terminés du User

export const calculerQuizTermines = async (userId) => {
    const query = `
        SELECT COUNT(DISTINCT theme_id)
        FROM results
        WHERE user_id = $1 AND score = totalquestions;
    `;
    const values = [userId];
    const result = await client.query(query, values);
    return parseInt(result.rows[0].count);
};

// Fonction pour calculer le nombre total de tentatives du User

export const calculerTentatives = async (userId) => {
    const query = `
        SELECT COUNT(*)
        FROM results
        WHERE user_id = $1
    `;
    const values = [userId];
    const result = await client.query(query, values);
    return parseInt(result.rows[0].count);
};

// Fonction pour attribuer un Badge à un User

export const attribuerBadges = async (userId, quizTermines, tentatives) => {
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
            let badgeResult = await client.query(
                `SELECT id FROM badges WHERE badge_name = $1`,
                [badgeName]
            );

            let badgeId;
            if (badgeResult.rows.length === 0) {
                badgeResult = await client.query(
                    `INSERT INTO badges (badge_name, badge_icon, user_id) VALUES ($1, $2, $3) RETURNING id`,
                    [badgeName, badgeIcon, userId]
                );
                badgeId = badgeResult.rows[0].id;
            } else {
                badgeId = badgeResult.rows[0].id;
            }

            const userBadgeResult = await client.query(
                `SELECT * FROM user_badge WHERE user_id = $1 AND badge_id = $2`,
                [userId, badgeId]
            );

            if (userBadgeResult.rows.length === 0) {
                await client.query(
                    `INSERT INTO user_badge (user_id, badge_id, created_at) VALUES ($1, $2, NOW())`,
                    [userId, badgeId]
                );
            }
        } catch (error) {
            console.error("Erreur SQL:", error);
        }
    };

    for (const badge of badgesQuizTermines) {
        if (quizTermines >= badge.min) {
            await attribuerBadge(badge.badge, badge.icon, userId);
        }
    }

    for (const badge of badgesTentatives) {
        if (tentatives >= badge.min) {
            await attribuerBadge(badge.badge, badge.icon, userId);
        }
    }
};