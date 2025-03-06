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
        SELECT username, email, created_at, profile_image, password
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
    const updateUser = req.body;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Utilisateur non authentifié"
        });
    }

    const updatedFields = {};
    const values = [];

    if (updateUser.username) {
        updatedFields.username = updateUser.username;
        values.push(updateUser.username);
    }

    if (updateUser.email) {
        updatedFields.email = updateUser.email;
        values.push(updateUser.email);
    }

    if (updateUser.password) {
        const hashedPassword = bcrypt.hashSync(updateUser.password, bcrypt.genSaltSync(10));
        updatedFields.password = hashedPassword;
        values.push(hashedPassword);
    }

    if (req.file) {
        const imageUrl = `${req.file.filename}`;
        updatedFields.profile_image = imageUrl;
        values.push(imageUrl);
    }

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Aucune modification fournie"
        });
    }

    updatedFields.updated_at = new Date().toISOString();
    values.push(updatedFields.updated_at);

    const setClause = Object.keys(updatedFields)
        .map((field, idx) => `${field} = $${idx + 1}`)
        .join(', ');

    const query = `
        UPDATE users
        SET ${setClause}
        WHERE id = $${values.length + 1}
        RETURNING username, email, updated_at, profile_image
    `;
    
    values.push(userId);

    client.query(query, values, (err, data) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la modification du profil"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profil modifié avec succès",
            user: data.rows[0]
        });
    });
};

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