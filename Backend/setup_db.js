require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
    try {
        console.log("Connecting to Database...");
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: true }
        });

        console.log("Connected. Creating users table...");
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Users table OK.");

        console.log("Modifying expenses table to add user_id...");
        // Add user_id column if it doesn't exist
        try {
            await db.query(`ALTER TABLE expenses ADD COLUMN user_id INT`);
            console.log("Added user_id to expenses.");
            
            // Just for existing data, we can create a dummy user or set them to null.
            // Typically we might make it a foreign key.
            await db.query(`ALTER TABLE expenses ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
            console.log("Added foreign key constraint.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("Column user_id already exists in expenses.");
            } else {
                console.warn("Notice during alter expenses:", err.message);
            }
        }

        console.log("Setting up random default user for any existing unlinked expenses...");
        const [defaultUsers] = await db.query('SELECT id FROM users LIMIT 1');
        if (defaultUsers.length > 0) {
            await db.query('UPDATE expenses SET user_id = ? WHERE user_id IS NULL', [defaultUsers[0].id]);
        }

        console.log("✅ Database Setup Complete!");
        process.exit(0);
    } catch (error) {
        console.error("Setup Failed:", error);
        process.exit(1);
    }
}

setupDatabase();
