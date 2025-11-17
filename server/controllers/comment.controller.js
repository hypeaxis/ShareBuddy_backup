/**
 * Comment controller
 * Handles comments and ratings on documents
 */

const { Comment, User, Document } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Add comment/rating to document
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { documentId, content, rating } = req.body;

    // Check if document exists
    const document = await Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      rating: rating || null,
      userId: req.user.id,
      documentId
    });

    // Update document average rating if rating provided
    if (rating) {
      const { count, rows } = await Comment.findAndCountAll({
        where: { documentId, rating: { [sequelize.Op.ne]: null } }
      });

      const totalRating = rows.reduce((sum, c) => sum + c.rating, 0);
      document.averageRating = totalRating / count;
      document.ratingCount = count;
      await document.save();
    }

    // Fetch comment with user data
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: commentWithUser }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
};

// @desc    Get comments for a document
// @route   GET /api/comments/document/:documentId
// @access  Public
exports.getDocumentComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { documentId: req.params.documentId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { comments }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments'
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Owner or Admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check authorization
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.destroy();

    // Recalculate document rating
    const document = await Document.findByPk(comment.documentId);
    const { count, rows } = await Comment.findAndCountAll({
      where: { documentId: comment.documentId, rating: { [sequelize.Op.ne]: null } }
    });

    if (count > 0) {
      const totalRating = rows.reduce((sum, c) => sum + c.rating, 0);
      document.averageRating = totalRating / count;
      document.ratingCount = count;
    } else {
      document.averageRating = 0;
      document.ratingCount = 0;
    }
    await document.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment'
    });
  }
};
