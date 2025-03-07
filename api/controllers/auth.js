import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../database.js"

export const registerUser = (req, res) => {
    const { username, email, password } = req.body;
    const profileImage = req.file ? req.file.filename : null;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const query= `
        INSERT INTO users (username, email, password, profile_image) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
    `;
    const values = [username, email, hashedPassword, profileImage];
    client.query(query, values, (err, data) => {
        if(err) {
            res.status(500).json({ message: "Erreur lors de l'inscription", err })
        }
        return res.status(200).json({
            success: true, 
            message: "Inscription réussie",
            user: data.rows[0]
        })
    })
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: '/'
};

export const loginUser = (req, res) => {
    const {username, password} = req.body;
    const query = `
        SELECT * FROM users WHERE username = $1
    `
    client.query(query, [username], (err, data) => {
        if(err) {
            return res.status(500).json({ message: "Erreur lors de la connexion", err })
        }
        const user = data.rows[0];
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" })
        }
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET);

        res.cookie('access_token', token, cookieOptions)
        .status(200).json({
            success: true,
            message: "Connexion réussie",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    })
}

export const logoutUser = (req, res) => {
    res.clearCookie('access_token', cookieOptions)
    .status(200).json({
        success: true,
        message: "Déconnexion réussie"
    })
}