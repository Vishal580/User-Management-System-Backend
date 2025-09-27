const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { login, getMe, verifyToken } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
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
// @access  Private
router.get('/me', auth, getMe);

// @route   POST /api/auth/verify
// @desc    Verify token
// @access  Private
router.post('/verify', auth, verifyToken);

module.exports = router;