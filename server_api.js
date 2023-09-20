const express = require('express');
const connection = require('./src/database_connection.js');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
app.use('/images', express.static('C:/Users/laftsis/bnbftwxwn/images'));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');  // 'images/' is the directory where the images will be saved. Make sure this directory exists.
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Use the current timestamp as filename to avoid duplicates
    }
});

const upload = multer({ storage: storage }).array('images', 10);  // Assuming max 10 images

// Parse JSON requests
app.use(express.json());
app.use(cors());

// Fetch all apartments
app.get('/api/apartments', (req, res) => {
  connection.query('SELECT * FROM apartments', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  connection.query(`SELECT id, username, password, role, isApproved FROM Users WHERE username = ?`, [username], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
      const user = {
        id: results[0].id,  // <-- Include the user's ID
        username: results[0].username,
        role: results[0].role,
        isApproved: results[0].isApproved
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
  connection.query('SELECT * FROM apartments; SELECT * FROM Users', (error, results) => {
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

// Fetch apartments for a specific user
app.get('/api/apartments/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM apartments WHERE owner_id = ?';
  
  connection.query(query, [userId], (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
  });
});

// Add a new apartment
app.post('/api/apartments', (req, res) => {
  const {
      open_date, close_date, number_of_guests, location, type_of_apartment, owner_id,
      min_price, additional_cost_per_person, rules, description, number_of_beds,
      number_of_bathrooms, number_of_rooms, living_room, square_meters, exact_location, address, nickname
  } = req.body;

  connection.query(
      'INSERT INTO apartments (open_date, close_date, number_of_guests, location, type_of_apartment, owner_id, min_price, additional_cost_per_person, rules, description, number_of_beds, number_of_bathrooms, number_of_rooms, living_room, square_meters, exact_location, address, nickname) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [open_date, close_date, number_of_guests, location, type_of_apartment, owner_id, min_price, additional_cost_per_person, rules, description, number_of_beds, number_of_bathrooms, number_of_rooms, living_room, square_meters, exact_location, address, nickname],
      (error, results) => {
          if (error) {
              return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.json({ success: true, apartment: { id: results.insertId, ...req.body } });
      }
  );
});
app.get('/api/apartment/:apartmentId', async (req, res) => {
  const apartmentId = req.params.apartmentId;
  try {
      const query = `
          SELECT a.*, u.username 
          FROM apartments a 
          JOIN Users u ON a.owner_id = u.id 
          WHERE a.id = ?
      `;
      connection.query(query, [apartmentId], (err, results) => {
          if (err) {
              console.error("Error executing query:", err);
              res.status(500).send("Internal Server Error");
              return;
          }
          res.json(results[0]);
      });
  } catch (error) {
      console.error("Error fetching apartment data:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/api/search', async (req, res) => {
  try {
    console.log('This is a log message');
    console.log('Received request for /api/search with query:', req.query);
    
    const { checkInDate, checkOutDate, guests, city, category } = req.query;
    
    connection.query(
        'SELECT * FROM apartments WHERE open_date <= ? AND close_date >= ? AND number_of_guests >= ? AND location = ? AND type_of_apartment = ?',
        [checkInDate, checkOutDate, guests, city, category],
        (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).send("Internal Server Error");
                return;
            }
    
            console.log('Query results:', results);
            res.json(results);
        }
    );
    

  } catch (error) {
      console.error('Error processing request:', error);
      
      res.status(500).json({ error: 'Internal Server Error' });
  }
}); 

app.put('/api/edit-apartment/:apartmentId', async (req, res) => {
  const apartmentId = req.params.apartmentId;
  const userId = req.body.userId;
  const updatedData = req.body.updatedData;

  //SQL query
  const query = `
      UPDATE apartments 
      SET 
          open_date = ?, close_date = ?, number_of_guests = ?, location = ?, 
          type_of_apartment = ?, min_price = ?, additional_cost_per_person = ?,
          rules = ?, description = ?, number_of_beds = ?, number_of_bathrooms = ?,
          number_of_rooms = ?, living_room = ?, square_meters = ?, exact_location = ?, address = ?, nickname = ?
      WHERE id = ? AND owner_id = ?
  `;

  const values = [
      updatedData.open_date, updatedData.close_date, updatedData.number_of_guests,
      updatedData.location, updatedData.type_of_apartment, updatedData.min_price,
      updatedData.additional_cost_per_person, updatedData.rules, updatedData.description,
      updatedData.number_of_beds, updatedData.number_of_bathrooms, updatedData.number_of_rooms,
      updatedData.living_room, updatedData.square_meters, updatedData.exact_location, updatedData.address, updatedData.nickname, apartmentId, userId
  ];

  // Execute the query
  connection.query(query, values, (err, results) => {
      if (err) {
          console.error("Error executing query:", err);
          res.status(500).send("Internal Server Error");
          return;
      }
      res.json({ message: 'Apartment updated successfully.' });
  });
});
app.post('/api/upload-images', upload, (req, res) => {
  console.log("Files uploaded:", req.files);

  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
  }

  const apartmentId = req.body.apartmentId;  // Assuming you're sending the apartment ID in the request body

  // Validate that apartmentId exists in your database before proceeding

  const imagePaths = req.files.map(file => file.path);  // Extract file paths

  // Save the file paths to the database associated with the apartment
  const query = 'INSERT INTO apartment_images (apartment_id, image_url) VALUES ?';
  const values = imagePaths.map(path => [apartmentId, path]);

  connection.query(query, [values], (error, results) => {
      if (error) {
          console.error('Error storing image paths in database:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ success: true, message: 'Images uploaded successfully' });
  });
});
app.get('/api/apartment-images/:apartmentId', (req, res) => {
  const apartmentId = req.params.apartmentId;

  const query = 'SELECT image_url FROM apartment_images WHERE apartment_id = ?';
  
  connection.query(query, [apartmentId], (error, results) => {
      if (error) {
          console.error('Error fetching image paths from database:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ success: true, images: results.map(row => row.image_url) });
  });
});
app.delete('/api/delete-image', async (req, res) => {
  const { apartmentId, imageUrl } = req.body;

  // First, delete the image record from the database
  const query = 'DELETE FROM apartment_images WHERE apartment_id = ? AND image_url = ?';

  connection.query(query, [apartmentId, imageUrl], (error, results) => {
      if (error) {
          console.error('Error deleting image record from database:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }

      fs.unlink(`./${imageUrl}`, (err) => {
          if (err) {
              console.error('Error deleting physical image file:', err);
              return res.status(500).json({ error: 'Failed to delete physical image file' });
          }

          res.json({ success: true, message: 'Image deleted successfully' });
      });
  });
});

app.delete('/api/apartment/:apartmentId', async (req, res) => {
  const apartmentId = req.params.apartmentId;

  // Fetch all image URLs
  const fetchImagesQuery = 'SELECT image_url FROM apartment_images WHERE apartment_id = ?';

  connection.query(fetchImagesQuery, [apartmentId], (err, results) => {
      if (err) {
          console.error("Error fetching associated images:", err);
          return res.status(500).send("Internal Server Error");
      }

      const imageUrls = results.map(row => row.image_url);

      // Delete images from directory
      imageUrls.forEach(imageUrl => {
          fs.unlink(`./${imageUrl}`, (err) => {
              if (err) {
                  console.error('Error deleting physical image file:', err);
              }
          });
      });

      // Delete image from database
      const deleteImageRecordsQuery = 'DELETE FROM apartment_images WHERE apartment_id = ?';
      connection.query(deleteImageRecordsQuery, [apartmentId], (err, results) => {
          if (err) {
              console.error("Error deleting image records:", err);
              return res.status(500).send("Internal Server Error");
          }

          // Delete apartment
          const deleteApartmentQuery = 'DELETE FROM apartments WHERE id = ?';
          connection.query(deleteApartmentQuery, [apartmentId], (err, results) => {
              if (err) {
                  console.error("Error deleting apartment:", err);
                  return res.status(500).send("Internal Server Error");
              }
              res.json({ success: true, message: 'Apartment deleted successfully.' });
          });
      });
  });
});


app.listen(5000, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:5000`);
});



// const privateKey = fs.readFileSync('server.key', 'utf8');
// const certificate = fs.readFileSync('server.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };
// const httpServer = http.createServer(credentials, app);

// httpServer.listen(5000, '127.0.0.1', () => {
//     console.log(`http Server is running on http://127.0.0.1:5000`);
// });