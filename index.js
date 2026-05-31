const express = require('express');
const cors = require('cors');
const path = require('path');
const loanRoutes = require('./loanroutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use loan routes
app.use('/api/loans', loanRoutes); // Prefix for loan routes

// Basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
