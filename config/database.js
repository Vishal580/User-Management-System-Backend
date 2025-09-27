const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // added
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'admin_panel',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initializeDatabase() {
    const connection = await pool.getConnection();

    await connection.query(`CREATE DATABASE IF NOT EXISTS admin_panel;`);
    await connection.query(`USE admin_panel;`);

    await connection.query(`CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`);

    await connection.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`);

    // hash the demo admin password (use env var or fallback to 'admin123')
    const demoAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const hashedAdminPassword = await bcrypt.hash(demoAdminPassword, 10);

    // insert or update admin password on duplicate
    await connection.query(
        `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE password = VALUES(password);`,
        ['Admin', 'admin@admin.com', hashedAdminPassword]
    );

    await connection.query(`INSERT INTO users (name, email, phone, status) VALUES 
        ('John Doe', 'john@example.com', '+1234567890', 'active'),
        ('Jane Smith', 'jane@example.com', '+1234567891', 'active'),
        ('Bob Johnson', 'bob@example.com', '+1234567892', 'inactive'),
        ('Alice Brown', 'alice@example.com', '+1234567893', 'active'),
        ('Charlie Wilson', 'charlie@example.com', '+1234567894', 'active')
        ON DUPLICATE KEY UPDATE email = email;`);

    connection.release();
}

initializeDatabase().catch(console.error);

module.exports = pool;