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

  connection.query(`SELECT id, username, password, role FROM Users WHERE username = ?`, [username], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
      const user = {
        id: results[0].id,  // <-- Include the user's ID
        username: results[0].username,
        role: results[0].role
      };
      res.json({ success: true, user, message: 'Login successful' });  // <-- Return the user object
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  });
});

// Register
app.post('/api/register', async (req, res) => {
  console.log("Received registration request:", req.body);
  const { username, password, email, firstName, lastName, phone, role } = req.body;
  let isApproved = true;
  if (role === 'Οικοδεσπότης') {
      isApproved = false;
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
 if (phone.length !== 10) {
    return res.status(400).json({ error: 'Το τηλέφωνο πρέπει να έχει ακριβώς 10 ψηφία' });
  }
  connection.query(
    'INSERT INTO Users (username, password, email, firstName, lastName, phone, isApproved, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [username, hashedPassword, email, firstName, lastName, phone, isApproved, role, ],
    
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

// Fetch user details by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('SELECT * FROM Users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);
  });
});

// Approve user as Host
app.post('/api/users/:id/approve-host', (req, res) => {
  const userId = req.params.id;

  connection.query('UPDATE Users SET role = ?, isApproved = ? WHERE id = ?', ['Οικοδεσπότης', true, userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User approved as host' });
  });
});

// Update user details by ID
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email, firstName, lastName, phone } = req.body;

  connection.query(
      'UPDATE Users SET username = ?, email = ?, firstName = ?, lastName = ?, phone = ? WHERE id = ?',
      [username, email, firstName, lastName, phone, userId],
      (error, results) => {
          if (error) {
              return res.status(500).json({ error: 'Internal Server Error' });
          }
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.json({ success: true, message: 'User details updated' });
      }
  );
});

// Handle password change
app.post('/api/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  // Fetch the current hashed password for the user from the database
  connection.query('SELECT password FROM Users WHERE id = ?', [userId], async (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      const hashedPassword = results[0].password;

      // Check if the current password matches the one in the database
      const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
      
      if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Ensure the new password is different from the old one
      if (await bcrypt.compare(newPassword, hashedPassword)) {
          return res.status(400).json({ message: 'New password cannot be the same as the old one' });
      }

      // Hash the new password and update it in the database
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      connection.query('UPDATE Users SET password = ? WHERE id = ?', [newHashedPassword, userId], (updateError) => {
          if (updateError) {
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          res.json({ success: true, message: 'Password updated successfully' });
      });
  });
});

app.listen(5000, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:5000`);
});

