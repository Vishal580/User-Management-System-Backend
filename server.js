const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST so database config can use them
dotenv.config();

const db = require('./config/database'); // returns pool, with db.initializeDatabase attached

const app = express();

// CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000'
].filter((v, i, a) => v && a.indexOf(v) === i);

const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser tools like curl/postman (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: Origin not allowed'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable preflight for all routes

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/settings', require('./routes/settings'));

// Test database connection and optionally initialize (only in non-production)
const testDatabaseConnection = async () => {
  try {
    await db.execute('SELECT 1');
    console.log('Database connected successfully');

    if (process.env.NODE_ENV !== 'production' && typeof db.initializeDatabase === 'function') {
      try {
        await db.initializeDatabase();
        console.log('Database initialized (dev)');
      } catch (initErr) {
        console.error('Database initialization error:', initErr);
      }
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

testDatabaseConnection();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});