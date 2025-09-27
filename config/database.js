const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // added
dotenv.config();

function getPoolOptionsFromEnv() {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      const user = decodeURIComponent(url.username);
      const password = decodeURIComponent(url.password);
      const host = url.hostname;
      const port = url.port ? Number(url.port) : 3306;
      const database = url.pathname ? url.pathname.replace(/^\//, '') : undefined;
      const opts = {
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
        queueLimit: 0
      };
      if (process.env.DB_SSL === 'true') {
        opts.ssl = { rejectUnauthorized: false };
      }
      return opts;
    } catch (err) {
      console.error('Invalid DATABASE_URL:', err.message);
    }
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'admin_panel',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(getPoolOptionsFromEnv());

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'admin_panel'}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME || 'admin_panel'}\`;`);

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

    // seed demo admin only in non-production or when DEFAULT_ADMIN_PASSWORD is provided
    if (process.env.NODE_ENV !== 'production') {
      const demoAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      const hashedAdminPassword = await bcrypt.hash(demoAdminPassword, 10);

      await connection.query(
        `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE password = VALUES(password);`,
        ['Admin', 'admin@admin.com', hashedAdminPassword]
      );

      await connection.query(`INSERT IGNORE INTO users (name, email, phone, status) VALUES 
        ('John Doe', 'john@example.com', '+1234567890', 'active'),
        ('Jane Smith', 'jane@example.com', '+1234567891', 'active'),
        ('Bob Johnson', 'bob@example.com', '+1234567892', 'inactive'),
        ('Alice Brown', 'alice@example.com', '+1234567893', 'active'),
        ('Charlie Wilson', 'charlie@example.com', '+1234567894', 'active');`);
    }
  } finally {
    connection.release();
  }
}

// attach initializeDatabase to pool for backward compatibility (require('./config/database') yields pool)
pool.initializeDatabase = initializeDatabase;

module.exports = pool;