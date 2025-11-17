/**
 * Bookmark routes
 */

const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const authenticate = require('../middleware/authenticate');

// All routes are private
router.post('/', authenticate, bookmarkController.addBookmark);
router.get('/', authenticate, bookmarkController.getBookmarks);
router.delete('/:documentId', authenticate, bookmarkController.removeBookmark);

module.exports = router;
