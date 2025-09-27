const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin still exists
    const [admin] = await db.execute('SELECT id, name, email FROM admins WHERE id = ?', [decoded.id]);
    
    if (admin.length === 0) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    req.admin = admin[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;