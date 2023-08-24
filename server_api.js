const express = require('express');
const connection = require('./src/database_connection.js');
const app = express();
const PORT = 4000;  // You can choose any free port

// Parse JSON requests
app.use(express.json());

// Route to fetch all apartments
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

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    // Will hash the password and compare it with the hashed version stored in the database in next steps.
    connection.query(
      'SELECT * FROM Users WHERE username = ? AND password = ?',
      [username, password],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        if (results.length > 0) {
          // User found and authenticated
          res.json({ success: true });
        } else {
          // Invalid credentials
          res.json({ success: false, error: 'Invalid credentials' });
        }
      }
    );
  });
  