const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');

// Update admin profile (name)
const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name } = req.body;
    const adminId = req.admin.id;

    // Update admin profile
    const updated = await Admin.updateProfile(adminId, name);
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update profile' });
    }

    // Get updated admin data
    const updatedAdmin = await Admin.findById(adminId);

    res.json({
      message: 'Profile updated successfully',
      admin: updatedAdmin
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin password
const updatePassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    // Get current admin data
    const admin = await Admin.findByEmail(req.admin.email);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Validate current password
    const isValidPassword = await Admin.validatePassword(currentPassword, admin.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    const updated = await Admin.updatePassword(adminId, newPassword);
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update password' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin settings
const getSettings = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      message: 'Settings retrieved successfully',
      admin
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateProfile,
  updatePassword,
  getSettings
};