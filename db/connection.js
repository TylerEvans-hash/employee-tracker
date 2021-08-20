const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1304358',
    database: 'employee_tracker'
});

module.exports = db;