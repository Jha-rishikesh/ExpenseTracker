const db = require('../config/db');

// Saare expenses dekhne ke liye API (GET)
exports.getExpenses = (req, res) => {
    const userId = req.user.id;
    const sqlQuery = "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC";
    
    db.query(sqlQuery, [userId], (err, results) => {
        if (err) {
            console.error("Data laane mein gadbad hui:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

// Naya kharcha add karne ke liye API (POST)
exports.createExpense = (req, res) => {
    const { title, amount, category, date } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!title || !amount || !category || !date) {
        return res.status(400).json({ error: "Sabhi fields zaroori hain!" });
    }
    if (Number(amount) <= 0) {
        return res.status(400).json({ error: "Amount 0 se bada hona chahiye." });
    }

    const sqlQuery = "INSERT INTO expenses (title, amount, category, date, user_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlQuery, [title, amount, category, date, userId], (err, results) => {
        if (err) {
            console.error("Kharcha save karne mein gadbad:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Kharcha successfully save ho gaya!", id: results.insertId });
    });
};

// Kharcha Update/Edit karne ke liye API (PUT)
exports.updateExpense = (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;
    const { title, amount, category, date } = req.body;
    
    if (!title || !amount || !category || !date) {
        return res.status(400).json({ error: "Sabhi fields zaroori hain!" });
    }
    if (Number(amount) <= 0) {
        return res.status(400).json({ error: "Amount 0 se bada hona chahiye." });
    }

    const sqlQuery = "UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ? AND user_id = ?";
    db.query(sqlQuery, [title, amount, category, date, expenseId, userId], (err, results) => {
        if (err) {
            console.error("Kharcha update karne mein gadbad:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Kharcha nahi mila ya aapka nahi hai." });
        }
        res.json({ message: "Kharcha successfully update ho gaya! ✏️" });
    });
};

// Kharcha delete karne ke liye API (DELETE)
exports.deleteExpense = (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;
    
    const sqlQuery = "DELETE FROM expenses WHERE id = ? AND user_id = ?";
    db.query(sqlQuery, [expenseId, userId], (err, results) => {
        if (err) {
            console.error("Kharcha delete karne mein gadbad:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Kharcha pehle se hi deleted hai ya aapka nahi hai." });
        }
        res.json({ message: "Kharcha hamesha ke liye delete ho gaya! 🗑️" });
    });
};
