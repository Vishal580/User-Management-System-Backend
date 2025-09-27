// Format date to readable string
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random string
const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Sanitize user input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Pagination helper
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

// Response wrapper
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

// Validate required fields
const validateRequiredFields = (requiredFields, data) => {
  const missing = [];
  requiredFields.forEach(field => {
    if (!data[field] || data[field].toString().trim() === '') {
      missing.push(field);
    }
  });
  return missing;
};

module.exports = {
  formatDate,
  isValidEmail,
  generateRandomString,
  sanitizeString,
  getPagination,
  successResponse,
  errorResponse,
  validateRequiredFields
};