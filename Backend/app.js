const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

require('dotenv').config();

const app = express();

// Create MySQL connection
const dbPassword = process.env.DB_PASSWORD ? decodeURIComponent(process.env.DB_PASSWORD) : '';
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  port: 3306,
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL successfully');
  }
});


// Use cors middleware with explicit origin
app.use(cors({
  origin: 'http://localhost:3000',  // Replace with your React app's origin
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('./router/route'));