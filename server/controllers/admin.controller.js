/**
 * Admin controller
 * Handles admin and moderator operations
 */

const { User, Document, Report, CreditTransaction } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin/Moderator)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalDocuments = await Document.count();
    const pendingReports = await Report.count({ where: { status: 'pending' } });
    const totalDownloads = await sequelize.query(
      'SELECT SUM("downloadCount") as total FROM documents',
      { type: sequelize.QueryTypes.SELECT }
    );

    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'fullName', 'email', 'createdAt', 'role']
    });

    const recentDocuments = await Document.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalDocuments,
          pendingReports,
          totalDownloads: totalDownloads[0]?.total || 0
        },
        recentUsers,
        recentDocuments
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Can't delete yourself
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

// @desc    Get all documents for moderation
// @route   GET /api/admin/documents
// @access  Private (Admin/Moderator)
exports.getAllDocuments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: documents } = await Document.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'email']
        }
      ]
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
    console.error('Get all documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
};

// @desc    Update document status
// @route   PUT /api/admin/documents/:id/status
// @access  Private (Admin/Moderator)
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    document.status = status;
    await document.save();

    res.json({
      success: true,
      message: 'Document status updated successfully',
      data: { document }
    });
  } catch (error) {
    console.error('Update document status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating document status'
    });
  }
};
