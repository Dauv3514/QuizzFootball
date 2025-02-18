import client from "../database.js"

export const getReponses = (req, res) => {
    const query = `SELECT * FROM answers`;
    client.query(query, (err,data) => {
        if(err) {
            console.log (err, 'erreur');
        }
        return res.status(200).json(data.rows);
    })
}