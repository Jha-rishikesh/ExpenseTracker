const mysql = require('mysql2');
require('dotenv').config();

// Cloud Database se secure connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true // Cloud db ke liye ye zaroori hota hai
    }
});

// Database se judne (connect) ki koshish
db.connect((err) => {
    if (err) {
        console.error('Arre yaar, Database se connection fail ho gaya:', err);
        return;
    }
    console.log('Database se connection ekdum Set hai! ✅');
});

module.exports = db;
