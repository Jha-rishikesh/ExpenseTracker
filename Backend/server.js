// const express = require('express');
// const app = express();
// const port = 3000;

// // Ye ek simple route hai check karne ke liye
// app.get('/', (req, res) => {
//     res.send('Wah bete, tumhara Expense Tracker Backend chal pada!');
// });

// // Server ko start karna
// app.listen(port, () => {
//     console.log(`Server mast chal raha hai: http://localhost:${port} par`);
// });
const express = require('express');
const mysql = require('mysql2'); // Database se baat karne wala tool
const cors = require('cors');    // Frontend ko access dene wala tool

const app = express();
const port = 3000;

// Ye middlewares hain, aage kaam aayenge
app.use(cors());
app.use(express.json()); 

// Database (XAMPP MySQL) se connection ka setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // XAMPP me default user hamesha 'root' hota hai
    password: '',      // XAMPP me default password khali (blank) hota hai
    database: 'expense_tracker' // Hamare database ka naam
});

// Database se judne (connect) ki koshish
db.connect((err) => {
    if (err) {
        console.error('Arre yaar, Database se connection fail ho gaya:', err);
        return;
    }
    console.log('Database (Memory) se connection ekdum Set hai! ✅');
});

// Hamara purana testing route
app.get('/', (req, res) => {
    res.send('Wah bete, tumhara Expense Tracker Backend aur Database dono chal pade!');
});

// Naya kharcha add karne ke liye API (POST Route)
app.post('/expenses', (req, res) => {
    // Frontend se jo data aayega, usko nikalna
    const { title, amount, category, date } = req.body;
    
    // Database me data daalne ki SQL query (? ka matlab hai data baad me denge, ye safe hota hai)
    const sqlQuery = "INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)";
    
    db.query(sqlQuery, [title, amount, category, date], (err, results) => {
        if (err) {
            console.error("Kharcha save karne mein gadbad:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Kharcha successfully save ho gaya!", id: results.insertId });
    });
});

// Kharcha delete karne ke liye API (DELETE Route)
app.delete('/expenses/:id', (req, res) => {
    // Frontend se us kharche ki ID nikalna jo delete karna hai
    const expenseId = req.params.id;
    
    // Database se wo specific ID wala row udane ki SQL query
    const sqlQuery = "DELETE FROM expenses WHERE id = ?";
    
    db.query(sqlQuery, [expenseId], (err, results) => {
        if (err) {
            console.error("Kharcha delete karne mein gadbad:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Kharcha hamesha ke liye delete ho gaya! 🗑️" });
    });
});

// Kharcha Update/Edit karne ke liye API (PUT Route)
app.put('/expenses/:id', (req, res) => {
    const expenseId = req.params.id; // Kaunsa kharcha edit karna hai
    const { title, amount, category, date } = req.body; // Naya data kya hai
    
    // Database me data update karne ki SQL query
    const sqlQuery = "UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?";
    
    db.query(sqlQuery, [title, amount, category, date, expenseId], (err, results) => {
        if (err) {
            console.error("Kharcha update karne mein gadbad:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Kharcha successfully update ho gaya! ✏️" });
    });
});

// Server ko wapas start karna
app.listen(port, () => {
    
    // Saare expenses dekhne ke liye API (GET Route)
    app.get('/expenses', (req, res) => {
        // Database se sab kuch select karne ki SQL query
        const sqlQuery = "SELECT * FROM expenses";

        db.query(sqlQuery, (err, results) => {
            if (err) {
                console.error("Data laane mein gadbad hui:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results); // Ye database se mile data ko bhej dega
        });
    });

    console.log(`Server mast chal raha hai: http://localhost:${port} par 🚀`);
});