/**
 * RegisterPage
 * User registration form
 */

import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    school: '',
    major: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="main-content">
      <div className="d-flex justify-content-center align-items-center py-5">
        <Card style={{ width: '100%', maxWidth: '600px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Create Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Nguyễn Văn A"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Min 6 characters"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Re-enter password"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>School</Form.Label>
                    <Form.Control
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="e.g., HUST"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Major</Form.Label>
                    <Form.Control
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      placeholder="e.g., Computer Science"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </Form>

            <div className="text-center">
              <p className="mb-0">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default RegisterPage;
