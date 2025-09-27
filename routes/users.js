const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// User validation rules
const userValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number must be maximum 20 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
];

// @route   GET /api/users
// @desc    Get all users with pagination and search
// @access  Private
router.get('/', auth, getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', auth, getUser);

// @route   POST /api/users
// @desc    Create new user
// @access  Private
router.post('/', [auth, ...userValidation], createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', [auth, ...userValidation], updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, deleteUser);

module.exports = router;