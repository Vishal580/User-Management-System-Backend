const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { login, getMe, verifyToken } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], login);

// @route   GET /api/auth/me
// @desc    Get current admin
router.get('/me', auth, getMe);

// @route   POST /api/auth/verify
// @desc    Verify token
router.post('/verify', auth, verifyToken);

module.exports = router;