/**
 * AdminDashboard
 * Admin panel for managing users, documents, and reports
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Table, Button, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { isModerator, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isModerator) {
      navigate('/');
      return;
    }
    loadDashboard();
  }, [isModerator]);

  const loadDashboard = async () => {
    try {
      const [statsRes, usersRes, docsRes, reportsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        isAdmin ? axios.get('/api/admin/users?limit=10') : Promise.resolve({ data: { data: { users: [] } } }),
        axios.get('/api/admin/documents?limit=10'),
        axios.get('/api/reports?status=pending')
      ]);

      setStats(statsRes.data.data.stats);
      setUsers(usersRes.data.data.users || []);
      setDocuments(docsRes.data.data.documents);
      setReports(reportsRes.data.data.reports);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocumentStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/documents/${id}/status`, { status });
      loadDashboard();
    } catch (error) {
      alert('Failed to update document status');
    }
  };

  const handleUpdateReportStatus = async (id, status, reviewNote) => {
    try {
      await axios.put(`/api/reports/${id}`, { status, reviewNote });
      loadDashboard();
    } catch (error) {
      alert('Failed to update report status');
    }
  };

  if (loading) {
    return <Container className="text-center my-5">Loading...</Container>;
  }

  return (
    <Container className="main-content">
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <div className="admin-stat-card">
            <h2>{stats?.totalUsers || 0}</h2>
            <p className="mb-0">Total Users</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="admin-stat-card">
            <h2>{stats?.totalDocuments || 0}</h2>
            <p className="mb-0">Total Documents</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="admin-stat-card">
            <h2>{stats?.pendingReports || 0}</h2>
            <p className="mb-0">Pending Reports</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="admin-stat-card">
            <h2>{stats?.totalDownloads || 0}</h2>
            <p className="mb-0">Total Downloads</p>
          </div>
        </Col>
      </Row>

      <Tabs defaultActiveKey="documents" className="mb-3">
        {isAdmin && (
          <Tab eventKey="users" title={`Users (${users.length})`}>
            <Card>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Credits</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'moderator' ? 'warning' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td>{user.credits}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        )}

        <Tab eventKey="documents" title={`Documents (${documents.length})`}>
          <Card>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Downloads</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.title}</td>
                      <td>{doc.author?.fullName}</td>
                      <td>
                        <Badge bg={
                          doc.status === 'approved' ? 'success' :
                          doc.status === 'pending' ? 'warning' : 'danger'
                        }>
                          {doc.status}
                        </Badge>
                      </td>
                      <td>{doc.downloadCount}</td>
                      <td>
                        {doc.status !== 'approved' && (
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => handleUpdateDocumentStatus(doc.id, 'approved')}
                          >
                            Approve
                          </Button>
                        )}
                        {doc.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleUpdateDocumentStatus(doc.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="reports" title={`Reports (${reports.length})`}>
          <Card>
            <Card.Body>
              {reports.length === 0 ? (
                <Alert variant="info">No pending reports</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Reporter</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.document?.title}</td>
                        <td>{report.reporter?.fullName}</td>
                        <td>{report.reason}</td>
                        <td>
                          <Badge bg="warning">{report.status}</Badge>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => handleUpdateReportStatus(report.id, 'resolved', 'Report reviewed and resolved')}
                          >
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateReportStatus(report.id, 'rejected', 'Report rejected')}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AdminDashboard;
