const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Username aur password dono zaroori hain!" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sqlQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sqlQuery, [username, hashedPassword], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "Ye username pehle se kisi aur ne le liya hai yar." });
                }
                console.error("Registration mein gadbad:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ message: "User mast register ho gaya! 🎉", userId: results.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: "Server mein kuch dikkat hai." });
    }
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username aur password dono zaroori hain!" });
    }

    const sqlQuery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlQuery, [username], async (err, results) => {
        if (err) {
            console.error("Login mein gadbad:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: "Bhai, username ya password galat hai." });
        }

        const user = results[0];
        const validPass = await bcrypt.compare(password, user.password);

        if (!validPass) {
            return res.status(400).json({ error: "Bhai, username ya password galat hai." });
        }

        // Token banana
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });
        
        res.json({ message: "Login successful! 🚀", token, username: user.username });
    });
};
