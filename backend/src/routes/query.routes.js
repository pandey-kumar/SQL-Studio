const express = require('express');
const router = express.Router();
const queryController = require('../controllers/query.controller');
const { queryValidation } = require('../middleware/validation.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');

// Query execution routes
router.post('/execute', optionalAuth, queryValidation, queryController.executeQuery);
router.post('/validate', optionalAuth, queryValidation, queryController.validateResult);

module.exports = router;
