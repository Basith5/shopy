const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.getConnection()
  .then(() => console.log('Connected to MySQL database:', process.env.DB_NAME))
  .catch(err => {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  });

module.exports = db;
