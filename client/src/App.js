/**
 * Main App component
 * Sets up routing and global layout
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DocumentsPage from './pages/DocumentsPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import FollowingPage from './pages/FollowingPage';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            
            {/* Private Routes */}
            <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/bookmarks" element={<PrivateRoute><BookmarksPage /></PrivateRoute>} />
            <Route path="/following" element={<PrivateRoute><FollowingPage /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
