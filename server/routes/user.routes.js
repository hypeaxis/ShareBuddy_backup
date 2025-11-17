/**
 * User routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');

// Public routes
router.get('/:id', userController.getUserProfile);

// Private routes
router.put('/profile', authenticate, userController.updateProfile);
router.put('/password', authenticate, userController.changePassword);
router.get('/my/documents', authenticate, userController.getMyDocuments);
router.get('/my/downloads', authenticate, userController.getDownloadHistory);

module.exports = router;
