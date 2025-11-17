/**
 * Admin routes
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All routes require authentication and admin/moderator role
router.get('/stats', authenticate, authorize('admin', 'moderator'), adminController.getDashboardStats);

// User management (Admin only)
router.get('/users', authenticate, authorize('admin'), adminController.getAllUsers);
router.put('/users/:id/role', authenticate, authorize('admin'), adminController.updateUserRole);
router.delete('/users/:id', authenticate, authorize('admin'), adminController.deleteUser);

// Document moderation (Admin/Moderator)
router.get('/documents', authenticate, authorize('admin', 'moderator'), adminController.getAllDocuments);
router.put('/documents/:id/status', authenticate, authorize('admin', 'moderator'), adminController.updateDocumentStatus);

module.exports = router;
