/**
 * Navigation component
 * Main navigation bar with authentication-aware menu
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FiUpload, FiBookmark, FiUsers, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';

function Navigation() {
  const { user, logout, isAuthenticated, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          📚 Document Sharing
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/documents">Browse Documents</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/upload"><FiUpload /> Upload</Nav.Link>
                <Nav.Link as={Link} to="/bookmarks"><FiBookmark /> Bookmarks</Nav.Link>
                <Nav.Link as={Link} to="/following"><FiUsers /> Following</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                {(isAdmin || isModerator) && (
                  <Nav.Link as={Link} to="/admin">Admin Panel</Nav.Link>
                )}
                <NavDropdown 
                  title={
                    <>
                      <FiUser /> {user?.fullName} 
                      <Badge bg="light" text="dark" className="ms-2">
                        {user?.credits} credits
                      </Badge>
                    </>
                  } 
                  id="user-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <FiSettings /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
