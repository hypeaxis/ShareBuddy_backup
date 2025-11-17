/**
 * Model associations and relationships
 * Defines relationships between all database models
 */

const User = require('./User');
const Document = require('./Document');
const Comment = require('./Comment');
const CreditTransaction = require('./CreditTransaction');
const Report = require('./Report');
const Bookmark = require('./Bookmark');
const Follow = require('./Follow');
const Download = require('./Download');

// User - Document relationships
User.hasMany(Document, { foreignKey: 'userId', as: 'documents' });
Document.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// User - Comment relationships
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Document - Comment relationships
Document.hasMany(Comment, { foreignKey: 'documentId', as: 'comments' });
Comment.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

// User - CreditTransaction relationships
User.hasMany(CreditTransaction, { foreignKey: 'userId', as: 'creditTransactions' });
CreditTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Document - CreditTransaction relationships
Document.hasMany(CreditTransaction, { foreignKey: 'relatedDocumentId', as: 'creditTransactions' });
CreditTransaction.belongsTo(Document, { foreignKey: 'relatedDocumentId', as: 'relatedDocument' });

// User - Report relationships
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'reporter' });

// Document - Report relationships
Document.hasMany(Report, { foreignKey: 'documentId', as: 'reports' });
Report.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

// Report - Reviewer relationships
Report.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });

// User - Bookmark relationships
User.hasMany(Bookmark, { foreignKey: 'userId', as: 'bookmarks' });
Bookmark.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Document - Bookmark relationships
Document.hasMany(Bookmark, { foreignKey: 'documentId', as: 'bookmarks' });
Bookmark.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

// User - Follow relationships (self-referencing)
User.belongsToMany(User, { 
  through: Follow, 
  as: 'followers', 
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

User.belongsToMany(User, { 
  through: Follow, 
  as: 'following', 
  foreignKey: 'followerId',
  otherKey: 'followingId'
});

// User - Download relationships
User.hasMany(Download, { foreignKey: 'userId', as: 'downloads' });
Download.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Document - Download relationships
Document.hasMany(Download, { foreignKey: 'documentId', as: 'downloads' });
Download.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

module.exports = {
  User,
  Document,
  Comment,
  CreditTransaction,
  Report,
  Bookmark,
  Follow,
  Download
};
