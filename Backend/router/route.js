const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

router.get('/', (req, res) => {
  res.send('hello world from server router js');
});

// Routes
router.get('/api/customers', (req, res) => {
  const query = 'SELECT * FROM customers';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

// ...

router.post('/api/customers', (req, res) => {
  const { Name, Address, CustomerNumber, MeterSerialNumber } = req.body;
  const query = 'INSERT INTO customers (Name, Address, CustomerNumber, MeterSerialNumber) VALUES (?, ?, ?, ?)';
  db.query(query, [Name, Address, CustomerNumber, MeterSerialNumber], (err, result) => {
    if (err) {
      console.error('Error creating customer:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id: result.insertId, Name, Address, CustomerNumber, MeterSerialNumber });
    }
  });
});

router.put('/api/customers/:id', (req, res) => {
  const customerId = req.params.id;
  const updatedFields = req.body;
  const query = 'UPDATE customers SET ? WHERE Customer_id = ?';

  // Remove fields with undefined values to prevent setting them to NULL
  Object.keys(updatedFields).forEach((key) => updatedFields[key] === undefined && delete updatedFields[key]);

  db.query(query, [updatedFields, customerId], (err, result) => {
    if (err) {
      console.error('Error updating customer:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id: customerId, ...updatedFields });
    }
  });
});


// Assuming you have an endpoint like this in your backend
router.delete('/api/customers/:id', (req, res) => {
  const customerId = req.params.id;
  const query = 'DELETE FROM customers WHERE Customer_id = ?';
  
  db.query(query, [customerId], (err, result) => {
    if (err) {
      console.error('Error deleting customer:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id: customerId });
    }
  });
});


module.exports = router;
