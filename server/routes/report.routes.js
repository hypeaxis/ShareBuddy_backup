/**
 * Report routes
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Private routes
router.post('/', authenticate, reportController.createReport);
router.get('/', authenticate, authorize('admin', 'moderator'), reportController.getReports);
router.put('/:id', authenticate, authorize('admin', 'moderator'), reportController.updateReport);

module.exports = router;
