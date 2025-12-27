const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const { mongoIdValidation } = require('../middleware/validation.middleware');

// Public routes
router.get('/', assignmentController.getAllAssignments);
router.get('/categories', assignmentController.getCategories);
router.get('/stats/difficulty', assignmentController.getDifficultyStats);
router.get('/:id', mongoIdValidation, assignmentController.getAssignmentById);

module.exports = router;
