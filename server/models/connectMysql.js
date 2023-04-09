require('dotenv').config()
const mysql = require('mysql2/promise')

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
});

module.exports = connection