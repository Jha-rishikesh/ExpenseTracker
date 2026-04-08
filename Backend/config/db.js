const mysql = require('mysql2');
require('dotenv').config();

// Cloud Database se secure connection pool (To prevent PROTOCOL_CONNECTION_LOST)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true // Cloud db ke liye ye zaroori hota hai
    }
});

// Test the pool connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Arre yaar, Database se connection fail ho gaya:', err);
        return;
    }
    console.log('Database se connection ekdum Set hai (Pool Created)! ✅');
    connection.release();
});

// Prevent Node crashes cleanly when TiDB forcefully closes idle connections
db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was closed by TiDB server, but pool will auto-reconnect. 🔄');
    } else {
        console.error('Database connection error:', err);
    }
});

module.exports = db;
