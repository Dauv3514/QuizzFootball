import client from "../database.js"

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
}

export const statsUser = (req, res) => {
}

export const statsOthersUsers = (req, res) => {
}