const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ error: "Access Denied. Login zaroori hai!" });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || 'supersecretkey');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Token galat hai bhai." });
    }
};
