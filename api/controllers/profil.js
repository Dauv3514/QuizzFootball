import client from "../database.js"
import bcrypt from "bcryptjs";

export const getUserProfil = (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Utilisateur non authentifié"
        });
    }
    const query = `
        SELECT username, email, created_at
        FROM users
        WHERE id = $1
    `;
    client.query(query, [userId], (err, data) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des infos du User"
            });
        }
        return res.status(200).json({
            user: data.rows[0]
        })
    });
}

export const updateUserProfil = (req, res) => {
    const userId = req.user.id;
    const updateUser = req.body.user;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Utilisateur non authentifié"
        });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(updateUser.password, salt);
    if (!updateUser.username || !updateUser.email || !updateUser.password) {
        return res.status(400).json({
            success: false,
            message: "Tous les champs (username, email, password) sont requis"
        });
    }
    const updatedAt = new Date().toISOString();
    const values = [
        updateUser.username, 
        updateUser.email, 
        hashedPassword,
        updatedAt,
        userId
    ];

    const Query= `
        UPDATE users
        SET username = $1, email = $2, password = $3, updated_at = $4
        WHERE id = $5
        RETURNING username, email, password, updated_at
    `;

    client.query(Query, values, (err, data) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({
                success: false,
                message:"Erreur lors de la modification des infos du User"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Profil modifié avec succès",
            user: data.rows[0]
        })
    })
}

export const getStatsUser = (req, res) => {
    const userId = req.user.id;
    if(!userId) {
        return res.status(401).json({
            success: false,
            message: 'Utilisateur non authentifié'
        })
    }
    const query = `
        SELECT DISTINCT score, totalquestions, theme_id, name, image
        FROM results
        LEFT JOIN users
        ON results.user_id = users.id
        LEFT JOIN themes
        ON results.theme_id = themes.id
        WHERE user_id = $1 AND score = totalquestions
    `
    client.query(query, [userId], (err, data) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des stats du User"
            });
        }
        return res.status(200).json({
            statsUser: data.rows
        })
    });
}

export const statsOthersUsers = (req, res) => {
}