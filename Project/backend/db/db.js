const mysql = require('mysql2/promise');
require('dotenv').config();

const db_host = process.env.DATABASE_HOST;
const db_user = process.env.DATABASE_USER;
const db_password = process.env.DATABASE_PASSWORD;
const db_name = process.env.DATABASE_NAME;

const pool = mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_name,
});

const initializeDatabase = async () =>{
    try {
        const connection = await pool.getConnection();
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db_name}\``);
        console.log('Database initialized successfully');
        connection.release();
    } catch (error) {
        console.error('Error initializing database: ', error);
    }
};

initializeDatabase();

module.exports = pool;