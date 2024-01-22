const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:  'localhost',
    user:  'root',
    database: 'onlineshop',
    password:  'Hieu@14402',
    port:  3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

module.exports = connection;
