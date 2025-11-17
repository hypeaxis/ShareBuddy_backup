/**
 * Follow routes
 */

const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow.controller');
const authenticate = require('../middleware/authenticate');

// All routes are private
router.post('/', authenticate, followController.followUser);
router.delete('/:userId', authenticate, followController.unfollowUser);
router.get('/followers', authenticate, followController.getFollowers);
router.get('/following', authenticate, followController.getFollowing);
router.get('/feed', authenticate, followController.getFollowingFeed);

module.exports = router;
