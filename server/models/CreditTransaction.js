/**
 * CreditTransaction model - Tracks credit transactions for users
 * Records earning and spending of credits
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CreditTransaction = sequelize.define('CreditTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('earn', 'spend', 'purchase'),
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  relatedDocumentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'documents',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'credit_transactions'
});

module.exports = CreditTransaction;
