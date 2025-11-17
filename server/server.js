/**
 * Main server file for Document Sharing Application
 * Handles Express server initialization, middleware setup, and route configuration
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const { sequelize } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const documentRoutes = require('./routes/document.routes');
const commentRoutes = require('./routes/comment.routes');
const creditRoutes = require('./routes/credit.routes');
const reportRoutes = require('./routes/report.routes');
const adminRoutes = require('./routes/admin.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');
const followRoutes = require('./routes/follow.routes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/follows', followRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database models (use { force: true } to drop tables in development)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
