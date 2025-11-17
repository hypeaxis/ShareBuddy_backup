/**
 * Report controller
 * Handles document violation reports
 */

const { Report, Document, User } = require('../models');

// @desc    Create report for document
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { documentId, reason, description } = req.body;

    // Check if document exists
    const document = await Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Create report
    const report = await Report.create({
      documentId,
      reason,
      description,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: { report }
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating report'
    });
  }
};

// @desc    Get all reports (Admin/Moderator only)
// @route   GET /api/reports
// @access  Private (Admin/Moderator)
exports.getReports = async (req, res) => {
  try {
    const { status } = req.query;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const reports = await Report.findAll({
      where: whereClause,
      include: [
        {
          model: Document,
          as: 'document',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'fullName', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'fullName', 'email']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'fullName'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports'
    });
  }
};

// @desc    Update report status (Admin/Moderator only)
// @route   PUT /api/reports/:id
// @access  Private (Admin/Moderator)
exports.updateReport = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;

    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.status = status;
    report.reviewNote = reviewNote;
    report.reviewedBy = req.user.id;
    await report.save();

    // If resolved, update document status
    if (status === 'resolved') {
      const document = await Document.findByPk(report.documentId);
      if (document) {
        document.status = 'rejected';
        await document.save();
      }
    }

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: { report }
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating report'
    });
  }
};
