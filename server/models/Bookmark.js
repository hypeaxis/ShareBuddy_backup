/**
 * Bookmark model - Allows users to save documents for later
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bookmark = sequelize.define('Bookmark', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'documents',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'bookmarks',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'documentId']
    }
  ]
});

module.exports = Bookmark;
