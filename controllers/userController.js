const { validationResult } = require('express-validator');
const User = require('../models/User');

// @desc    Get all users with pagination and search
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = (req.query.search || '').toString().trim();

    const result = await User.findAll({ page, limit, search });

    // return shape expected by frontend: response.data.data.{users,total,pages,currentPage}
    res.json({ data: result });
  } catch (error) {
    console.error('Get users error:', error && error.stack ? error.stack : error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private
const createUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, status } = req.body;

    // Check if email already exists
    const emailExists = await User.checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create user
    const userId = await User.create({ name, email, phone, status });
    const newUser = await User.findById(userId);

    res.status(201).json({
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.params.id;
    const { name, email, phone, status } = req.body;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email already exists (excluding current user)
    const emailExists = await User.checkEmailExists(email, userId);
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Update user
    const updated = await User.update(userId, { name, email, phone, status });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update user' });
    }

    const updatedUser = await User.findById(userId);

    res.json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    const deleted = await User.delete(userId);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete user' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};