/**
 * Document routes
 */

const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/upload');

// Public routes
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);

// Private routes
router.post('/', authenticate, upload.single('file'), documentController.uploadDocument);
router.get('/:id/download', authenticate, documentController.downloadDocument);
router.delete('/:id', authenticate, documentController.deleteDocument);

module.exports = router;
