const express = require('express');
const connection = require('./src/database_connection.js');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;
const cors = require('cors');


// Parse JSON requests
app.use(express.json());
app.use(cors());

// Example route to fetch all apartments
app.get('/api/apartments', (req, res) => {
  connection.query('SELECT * FROM Apartments', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Ideally, you'd hash the password and compare the hashed value with what's stored in the database.
  connection.query('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  });
});


app.post('/api/register', async (req, res) => {
  console.log("Received registration request:", req.body); // Log the incoming request data
  const { username, password, email } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
    [username, hashedPassword, email],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ success: true });
    }
  );
  console.log("Registration completed."); // Log after the database operation
});

app.listen(5000, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:5000`);
});

