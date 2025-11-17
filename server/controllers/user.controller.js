/**
 * User controller
 * Handles user profile management and history
 */

const { User, Document, Download, Follow } = require('../models');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Document,
          as: 'documents',
          where: { status: 'approved' },
          required: false,
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get follower/following counts
    const followerCount = await Follow.count({ where: { followingId: user.id } });
    const followingCount = await Follow.count({ where: { followerId: user.id } });

    res.json({
      success: true,
      data: {
        user,
        stats: {
          followers: followerCount,
          following: followingCount
        }
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, school, major } = req.body;

    const user = await User.findByPk(req.user.id);

    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (school !== undefined) user.school = school;
    if (major !== undefined) user.major = major;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};

// @desc    Get user's uploaded documents
// @route   GET /api/users/my-documents
// @access  Private
exports.getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    console.error('Get my documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
};

// @desc    Get user's download history
// @route   GET /api/users/download-history
// @access  Private
exports.getDownloadHistory = async (req, res) => {
  try {
    const downloads = await Download.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Document,
          as: 'document',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'fullName', 'avatar']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { downloads }
    });
  } catch (error) {
    console.error('Get download history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching download history'
    });
  }
};
