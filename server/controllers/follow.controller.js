/**
 * Follow controller
 * Handles user following functionality
 */

const { Follow, User, Document } = require('../models');

// @desc    Follow a user
// @route   POST /api/follows
// @access  Private
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Can't follow yourself
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    // Check if user exists
    const userToFollow = await User.findByPk(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already following
    const existing = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: userId
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    const follow = await Follow.create({
      followerId: req.user.id,
      followingId: userId
    });

    res.status(201).json({
      success: true,
      message: 'User followed successfully',
      data: { follow }
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error following user'
    });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/follows/:userId
// @access  Private
exports.unfollowUser = async (req, res) => {
  try {
    const follow = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: 'Not following this user'
      });
    }

    await follow.destroy();

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unfollowing user'
    });
  }
};

// @desc    Get user's followers
// @route   GET /api/follows/followers
// @access  Private
exports.getFollowers = async (req, res) => {
  try {
    const follows = await Follow.findAll({
      where: { followingId: req.user.id },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'fullName', 'avatar', 'school']
        }
      ]
    });

    const followers = follows.map(f => f.follower);

    res.json({
      success: true,
      data: { followers }
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching followers'
    });
  }
};

// @desc    Get users being followed
// @route   GET /api/follows/following
// @access  Private
exports.getFollowing = async (req, res) => {
  try {
    const follows = await Follow.findAll({
      where: { followerId: req.user.id },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'fullName', 'avatar', 'school']
        }
      ]
    });

    const following = follows.map(f => f.following);

    res.json({
      success: true,
      data: { following }
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching following'
    });
  }
};

// @desc    Get recent documents from followed users
// @route   GET /api/follows/feed
// @access  Private
exports.getFollowingFeed = async (req, res) => {
  try {
    const follows = await Follow.findAll({
      where: { followerId: req.user.id },
      attributes: ['followingId']
    });

    const followingIds = follows.map(f => f.followingId);

    const documents = await Document.findAll({
      where: {
        userId: followingIds,
        status: 'approved'
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    console.error('Get following feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feed'
    });
  }
};
