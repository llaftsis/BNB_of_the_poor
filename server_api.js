const express = require('express');
const connection = require('./src/database_connection.js');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;
const cors = require('cors');

// Parse JSON requests
app.use(express.json());
app.use(cors());

// Fetch all apartments
app.get('/api/apartments', (req, res) => {
  connection.query('SELECT * FROM Apartments', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  connection.query(`SELECT username, password, role FROM Users WHERE username = ?`, [username], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
      res.json({ success: true, role: results[0].role, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  });
});

// Register
app.post('/api/register', async (req, res) => {
  console.log("Received registration request:", req.body);
  const { username, password, email, firstName, lastName, phone, role } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
 if (phone.length !== 10) {
    return res.status(400).json({ error: 'Το τηλέφωνο πρέπει να έχει ακριβώς 10 ψηφία' });
  }
  connection.query(
    'INSERT INTO Users (username, password, email, firstName, lastName, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [username, hashedPassword, email, firstName, lastName, phone, role],
    
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ success: true });
    }
  );
  console.log("Registration completed.");
});

// Fetch all users
app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM Users', (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
  });
});

app.get('/api/export-data', (req, res) => {
  connection.query('SELECT * FROM Apartments; SELECT * FROM Users', (error, results) => {
      if (error) {
          console.error("Database Error:", error);  // <-- Log the specific error for debugging
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      const [apartments, users] = results;
      res.json({ apartments, users });
  });
});



app.listen(5000, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:5000`);
});
