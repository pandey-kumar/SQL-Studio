const { body, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidation
];

// Query validation rules
exports.queryValidation = [
  body('query')
    .trim()
    .notEmpty().withMessage('SQL query is required')
    .isLength({ max: 5000 }).withMessage('Query too long'),
  body('assignmentId')
    .notEmpty().withMessage('Assignment ID is required')
    .isMongoId().withMessage('Invalid assignment ID'),
  handleValidation
];

// Hint validation rules
exports.hintValidation = [
  body('assignmentId')
    .notEmpty().withMessage('Assignment ID is required')
    .isMongoId().withMessage('Invalid assignment ID'),
  body('currentQuery')
    .optional()
    .isLength({ max: 5000 }).withMessage('Query too long'),
  body('specificQuestion')
    .optional()
    .isLength({ max: 500 }).withMessage('Question too long'),
  handleValidation
];

// MongoDB ID validation
exports.mongoIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidation
];

exports.assignmentIdValidation = [
  param('assignmentId')
    .isMongoId().withMessage('Invalid assignment ID format'),
  handleValidation
];
