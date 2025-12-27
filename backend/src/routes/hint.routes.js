const express = require('express');
const router = express.Router();
const hintController = require('../controllers/hint.controller');
const { hintValidation } = require('../middleware/validation.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');

// Hint routes
router.post('/', optionalAuth, hintValidation, hintController.getHint);
router.post('/explain', hintController.explainConcept);

module.exports = router;
