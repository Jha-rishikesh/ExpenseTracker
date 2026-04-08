require('dotenv').config();
const express = require('express');
const cors = require('cors');    
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); 

// Default testing route
app.get('/', (req, res) => {
    res.send('Wah bete, tumhara Expense Tracker Backend bilkul MVC pattern me chal raha hai!');
});

// API Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

app.listen(PORT, () => {
    console.log(`Server mast chal raha hai port ${PORT} par 🚀`);
});
