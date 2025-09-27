const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  updateProfile,
  updatePassword,
  getSettings
} = require('../controllers/settingsController');

const router = express.Router();

// Profile validation rules
const profileValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters')
];

// Password validation rules
const passwordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// @route   GET /api/settings
// @desc    Get admin settings
// @access  Private
router.get('/', auth, getSettings);

// @route   PUT /api/settings/profile
// @desc    Update admin profile
// @access  Private
router.put('/profile', [auth, ...profileValidation], updateProfile);

// @route   PUT /api/settings/password
// @desc    Update admin password
// @access  Private
router.put('/password', [auth, ...passwordValidation], updatePassword);

module.exports = router;