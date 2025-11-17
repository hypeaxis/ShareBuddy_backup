/**
 * User model - Represents users in the system
 * Supports regular users, moderators, and admins
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // null for OAuth users
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  school: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  major: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  role: {
    type: DataTypes.ENUM('user', 'moderator', 'admin'),
    defaultValue: 'user'
  },
  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 10 // Starting credits
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  oauth: {
    type: DataTypes.JSONB,
    defaultValue: null // { provider: 'google', providerId: '...' }
  }
}, {
  timestamps: true,
  tableName: 'users'
});

// Hash password before creating user
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hash password before updating user
User.beforeUpdate(async (user) => {
  if (user.changed('password') && user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Method to check password
User.prototype.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
