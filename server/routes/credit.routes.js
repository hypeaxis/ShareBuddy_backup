/**
 * Credit routes
 */

const express = require('express');
const router = express.Router();
const creditController = require('../controllers/credit.controller');
const authenticate = require('../middleware/authenticate');

// All routes are private
router.get('/transactions', authenticate, creditController.getTransactions);
router.post('/purchase', authenticate, creditController.purchaseCredits);

module.exports = router;
