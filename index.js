const express = require('express');
const cors = require('cors');
const loanRoutes = require('../routes/loanroutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Use loan routes
app.use('/api/loans', loanRoutes); // Prefix for loan routes

// Basic route
app.get('/', (req, res) => {
    res.send('Loan calculator');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});
