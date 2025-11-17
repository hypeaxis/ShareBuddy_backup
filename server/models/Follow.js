/**
 * Follow model - Allows users to follow other users/authors
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'follows',
  indexes: [
    {
      unique: true,
      fields: ['followerId', 'followingId']
    }
  ]
});

module.exports = Follow;
