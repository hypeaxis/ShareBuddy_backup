/**
 * Download model - Tracks document download history
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Download = sequelize.define('Download', {
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
  tableName: 'downloads'
});

module.exports = Download;
