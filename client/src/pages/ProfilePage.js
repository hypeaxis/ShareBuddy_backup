/**
 * ProfilePage
 * User profile management page
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword, getMyDocuments, getDownloadHistory } from '../services/userService';
import DocumentCard from '../components/DocumentCard';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    school: user?.school || '',
    major: user?.major || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [myDocuments, setMyDocuments] = useState([]);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'documents') {
      loadMyDocuments();
    } else if (activeTab === 'downloads') {
      loadDownloadHistory();
    }
  }, [activeTab]);

  const loadMyDocuments = async () => {
    try {
      const data = await getMyDocuments();
      setMyDocuments(data.data.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const loadDownloadHistory = async () => {
    try {
      const data = await getDownloadHistory();
      setDownloadHistory(data.data.downloads);
    } catch (error) {
      console.error('Error loading download history:', error);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await updateProfile(profileForm);
      updateUser(profileForm);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'danger', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="main-content">
      <h1 className="mb-4">My Profile</h1>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <Row>
        <Col lg={3}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="profile-avatar mb-3 mx-auto" style={{
                width: '120px',
                height: '120px',
                background: '#007bff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '48px'
              }}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <h5>{user?.fullName}</h5>
              <p className="text-muted">{user?.email}</p>
              <div className="credit-badge mt-3">
                {user?.credits} Credits
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="profile" title="Edit Profile">
              <Card>
                <Card.Body>
                  <Form onSubmit={handleProfileSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={profileForm.fullName}
                        onChange={handleProfileChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        placeholder="Tell us about yourself..."
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>School</Form.Label>
                          <Form.Control
                            type="text"
                            name="school"
                            value={profileForm.school}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Major</Form.Label>
                          <Form.Control
                            type="text"
                            name="major"
                            value={profileForm.major}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="password" title="Change Password">
              <Card>
                <Card.Body>
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="documents" title="My Documents">
              <Row>
                {myDocuments.map((doc) => (
                  <Col key={doc.id} md={6} lg={4} className="mb-3">
                    <DocumentCard document={doc} />
                  </Col>
                ))}
              </Row>
              {myDocuments.length === 0 && (
                <Alert variant="info">You haven't uploaded any documents yet.</Alert>
              )}
            </Tab>

            <Tab eventKey="downloads" title="Download History">
              <ListGroup>
                {downloadHistory.map((download) => (
                  <ListGroup.Item key={download.id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6>{download.document?.title}</h6>
                        <small className="text-muted">
                          by {download.document?.author?.fullName}
                        </small>
                      </div>
                      <small className="text-muted">
                        {new Date(download.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {downloadHistory.length === 0 && (
                <Alert variant="info">No download history yet.</Alert>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
