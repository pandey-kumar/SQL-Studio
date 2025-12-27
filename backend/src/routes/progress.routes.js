const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const { optionalAuth } = require('../middleware/auth.middleware');
const { assignmentIdValidation } = require('../middleware/validation.middleware');

// Progress routes (support both authenticated and session-based users)
router.get('/me', optionalAuth, progressController.getUserProgress);
router.get('/:assignmentId', optionalAuth, assignmentIdValidation, progressController.getProgress);
router.patch('/:assignmentId', optionalAuth, assignmentIdValidation, progressController.updateProgress);
router.post('/:assignmentId/complete', optionalAuth, assignmentIdValidation, progressController.markCompleted);
router.post('/:assignmentId/hint', optionalAuth, assignmentIdValidation, progressController.useHint);

module.exports = router;
