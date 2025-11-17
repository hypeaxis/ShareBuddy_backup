/**
 * Comment routes
 */

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authenticate = require('../middleware/authenticate');

// Public routes
router.get('/document/:documentId', commentController.getDocumentComments);

// Private routes
router.post('/', authenticate, commentController.addComment);
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
