/**
 * Bookmark controller
 * Handles document bookmarking/saving
 */

const { Bookmark, Document, User } = require('../models');

// @desc    Add bookmark
// @route   POST /api/bookmarks
// @access  Private
exports.addBookmark = async (req, res) => {
  try {
    const { documentId } = req.body;

    // Check if document exists
    const document = await Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({
      where: {
        userId: req.user.id,
        documentId
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Document already bookmarked'
      });
    }

    const bookmark = await Bookmark.create({
      userId: req.user.id,
      documentId
    });

    res.status(201).json({
      success: true,
      message: 'Document bookmarked successfully',
      data: { bookmark }
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding bookmark'
    });
  }
};

// @desc    Get user's bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
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
      data: { bookmarks }
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookmarks'
    });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:documentId
// @access  Private
exports.removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      where: {
        userId: req.user.id,
        documentId: req.params.documentId
      }
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    await bookmark.destroy();

    res.json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing bookmark'
    });
  }
};
