import client from "../database.js"

export const getThemes = (req, res) => {
    const query = `        
        SELECT 
            t.*,
            json_agg(
                json_build_object(
                    'id', q.id,
                    'text', q.text,
                    'indice', q.indice,
                    'theme_id', q.theme_id,
                    'options', (
                        SELECT json_agg(
                            json_build_object(
                                'id', a.id,
                                'label', a.label,
                                'text', a.text,
                                'isCorrect', a."isCorrect"
                            )
                        )
                        FROM answers a
                        WHERE a.question_id = q.id
                    )
                )
            ) as questions
        FROM themes t
        LEFT JOIN questions q ON t.id = q.theme_id
        GROUP BY t.id, t.name, t.image
        ORDER BY t.id;
    `;
    
    client.query(query, (err, data) => {
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data.rows);
    });
}

export const getTheme = (req, res) => {
    const themeId = parseInt(req.params.id);
    const query = `        
        SELECT 
            json_build_object(
                'id', t.id,
                'name', t.name,
                'image', t.image,
                'questions', (
                    SELECT json_agg(
                        json_build_object(
                            'id', q.id,
                            'text', q.text,
                            'indice', q.indice,
                            'theme_id', q.theme_id,
                            'options', (
                                SELECT json_agg(
                                    json_build_object(
                                        'id', a.id,
                                        'label', a.label,
                                        'text', a.text,
                                        'isCorrect', a."isCorrect"
                                    )
                                )
                                FROM answers a
                                WHERE a.question_id = q.id
                            )
                        )
                    )
                    FROM questions q 
                    WHERE q.theme_id = t.id
                )
            ) as theme
        FROM themes t
        WHERE t.id = $1;
    `;
    
    client.query(query, [themeId], (err, data) => {
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data.rows[0].theme);
    });
}