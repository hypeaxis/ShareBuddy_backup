/**
 * Document controller
 * Handles document upload, retrieval, search, download operations
 */

const { Document, User, Comment, Bookmark, Download, CreditTransaction } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// @desc    Upload new document
// @route   POST /api/documents
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { title, description, school, subject, tags, accessType, creditCost } = req.body;

    // Parse tags if string
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Create document
    const document = await Document.create({
      title,
      description,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: path.extname(req.file.originalname),
      school,
      subject,
      tags: parsedTags,
      accessType: accessType || 'public',
      creditCost: creditCost || 0,
      userId: req.user.id
    });

    // Award credits to uploader
    await CreditTransaction.create({
      userId: req.user.id,
      amount: 5,
      type: 'earn',
      reason: 'Document upload',
      relatedDocumentId: document.id
    });

    // Update user credits
    await User.increment('credits', { by: 5, where: { id: req.user.id } });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully. You earned 5 credits!',
      data: { document }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document'
    });
  }
};

// @desc    Get all documents with filters
// @route   GET /api/documents
// @access  Public
exports.getDocuments = async (req, res) => {
  try {
    const { search, school, subject, tag, page = 1, limit = 12, sortBy = 'createdAt', order = 'DESC' } = req.query;

    const whereClause = {
      status: 'approved'
    };

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // School filter
    if (school) {
      whereClause.school = { [Op.iLike]: `%${school}%` };
    }

    // Subject filter
    if (subject) {
      whereClause.subject = { [Op.iLike]: `%${subject}%` };
    }

    // Tag filter
    if (tag) {
      whereClause.tags = { [Op.contains]: [tag] };
    }

    const offset = (page - 1) * limit;

    const { count, rows: documents } = await Document.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, order]],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'avatar', 'isVerified']
        }
      ],
      distinct: true
    });

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
};

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Public
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'avatar', 'isVerified', 'school', 'major']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'fullName', 'avatar']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Increment view count
    await document.increment('viewCount');

    res.json({
      success: true,
      data: { document }
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching document'
    });
  }
};

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Private
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user has enough credits
    if (document.creditCost > 0) {
      const user = await User.findByPk(req.user.id);
      
      if (user.credits < document.creditCost) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient credits'
        });
      }

      // Deduct credits
      await CreditTransaction.create({
        userId: req.user.id,
        amount: -document.creditCost,
        type: 'spend',
        reason: 'Document download',
        relatedDocumentId: document.id
      });

      await User.decrement('credits', { by: document.creditCost, where: { id: req.user.id } });
    }

    // Record download
    await Download.create({
      userId: req.user.id,
      documentId: document.id
    });

    // Increment download count
    await document.increment('downloadCount');

    // Send file
    res.download(document.filePath, document.fileName);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading document'
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private (Owner or Admin)
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check authorization
    if (document.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await document.destroy();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document'
    });
  }
};
