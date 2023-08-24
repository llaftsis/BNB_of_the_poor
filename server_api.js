const express = require('express');
const connection = require('./src/database_connection.js');
const app = express();
const PORT = 4000;  // You can choose any free port

// Parse JSON requests
app.use(express.json());

// Example route to fetch all apartments
app.get('/api/apartments', (req, res) => {
  connection.query('SELECT * FROM Apartments', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
