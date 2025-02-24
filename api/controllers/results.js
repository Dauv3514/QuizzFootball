import client from "../database.js"

export const addResultsUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const query = `
        INSERT INTO results (user_id, theme_id, score, totalquestions, created_at) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
    `;

    const values = [
        userId,
        req.body.theme_id,
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